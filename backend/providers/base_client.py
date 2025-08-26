from openai import AsyncOpenAI, RateLimitError, APIError
from models.chat import ChatResponse, ChatCompletionChunk, ChatRequest, Usage, Choice, ChoiceMessage, ChoiceChunk, Delta
from auth.check_key import increment_usage_count, increment_rate_limit_count
from exceptions import RateLimitExceededError, ProviderAPIError
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens
import json, time, uuid


class BaseLLMClient:
    def __init__(self, api_keys, base_url: str):
        self.api_keys = api_keys
        self.base_url = base_url

    def _extract_model(self, model: str) -> str:
        parts = model.split(":", 1)
        return parts[1] if len(parts) > 1 else model

    async def chat_completions(self, req: ChatRequest) -> ChatResponse:
        """
        Non-streaming chat completion built on top of streaming API.
        Collects streamed chunks and returns a final ChatResponse object.
        """
        model = self._extract_model(req.model)
        last_error = None

        # Calculate prompt tokens
        prompt_tokens = count_tokens_in_messages(req.messages, req.model)

        for key_data in self.api_keys:
            api_key = key_data["encrypted_key"]
            api_key_id = key_data["id"]

            try:
                client = AsyncOpenAI(api_key=api_key, base_url=self.base_url)
                
                # Convert messages to dict format for OpenAI API
                messages_dict = []
                for msg in req.messages:
                    messages_dict.append({
                        "role": msg.role,
                        "content": msg.content
                    })
                
                # Handle reasoning_effort parameter
                create_params = {
                    "model": model,
                    "messages": messages_dict,
                    "temperature": req.temperature,
                    "stream": True
                }
                
                if req.reasoning_effort and req.reasoning_effort in ['minimal', 'low', 'medium', 'high']:
                    create_params["reasoning_effort"] = req.reasoning_effort
                
                response = await client.chat.completions.create(**create_params)

                increment_usage_count(api_key_id)

                # Collect streamed response
                role = None
                content_parts = []
                finish_reason = None
                async for chunk in response:
                    choice = chunk.choices[0]
                    if choice.delta.role:
                        role = choice.delta.role
                    if choice.delta.content:
                        content_parts.append(choice.delta.content)
                    if choice.finish_reason:
                        finish_reason = choice.finish_reason

                complete_content = "".join(content_parts)
                completion_tokens = estimate_completion_tokens(complete_content, req.model)
                total_tokens = prompt_tokens + completion_tokens

                return ChatResponse(
                    id=str(uuid.uuid4()),
                    object="chat.completion",
                    created=int(time.time()),
                    model=req.model,
                    choices=[
                        Choice(
                            index=0,
                            message=ChoiceMessage(role=role or "assistant", content=complete_content),
                            finish_reason=finish_reason or "stop",
                        )
                    ],
                    key_name=key_data["name"],
                    usage=Usage(
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens,
                        total_tokens=total_tokens
                    ),
                    system_fingerprint=f"fp_{int(time.time())}"
                )

            except RateLimitError as e:
                last_error = RateLimitExceededError(str(e))
            except APIError as e:
                status_code = getattr(e, 'status_code', 500)
                last_error = ProviderAPIError(str(e), status_code=status_code)
            except Exception as e:
                last_error = ProviderAPIError(f"Unexpected error: {e}")

        if last_error:
            raise last_error
        
        # This should not happen if api_keys is not empty
        raise ProviderAPIError("No API keys available")

    async def stream_chat_completions(self, req: ChatRequest):
        """
        Streaming chat completion (SSE style).
        Yields individual chunks as they arrive.
        """
        model = self._extract_model(req.model)
        last_error = None

        # Calculate prompt tokens
        prompt_tokens = count_tokens_in_messages(req.messages, req.model)

        for key_data in self.api_keys:
            api_key = key_data["encrypted_key"]
            api_key_id = key_data["id"]

            try:
                client = AsyncOpenAI(api_key=api_key, base_url=self.base_url)
                
                # Convert messages to dict format for OpenAI API
                messages_dict = []
                for msg in req.messages:
                    messages_dict.append({
                        "role": msg.role,
                        "content": msg.content
                    })
                
                # Handle reasoning_effort parameter
                create_params = {
                    "model": model,
                    "messages": messages_dict,
                    "temperature": req.temperature,
                    "stream": True
                }
                
                if req.reasoning_effort and req.reasoning_effort in ['minimal', 'low', 'medium', 'high']:
                    create_params["reasoning_effort"] = req.reasoning_effort
                
                response = await client.chat.completions.create(**create_params)

                increment_usage_count(api_key_id)

                # Track completion content for token counting
                completion_content = ""
                finish_reason = None

                async for chunk in response:
                    delta = {}
                    if chunk.choices[0].delta.role:
                        delta["role"] = chunk.choices[0].delta.role
                    if chunk.choices[0].delta.content:
                        delta["content"] = chunk.choices[0].delta.content
                        completion_content += chunk.choices[0].delta.content
                    
                    # Capture finish reason
                    if chunk.choices[0].finish_reason:
                        finish_reason = chunk.choices[0].finish_reason
                        delta = {}  # Empty delta for final chunk

                    event = ChatCompletionChunk(
                        id=str(uuid.uuid4()),
                        object="chat.completion.chunk",
                        created=int(time.time()),
                        model=req.model,
                        choices=[ChoiceChunk(
                            index=0, 
                            delta=Delta(**delta),
                            finish_reason=finish_reason
                        )],
                        key_name=key_data["name"],
                        system_fingerprint=f"fp_{int(time.time())}"
                    ).model_dump_json()

                    yield f"data: {event}\n\n"

                # Send usage information in final chunk before [DONE]
                completion_tokens = estimate_completion_tokens(completion_content, req.model)
                total_tokens = prompt_tokens + completion_tokens
                
                usage_chunk = ChatCompletionChunk(
                    id=str(uuid.uuid4()),
                    object="chat.completion.chunk",
                    created=int(time.time()),
                    model=req.model,
                    choices=[ChoiceChunk(
                        index=0,
                        delta=Delta(content=None),
                        finish_reason=None
                    )],  # Include choice with None content for usage chunk
                    key_name=key_data["name"],
                    usage=Usage(
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens,
                        total_tokens=total_tokens
                    ),
                    system_fingerprint=f"fp_{int(time.time())}"
                ).model_dump_json()

                yield f"data: {usage_chunk}\n\n"
                yield "data: [DONE]\n\n"
                return

            except RateLimitError as e:
                last_error = RateLimitExceededError(str(e))
            except APIError as e:
                status_code = getattr(e, 'status_code', 500)
                last_error = ProviderAPIError(str(e), status_code=status_code)
            except Exception as e:
                last_error = ProviderAPIError(f"Unexpected error: {e}")

        if last_error:
            raise last_error