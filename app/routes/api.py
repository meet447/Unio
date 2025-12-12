from fastapi import Header, APIRouter, Request, BackgroundTasks
from fastapi.responses import StreamingResponse, JSONResponse
from models.chat import ChatRequest
from services.provider import get_provider, get_all_providers
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError, ModelNotFoundError
from utils.error_handler import create_error_response, get_error_response, log_request_async
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens
import time
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


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

                        # Pass through original chunks
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
                    fallback_result = await _try_fallback(req, user_id, api_key, request_payload, start_time)
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
                        key_rotation_log=metadata.get("key_rotation_log", [])
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