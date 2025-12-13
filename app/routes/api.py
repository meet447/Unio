from fastapi import Header, APIRouter, Request, BackgroundTasks
from fastapi.responses import StreamingResponse, JSONResponse
from models.chat import ChatRequest
from services.provider import get_provider, get_all_providers
from services.provider import get_provider, get_all_providers
from auth.check_key import fetch_userid, fetch_all_providers_with_keys
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError, ModelNotFoundError
from utils.error_handler import create_error_response, get_error_response, log_request_async
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens
import time
import asyncio
import json
import logging
from pydantic import BaseModel
from typing import Any
from openai import AsyncOpenAI

router = APIRouter()
logger = logging.getLogger(__name__)


class VerifyKeyRequest(BaseModel):
    provider_name: str
    base_url: str = None
    api_key: str


@router.post("/verify-key")
async def verify_key(req: VerifyKeyRequest):
    """
    Verify an upstream API key by attempting to list models.
    """
    if not req.api_key:
         return JSONResponse(
            status_code=400,
            content={"error": "API Key is required"}
        )

    # Determine Base URL
    base_url = req.base_url
    if req.provider_name.lower() == "openai" and not base_url:
        base_url = None

    try:
        # Using OpenAI client to test connection (works for OAI-compatible endpoints)
        client = AsyncOpenAI(
            api_key=req.api_key,
            base_url=base_url,
            timeout=10.0 # Short timeout for verification
        )
        
        await client.models.list()
        
        return JSONResponse(content={"valid": True, "message": "Key verification successful"})
        
    except Exception as e:
        logger.warning(f"Key verification failed for {req.provider_name}: {e}")
        return JSONResponse(
            status_code=400,
            content={"valid": False, "error": str(e)}
        )


class FetchModelsRequest(BaseModel):
    user_id: str


@router.post("/models/fetch")
async def fetch_provider_models(req: FetchModelsRequest):
    """
    Fetch available models from all configured providers for a user.
    """
    providers_data = fetch_all_providers_with_keys(req.user_id)
    results = []

    async def fetch_for_provider(provider_id, keys):
        if not keys:
            return None
            
        # Use first active key
        key_record = keys[0]
        api_key = key_record.get('encrypted_key') # assuming plaintext for now as per verify_key
        
        # Get provider details
        provider_name = "Unknown"
        base_url = None
        
        if key_record.get('providers'):
            provider_name = key_record['providers'].get('name')
            base_url = key_record['providers'].get('base_url')
        
        # OpenAI default check
        if provider_name and provider_name.lower() == "openai" and not base_url:
            base_url = None

        try:
            client = AsyncOpenAI(
                api_key=api_key,
                base_url=base_url,
                timeout=10.0
            )
            models_page = await client.models.list()
            print(models_page)
            # Parse models
            model_list = []
            for m in models_page.data:
                model_list.append({"id": m.id, "created": m.created, "object": m.object})
                
            return {
                "provider": provider_name,
                "models": model_list
            }
        except Exception as e:
            logger.warning(f"Failed to fetch models for {provider_name}: {e}")
            return {
                "provider": provider_name,
                "error": str(e),
                "models": []
            }

    tasks = []
    for pid, keys in providers_data.items():
        tasks.append(fetch_for_provider(pid, keys))
        
    if tasks:
        fetched_results = await asyncio.gather(*tasks)
        results = [r for r in fetched_results if r]
    
    return JSONResponse(content={"data": results})



def is_empty_chunk(chunk: Any) -> bool:
    """Check if the chunk is an empty SSE delta with no content/info."""
    if not isinstance(chunk, str) or not chunk.startswith("data: "):
        return False
    
    data_str = chunk[6:].strip()
    if data_str == "[DONE]":
        return False
        
    try:
        data = json.loads(data_str)
        # Check for usage or other top-level fields
        if data.get("usage") or data.get("system_fingerprint"): # system_fingerprint often comes with empty delta? User said "system_fingerprint": "..." in empty chunk. 
            # If user considers system_fingerprint ONLY chunk as "empty", I should skip it?
            # User snippet showed: "system_fingerprint": "..." AND "delta": {}.
            # If I skip it, client might miss fingerprint but who cares?
            # It's better to reduce noise.
            # But let's be careful. If usage is present, MUST keep.
            pass
            
        if data.get("usage"):
            return False

        choices = data.get("choices", [])
        if not choices:
            return False # Keep purely structural/empty chunks if not standard choice format?
            
        choice = choices[0]
        delta = choice.get("delta", {})
        finish_reason = choice.get("finish_reason")
        
        # Keep if has meaningful content
        if delta.get("content") or delta.get("tool_calls") or finish_reason:
            return False
            
        return True
    except:
        return False

@router.post("/chat/completions")
async def chat_completions(
    req: ChatRequest, 
    background_tasks: BackgroundTasks,
    authorization: str = Header(None),
    x_fallback_model: str = Header(None, alias="X-Fallback-Model")
):
    """
    Chat completions endpoint - proxies requests to upstream LLM providers.
    """
    # Validate authorization
    if not authorization or not authorization.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"error": {"message": "Invalid API Key", "type": "invalid_request_error", "code": "invalid_api_key"}}
        )
    
    api_key = authorization.split(" ")[1]
    
    # Fetch user ID
    try:
        user_id = fetch_userid(api_key)
    except InvalidAPIKeyError as e:
        return create_error_response(e)
    
    # Add fallback model if provided
    if x_fallback_model:
        req.fallback_model = x_fallback_model
    
    # Get provider client
    try:
        client = get_provider(model=req.model, user_id=user_id)
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"error": {"message": str(e), "type": "invalid_request_error", "code": "model_not_found"}}
        )

    start_time = time.time()
    request_payload = req.model_dump(exclude_unset=True)

    try:
        if req.stream:
            # Streaming response
            prompt_tokens = count_tokens_in_messages(req.messages, req.model)
            
            async def stream_with_logging():
                completion_content = ""
                extracted_key = None
                metadata = {}
                
                try:
                    async for chunk in client.stream_chat_completions(req=req):
                        # Capture internal metadata
                        if isinstance(chunk, dict) and chunk.get("type") == "internal_metadata":
                            metadata = chunk
                            continue

                        # Pass through original chunks, filtering empty keep-alives
                        if not is_empty_chunk(chunk):
                            yield chunk
                    
                    # Log successful request using metadata from provider
                    p_tokens = metadata.get("prompt_tokens", prompt_tokens)
                    c_tokens = metadata.get("completion_tokens", 0) 
                    t_tokens = metadata.get("total_tokens", p_tokens + c_tokens)
                    key_name = metadata.get("key_name", "")

                    # Await log_request_async directly to ensure it completes before stream closes
                    await log_request_async(
                        user_id=user_id,
                        api_key=api_key,
                        provider=req.model,
                        model=req.model,
                        status=200,
                        request_payload=request_payload,
                        response_payload={},
                        start_time=start_time,
                        prompt_tokens=p_tokens,
                        completion_tokens=c_tokens,
                        total_tokens=t_tokens,
                        key_name=key_name,
                        latency_ms=metadata.get("latency_ms", 0),
                        tokens_per_second=metadata.get("tokens_per_second", 0),
                        key_rotation_log=metadata.get("key_rotation_log", []),
                        is_fallback=False
                    )
                    
                except (RateLimitExceededError, ProviderAPIError) as e:
                    # Try fallback if available
                    fallback_result = await _try_fallback(req, user_id, api_key, request_payload, start_time, background_tasks)
                    if fallback_result:
                        async for chunk in fallback_result:
                            yield chunk
                        return
                    
                    # Return error in SSE format
                    error_content, _ = get_error_response(e)
                    yield f"data: {json.dumps(error_content)}\n\n"
                    
                    await log_request_async(
                        user_id=user_id, api_key=api_key, provider=req.model, model=req.model,
                        status=e.status_code, request_payload=request_payload, response_payload=error_content,
                        start_time=start_time, prompt_tokens=prompt_tokens, completion_tokens=0,
                        total_tokens=prompt_tokens, key_name=extracted_key or "",
                        key_rotation_log=getattr(e, "rotation_log", [])
                    )
                    
                except Exception as e:
                    logger.error(f"Streaming error: {e}", exc_info=True)
                    error_content = {"error": {"message": "An internal error occurred", "type": "internal_error", "code": "server_error"}}
                    yield f"data: {json.dumps(error_content)}\n\n"
            
            return StreamingResponse(stream_with_logging(), media_type="text/event-stream")
        
        else:
            # Non-streaming response
            response_data = await client.chat_completions(req=req)
            
            # Log request
            usage = response_data.usage
            background_tasks.add_task(
                log_request_async,
                user_id=user_id,
                api_key=api_key,
                provider=req.model,
                model=req.model,
                status=200,
                request_payload=request_payload,
                response_payload={},
                start_time=start_time,
                prompt_tokens=usage.prompt_tokens if usage else 0,
                completion_tokens=usage.completion_tokens if usage else 0,
                total_tokens=usage.total_tokens if usage else 0,
                key_name=response_data.key_name,
                latency_ms=getattr(response_data, "latency_ms", 0),
                tokens_per_second=getattr(response_data, "tokens_per_second", 0),
                key_rotation_log=getattr(response_data, "key_rotation_log", []),
                is_fallback=False
            )
            
            return JSONResponse(content=response_data.model_dump(exclude={"key_name"}, exclude_none=True))

    except (RateLimitExceededError, ProviderAPIError) as e:
        # Try fallback
        fallback_result = await _try_fallback(req, user_id, api_key, request_payload, start_time, background_tasks)
        if fallback_result:
            return fallback_result
        return create_error_response(e)
    
    except Exception as e:
        logger.error(f"Chat completion error: {e}", exc_info=True)
        return create_error_response(e)


async def _try_fallback(req: ChatRequest, user_id: str, api_key: str, request_payload: dict, start_time: float, background_tasks: BackgroundTasks):
    """Try fallback model if available."""
    if not req.fallback_model:
        return None
    
    logger.info(f"Attempting fallback from {req.model} to {req.fallback_model}")
    
    try:
        fallback_client = get_provider(model=req.fallback_model, user_id=user_id)
        fallback_req = ChatRequest(
            model=req.fallback_model,
            messages=req.messages,
            temperature=req.temperature,
            stream=req.stream,
            reasoning_effort=req.reasoning_effort,
            tools=req.tools,
            tool_choice=req.tool_choice
        )
        
        if req.stream:
            async def fallback_stream():
                metadata = {}
                prompt_tokens = count_tokens_in_messages(fallback_req.messages, fallback_req.model)
                
                try:
                    async for chunk in fallback_client.stream_chat_completions(req=fallback_req):
                         # Capture internal metadata
                        if isinstance(chunk, dict) and chunk.get("type") == "internal_metadata":
                            metadata = chunk
                            continue
                        
                        # No need to extract key_name from chunks anymore
                        if not is_empty_chunk(chunk):
                            yield chunk
                    
                    # Log successful fallback
                    p_tokens = metadata.get("prompt_tokens", prompt_tokens)
                    c_tokens = metadata.get("completion_tokens", 0)
                    t_tokens = metadata.get("total_tokens", p_tokens + c_tokens)
                    key_name = metadata.get("key_name", "")

                    await log_request_async(
                        user_id=user_id, api_key=api_key, provider=fallback_req.model, model=fallback_req.model,
                        status=200, request_payload=request_payload, response_payload={},
                        start_time=start_time, prompt_tokens=p_tokens, completion_tokens=c_tokens,
                        total_tokens=t_tokens, key_name=key_name,
                        latency_ms=metadata.get("latency_ms", 0),
                        tokens_per_second=metadata.get("tokens_per_second", 0),
                        key_rotation_log=metadata.get("key_rotation_log", []),
                        is_fallback=True
                    )
                except Exception as e:
                    logger.error(f"Fallback stream error: {e}")
                    # Log failure?
                    
            return fallback_stream()
        else:
            response = await fallback_client.chat_completions(req=fallback_req)
            usage = response.usage
            background_tasks.add_task(
                log_request_async,
                user_id=user_id, api_key=api_key, provider=fallback_req.model, model=fallback_req.model,
                status=200, request_payload=request_payload, response_payload={},
                start_time=start_time, 
                prompt_tokens=usage.prompt_tokens if usage else 0,
                completion_tokens=usage.completion_tokens if usage else 0,
                total_tokens=usage.total_tokens if usage else 0,
                key_name=response.key_name,
                latency_ms=getattr(response, "latency_ms", 0),
                tokens_per_second=getattr(response, "tokens_per_second", 0),
                key_rotation_log=getattr(response, "key_rotation_log", []),
                is_fallback=True
            )
            return JSONResponse(content=response.model_dump(exclude={"key_name"}, exclude_none=True))
            
    except Exception as e:
        logger.warning(f"Fallback failed: {e}")
        return None