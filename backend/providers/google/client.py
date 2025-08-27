import time
import uuid
from typing import AsyncGenerator
from openai import AsyncOpenAI, APIError, RateLimitError
from ..base_client import BaseLLMClient
from models.chat import ChatRequest, ChatCompletionChunk, ChoiceChunk, Delta, Usage
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens
from auth.check_key import increment_usage_count
from exceptions import RateLimitExceededError, ProviderAPIError

class GoogleClient(BaseLLMClient):
    def __init__(self, api_keys):
        super().__init__(api_keys, base_url="https://generativelanguage.googleapis.com/v1beta/openai/")
    
    async def stream_chat_completions(self, req: ChatRequest) -> AsyncGenerator[str, None]:
        """
        Custom streaming implementation for Google provider to handle their specific response format.
        Google often returns chunks with content=null but meaningful finish_reason or role data.
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
                has_yielded_content = False

                async for chunk in response:
                    # Check if chunk has choices and valid structure
                    if not chunk.choices or len(chunk.choices) == 0:
                        continue
                    
                    choice = chunk.choices[0]
                    delta = {}
                    current_finish_reason = None
                    
                    # Handle role
                    if hasattr(choice.delta, 'role') and choice.delta.role:
                        delta["role"] = choice.delta.role
                    
                    # Handle content - Google provider may send meaningful chunks with content=null
                    if hasattr(choice.delta, 'content'):
                        if choice.delta.content is not None:
                            delta["content"] = choice.delta.content
                            completion_content += choice.delta.content
                            has_yielded_content = True
                    
                    # Handle finish_reason
                    if hasattr(choice, 'finish_reason') and choice.finish_reason:
                        finish_reason = choice.finish_reason
                        current_finish_reason = finish_reason
                    
                    # For Google provider, yield chunks that have role, content, or finish_reason
                    # This includes chunks with content=null but meaningful finish_reason
                    should_yield = (
                        delta or  # Has role or content
                        current_finish_reason or  # Has finish reason
                        (hasattr(choice.delta, 'content') and choice.delta.content is None and has_yielded_content)  # Final null content chunk
                    )
                    
                    if should_yield:
                        event = ChatCompletionChunk(
                            id=str(uuid.uuid4()),
                            object="chat.completion.chunk",
                            created=int(time.time()),
                            model=req.model,
                            choices=[ChoiceChunk(
                                index=0, 
                                delta=Delta(**delta) if delta else Delta(content=None),
                                finish_reason=current_finish_reason
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
                    )],
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