from fastapi import Header, APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
from models.chat import (
    ResponseRequest, OutputTextContentPart, ToolCallsContentPart, ResponseMessage, ResponseData, 
    Message, Usage, ChatRequest
)
from services.provider import get_provider
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError
from utils.error_handler import create_error_response, log_request_async
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens, count_tokens_in_tools
import time
import json
import uuid
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/responses")
async def create_response(
    req: ResponseRequest, 
    background_tasks: BackgroundTasks,
    authorization: str = Header(None),
    x_fallback_model: str = Header(None, alias="X-Fallback-Model")
):
    """
    Create a response using OpenAI responses API format.
    Converts to chat completions format internally.
    """
    # Validate authorization
    if not authorization or not authorization.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"error": {"message": "Invalid API Key", "type": "invalid_request_error", "code": "invalid_api_key"}}
        )
    
    api_key = authorization.split(" ")[1]
    
    try:
        user_id = fetch_userid(api_key)
    except InvalidAPIKeyError as e:
        return create_error_response(e)
    
    if x_fallback_model:
        req.fallback_model = x_fallback_model
    
    try:
        client = get_provider(model=req.model, user_id=user_id)
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"error": {"message": str(e), "type": "invalid_request_error", "code": "model_not_found"}}
        )

    start_time = time.time()
    request_payload = req.model_dump()

    try:
        if req.stream:
            return await _generate_streaming_response(client, req, user_id, api_key, request_payload, start_time)
        else:
            return await _generate_response(client, req, user_id, api_key, request_payload, start_time, background_tasks)
            
    except (RateLimitExceededError, ProviderAPIError) as e:
        # Try fallback
        if req.fallback_model:
            try:
                fallback_client = get_provider(model=req.fallback_model, user_id=user_id)
                req.model = req.fallback_model
                if req.stream:
                    return await _generate_streaming_response(fallback_client, req, user_id, api_key, request_payload, start_time)
                else:
                    return await _generate_response(fallback_client, req, user_id, api_key, request_payload, start_time, background_tasks)
            except Exception:
                pass
        return create_error_response(e)
    
    except Exception as e:
        logger.error(f"Response generation error: {e}", exc_info=True)
        return create_error_response(e)


async def _generate_response(client, req: ResponseRequest, user_id: str, api_key: str, request_payload: dict, start_time: float, background_tasks: BackgroundTasks) -> JSONResponse:
    """Generate non-streaming response."""
    # Convert input to messages
    messages = [Message(role="user", content=req.input)] if isinstance(req.input, str) else req.input
    
    chat_req = ChatRequest(
        model=req.model,
        messages=messages,
        temperature=req.temperature or 0.7,
        stream=False,
        reasoning_effort=req.reasoning_effort,
        tools=req.tools,
        tool_choice=req.tool_choice
    )
    
    chat_response = await client.chat_completions(req=chat_req)
    
    # Log request
    # Log request
    usage = chat_response.usage
    background_tasks.add_task(
        log_request_async,
        user_id=user_id,
        api_key=api_key,
        provider=req.model,
        model=req.model,
        status=200,
        request_payload=request_payload,
        response_payload=chat_response.model_dump(),
        start_time=start_time,
        prompt_tokens=usage.prompt_tokens if usage else 0,
        completion_tokens=usage.completion_tokens if usage else 0,
        total_tokens=usage.total_tokens if usage else 0,
        key_name=chat_response.key_name,
        latency_ms=getattr(chat_response, "latency_ms", 0),
        tokens_per_second=getattr(chat_response, "tokens_per_second", 0),
        key_rotation_log=getattr(chat_response, "key_rotation_log", []),
    )
    
    return JSONResponse(content=chat_response.model_dump(exclude={"key_name"}, exclude_none=True))


async def _generate_streaming_response(client, req: ResponseRequest, user_id: str, api_key: str, request_payload: dict, start_time: float) -> StreamingResponse:
    """Generate streaming response in OpenAI Responses API format."""
    messages = [Message(role="user", content=req.input)] if isinstance(req.input, str) else req.input
    
    chat_req = ChatRequest(
        model=req.model,
        messages=messages,
        temperature=req.temperature or 0.7,
        stream=True,
        reasoning_effort=req.reasoning_effort,
        tools=req.tools,
        tool_choice=req.tool_choice
    )
    
    # Initial count for fallback, will be overwritten by metadata if available
    prompt_tokens = count_tokens_in_messages(messages, req.model)
    if req.tools:
        prompt_tokens += count_tokens_in_tools([tool.model_dump() for tool in req.tools], req.model)
    
    async def stream_generator():
        metadata = {}
        
        async for chunk in client.stream_chat_completions(req=chat_req):
            # Capture internal metadata
            if isinstance(chunk, dict) and chunk.get("type") == "internal_metadata":
                metadata = chunk
                continue

            # Pass through original chunks
            yield chunk
        
        # Log successful request using metadata
        p_tokens = metadata.get("prompt_tokens", prompt_tokens)
        c_tokens = metadata.get("completion_tokens", 0)
        t_tokens = metadata.get("total_tokens", p_tokens + c_tokens)
        key_name = metadata.get("key_name", "")
        
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
    
    return StreamingResponse(stream_generator(), media_type="text/event-stream")