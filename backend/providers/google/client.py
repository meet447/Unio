from openai import OpenAI, RateLimitError, APIError
from models.chat import ChatResponse, ChatRequest, ChatCompletionChunk
from auth.check_key import increment_usage_count, increment_rate_limit_count
from exceptions import RateLimitExceededError, ProviderAPIError
import json, time

class GoogleClient:
    def __init__(self, api_keys):
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
        self.api_keys = api_keys

    def chat_completions(self, req: ChatRequest):
        model = ":".join(req.model.split(":")[1:])
        last_error = None
        for key_data in self.api_keys:
            api_key = key_data['encrypted_key']
            api_key_id = key_data['id']
            try:
                client = OpenAI(api_key=api_key, base_url=self.base_url)
                response = client.chat.completions.create(
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
                                "content": c.message.content
                            },
                            "finish_reason": c.finish_reason
                        }
                        for i, c in enumerate(response.choices)
                    ]
                )
            except RateLimitError as e:
                increment_rate_limit_count(api_key_id)
                last_error = RateLimitExceededError(str(e))
                continue
            except APIError as e:
                last_error = ProviderAPIError(str(e), status_code=e.status_code)
                continue
            except Exception as e:
                last_error = ProviderAPIError(f"An unexpected error occurred: {e}")
                continue
        
        if last_error:
            raise last_error

    def stream_chat_completions(self, req: ChatRequest):
        model = ":".join(req.model.split(":")[1:])
        last_error = None
        for key_data in self.api_keys:
            api_key = key_data['encrypted_key']
            api_key_id = key_data['id']
            try:
                client = OpenAI(api_key=api_key, base_url=self.base_url)
                response = client.chat.completions.create(
                    model=model,
                    messages=req.messages,
                    temperature=req.temperature,
                    stream=True
                )
                increment_usage_count(api_key_id)
                for chunk in response:
                    event = ChatCompletionChunk(
                        id="82882",
                        object="chat.completion.chunk",
                        created=int(time.time()),
                        model=req.model,
                        choices=[
                            {"index": 0, "delta": {"content": chunk.choices[0].delta.content}}
                        ]
                    ).model_dump_json()
                    
                    yield f"data: {event}\n\n"
                
                yield "data: [DONE]\n\n"
                return

            except RateLimitError as e:
                increment_rate_limit_count(api_key_id)
                last_error = RateLimitExceededError(str(e))
                continue
            except APIError as e:
                last_error = ProviderAPIError(str(e), status_code=e.status_code)
                continue
            except Exception as e:
                last_error = ProviderAPIError(f"An unexpected error occurred: {e}")
                continue
        
        if last_error:
            error_content = {
                "error": {
                    "message": last_error.message,
                    "type": "rate_limit_exceeded" if isinstance(last_error, RateLimitExceededError) else "api_error",
                    "param": None,
                    "code": None
                }
            }
            yield f"data: {json.dumps(error_content)}\n\n"
            yield "data: [DONE]\n\n"
