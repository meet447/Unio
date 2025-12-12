from openai import AsyncOpenAI, RateLimitError, APIError
from models.chat import ChatResponse, ChatCompletionChunk, ChatRequest, Usage, Choice, ChoiceMessage, ChoiceChunk, Delta
from auth.check_key import increment_usage_count, increment_rate_limit_count
from exceptions import RateLimitExceededError, ProviderAPIError
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens
import time
import uuid
import logging

logger = logging.getLogger(__name__)

# Default timeout for API requests (seconds)
DEFAULT_TIMEOUT = 120.0


class BaseLLMClient:
    """
    Base LLM client for Unio - BYOK LLM Proxy Service.
    
    Key features:
    - Passthrough proxy: forwards requests to upstream providers
    - Key rotation: tries all user keys before failing
    - Any error triggers key rotation (not just rate limits)
    """
    
    def __init__(self, api_keys: list, base_url: str):
        self.api_keys = api_keys
        self.base_url = base_url

    def _extract_model(self, model: str) -> str:
        """Extract the actual model name from provider:model or provider/model format"""
        if ":" in model:
            parts = model.split(":", 1)
            return parts[1] if len(parts) > 1 else model
        return model

    def _build_request_params(self, req: ChatRequest) -> dict:
        """Build request parameters - passthrough all provided fields."""
        messages = []
        for msg in req.messages:
            msg_dict = msg.model_dump(exclude_none=True)
            messages.append(msg_dict)
        
        params = {
            "model": self._extract_model(req.model),
            "messages": messages,
            "stream": req.stream or False,
        }
        
        if req.temperature is not None:
            params["temperature"] = req.temperature
        if req.reasoning_effort is not None:
            params["reasoning_effort"] = req.reasoning_effort
        if req.tools:
            params["tools"] = [tool.model_dump() for tool in req.tools]
        if req.tool_choice is not None:
            params["tool_choice"] = req.tool_choice
        
        return params

    async def chat_completions(self, req: ChatRequest) -> ChatResponse:
        """
        Non-streaming chat completion with automatic key rotation.
        Tries ALL keys before failing - any error triggers rotation to next key.
        """
        errors = []
        rotation_log = []
        params = self._build_request_params(req)
        params["stream"] = False
        
        prompt_tokens = count_tokens_in_messages(req.messages, req.model)
        start_time = time.time()

        for i, key_data in enumerate(self.api_keys):
            api_key = key_data["encrypted_key"]
            api_key_id = key_data["id"]
            key_name = key_data.get("name", f"key_{i}")

            try:
                client = AsyncOpenAI(
                    api_key=api_key, 
                    base_url=self.base_url,
                    timeout=DEFAULT_TIMEOUT
                )
                
                response = await client.chat.completions.create(**params)
                increment_usage_count(api_key_id)
                rotation_log.append({"key": key_name, "status": "success"})
                
                # Calculate metrics
                end_time = time.time()
                duration = end_time - start_time
                
                # Success - build response
                choices = [Choice(
                    index=c.index,
                    message=ChoiceMessage(
                        role=c.message.role,
                        content=c.message.content,
                        tool_calls=c.message.tool_calls
                    ),
                    finish_reason=c.finish_reason
                ) for c in response.choices]
                
                usage = None
                completion_tokens = 0
                if response.usage:
                    usage = Usage(
                        prompt_tokens=response.usage.prompt_tokens,
                        completion_tokens=response.usage.completion_tokens,
                        total_tokens=response.usage.total_tokens
                    )
                    completion_tokens = response.usage.completion_tokens
                else:
                    completion_content = response.choices[0].message.content or ""
                    completion_tokens = estimate_completion_tokens(completion_content, req.model)
                    usage = Usage(
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens,
                        total_tokens=prompt_tokens + completion_tokens
                    )
                
                tokens_per_second = completion_tokens / duration if duration > 0 else 0
                
                return ChatResponse(
                    id=response.id or str(uuid.uuid4()),
                    object="chat.completion",
                    created=response.created or int(time.time()),
                    model=req.model,
                    choices=choices,
                    key_name=key_name,
                    usage=usage,
                    system_fingerprint=response.system_fingerprint,
                    latency_ms=0, # Per requirement
                    tokens_per_second=tokens_per_second,
                    key_rotation_log=rotation_log
                )

            except RateLimitError as e:
                logger.warning(f"Key {key_name} rate limited: {e}")
                increment_rate_limit_count(api_key_id)
                errors.append(("rate_limit", key_name, str(e)))
                rotation_log.append({"key": key_name, "status": "failed", "error": str(e)})
                # Continue to next key
                
            except APIError as e:
                status_code = getattr(e, 'status_code', 500)
                logger.warning(f"Key {key_name} API error ({status_code}): {e}")
                errors.append(("api_error", key_name, str(e)))
                rotation_log.append({"key": key_name, "status": "failed", "error": str(e)})
                # Continue to next key
                
            except Exception as e:
                # ANY error - continue to next key
                logger.warning(f"Key {key_name} error: {type(e).__name__}: {e}")
                errors.append(("error", key_name, str(e)))
                rotation_log.append({"key": key_name, "status": "failed", "error": str(e)})
                # Continue to next key

        # All keys exhausted - determine best error to return
        logger.error(f"All {len(self.api_keys)} keys exhausted. Errors: {errors}")
        
        if errors:
            last_type, _, last_msg = errors[-1]
            if last_type == "rate_limit":
                raise RateLimitExceededError(f"All keys rate limited. Last: {last_msg}")
            else:
                raise ProviderAPIError(f"All keys failed. Last: {last_msg}")
        
        raise ProviderAPIError("No API keys available")

    async def stream_chat_completions(self, req: ChatRequest):
        """
        Streaming chat completion with automatic key rotation.
        Tries ALL keys before failing - any error triggers rotation to next key.
        """
        errors = []
        rotation_log = []
        params = self._build_request_params(req)
        params["stream"] = True
        
        prompt_tokens = count_tokens_in_messages(req.messages, req.model)
        start_time = time.time()

        for i, key_data in enumerate(self.api_keys):
            api_key = key_data["encrypted_key"]
            api_key_id = key_data["id"]
            key_name = key_data.get("name", f"key_{i}")

            try:
                client = AsyncOpenAI(
                    api_key=api_key,
                    base_url=self.base_url,
                    timeout=DEFAULT_TIMEOUT
                )
                
                response = await client.chat.completions.create(**params)
                
                usage_incremented = False
                completion_content = ""
                first_token_time = None
                
                rotation_log.append({"key": key_name, "status": "success"})

                captured_usage = None

                async for chunk in response:
                    if not usage_incremented:
                        increment_usage_count(api_key_id)
                        usage_incremented = True
                    
                    if not first_token_time:
                        first_token_time = time.time()
                    
                    # Capture usage if present in the chunk
                    if hasattr(chunk, 'usage') and chunk.usage:
                         captured_usage = chunk.usage

                    if chunk.choices and chunk.choices[0].delta.content:
                        completion_content += chunk.choices[0].delta.content
                    
                    chunk_data = ChatCompletionChunk(
                        id=chunk.id or str(uuid.uuid4()),
                        object="chat.completion.chunk",
                        created=chunk.created or int(time.time()),
                        model=req.model,
                        choices=[ChoiceChunk(
                            index=c.index,
                            delta=Delta(
                                content=c.delta.content,
                                role=c.delta.role,
                                tool_calls=c.delta.tool_calls
                            ),
                            finish_reason=c.finish_reason
                        ) for c in chunk.choices],
                        # key_name is now excluded from the client stream to match original response structure
                        system_fingerprint=chunk.system_fingerprint,
                        usage=Usage(
                            prompt_tokens=chunk.usage.prompt_tokens,
                            completion_tokens=chunk.usage.completion_tokens,
                            total_tokens=chunk.usage.total_tokens
                        ) if hasattr(chunk, 'usage') and chunk.usage else None
                    )
                    
                    yield f"data: {chunk_data.model_dump_json(exclude_none=True)}\n\n"

                # Calculate metrics for logging
                if captured_usage:
                    completion_tokens = captured_usage.completion_tokens
                    prompt_tokens = captured_usage.prompt_tokens
                else:
                    completion_tokens = estimate_completion_tokens(completion_content, req.model)
                
                # Send DONE signal
                yield "data: [DONE]\n\n"
                
                end_time = time.time()
                duration = end_time - start_time
                latency_ms = (first_token_time - start_time) * 1000 if first_token_time else 0
                tokens_per_second = completion_tokens / duration if duration > 0 else 0
                
                # Yield metadata for internal logging
                yield {
                    "type": "internal_metadata",
                    "latency_ms": latency_ms,
                    "tokens_per_second": tokens_per_second,
                    "key_rotation_log": rotation_log,
                    "prompt_tokens": prompt_tokens,
                    "completion_tokens": completion_tokens,
                    "total_tokens": prompt_tokens + completion_tokens,
                    "key_name": key_name
                }
                
                return  # Success - exit

            except RateLimitError as e:
                logger.warning(f"Key {key_name} rate limited in streaming: {e}")
                increment_rate_limit_count(api_key_id)
                errors.append(("rate_limit", key_name, str(e)))
                rotation_log.append({"key": key_name, "status": "failed", "error": str(e)})
                
            except APIError as e:
                logger.warning(f"Key {key_name} API error in streaming: {e}")
                errors.append(("api_error", key_name, str(e)))
                rotation_log.append({"key": key_name, "status": "failed", "error": str(e)})
                
            except Exception as e:
                # ANY error - continue to next key
                logger.warning(f"Key {key_name} streaming error: {type(e).__name__}: {e}")
                errors.append(("error", key_name, str(e)))
                rotation_log.append({"key": key_name, "status": "failed", "error": str(e)})

        # All keys exhausted
        logger.error(f"All {len(self.api_keys)} keys exhausted in streaming. Errors: {errors}")
        
        if errors:
            last_type, _, last_msg = errors[-1]
            if last_type == "rate_limit":
                raise RateLimitExceededError(f"All keys rate limited. Last: {last_msg}")
            else:
                raise ProviderAPIError(f"All keys failed. Last: {last_msg}")
        
        raise ProviderAPIError("No API keys available for streaming")