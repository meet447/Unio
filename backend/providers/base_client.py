from openai import AsyncOpenAI, RateLimitError, APIError
from models.chat import ChatResponse, ChatCompletionChunk, ChatRequest
from auth.check_key import increment_usage_count, increment_rate_limit_count
from exceptions import RateLimitExceededError, ProviderAPIError
import json, time, uuid

class BaseLLMClient:
    def __init__(self, api_keys, base_url: str):
        self.api_keys = api_keys
        self.base_url = base_url

    def _extract_model(self, model: str) -> str:
        parts = model.split(":", 1)
        return parts[1] if len(parts) > 1 else model

    async def chat_completions(self, req: ChatRequest) -> ChatResponse:
        """Non-streaming chat completion"""
        model = self._extract_model(req.model)
        last_error = None

        for key_data in self.api_keys:
            api_key = key_data["encrypted_key"]
            api_key_id = key_data["id"]

            try:
                client = AsyncOpenAI(api_key=api_key, base_url=self.base_url)
                response = await client.chat.completions.create(
                    model=model,
                    messages=req.messages,
                    temperature=req.temperature
                )

                increment_usage_count(api_key_id)

                return ChatResponse(
                    id=response.id,
                    object=response.object,
                    created=response.created,
                    model=response.model,
                    choices=[
                        {
                            "index": i,
                            "message": {
                                "role": c.message.role,
                                "content": c.message.content,
                            },
                            "finish_reason": c.finish_reason,
                        }
                        for i, c in enumerate(response.choices)
                    ],
                )

            except RateLimitError as e:
                increment_rate_limit_count(api_key_id)
                last_error = RateLimitExceededError(str(e))
            except APIError as e:
                last_error = ProviderAPIError(str(e), status_code=e.status_code)
            except Exception as e:
                last_error = ProviderAPIError(f"Unexpected error: {e}")

        if last_error:
            raise last_error

    async def stream_chat_completions(self, req: ChatRequest):
        """Streaming chat completion (SSE)"""
        model = self._extract_model(req.model)
        last_error = None

        for key_data in self.api_keys:
            api_key = key_data["encrypted_key"]
            api_key_id = key_data["id"]

            try:
                client = AsyncOpenAI(api_key=api_key, base_url=self.base_url)
                response = await client.chat.completions.create(
                    model=model,
                    messages=req.messages,
                    temperature=req.temperature,
                    stream=True,
                )

                increment_usage_count(api_key_id)

                async for chunk in response:
                    delta = {}
                    if chunk.choices[0].delta.role:
                        delta["role"] = chunk.choices[0].delta.role
                    if chunk.choices[0].delta.content:
                        delta["content"] = chunk.choices[0].delta.content

                    event = ChatCompletionChunk(
                        id=str(uuid.uuid4()),
                        object="chat.completion.chunk",
                        created=int(time.time()),
                        model=req.model,
                        choices=[{"index": 0, "delta": delta}],
                    ).model_dump_json()

                    yield f"data: {event}\n\n"

                yield "data: [DONE]\n\n"
                return

            except RateLimitError as e:
                increment_rate_limit_count(api_key_id)
                last_error = RateLimitExceededError(str(e))
            except APIError as e:
                last_error = ProviderAPIError(str(e), status_code=e.status_code)
            except Exception as e:
                last_error = ProviderAPIError(f"Unexpected error: {e}")

        if last_error:
            error_content = {
                "error": {
                    "message": last_error.message,
                    "type": (
                        "rate_limit_exceeded"
                        if isinstance(last_error, RateLimitExceededError)
                        else "api_error"
                    ),
                    "param": None,
                    "code": None,
                }
            }
            yield f"data: {json.dumps(error_content)}\n\n"