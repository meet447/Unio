from fastapi import Header, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.chat import ResponseRequest, ResponseOutput, Message, Usage, ToolCall, FunctionCall
from services.provider import get_provider
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError, ModelNotFoundError, InternalServerError
from auth.log import log_request
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens, count_tokens_in_tools
import time
import asyncio
import json
import uuid

router = APIRouter()

async def fire_and_forget_log_response(user_id, api_key, provider, model, status, request_payload, response_payload, start_time, prompt_tokens, completion_tokens, total_tokens, key_name):
    """Fire-and-forget logging for response generation requests"""
    end_time = time.time()
    await log_request(
        user_id=user_id,
        api_key=api_key,
        provider=provider,
        model=model,
        status=status,
        request_payload=request_payload,
        response_payload=response_payload,
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=total_tokens,
        estimated_cost=0.0,
        response_time_ms=int((end_time - start_time) * 1000),
        key_name=key_name
    )

async def attempt_response_fallback(req: ResponseRequest, user_id: str, api_key: str, request_payload: dict, start_time: float):
    """Attempt to use fallback model when primary model fails for response generation"""
    if not req.fallback_model:
        return None
        
    try:
        fallback_client = get_provider(model=req.fallback_model, user_id=user_id)
        
        # Create new request with fallback model
        fallback_req = ResponseRequest(
            model=req.fallback_model,
            input=req.input,
            temperature=req.temperature,
            reasoning_effort=req.reasoning_effort,
            tools=req.tools,
            tool_choice=req.tool_choice
        )
        
        # Generate response using the fallback provider
        fallback_response = await generate_response_with_provider(fallback_client, fallback_req)
        
        # Log fallback usage
        prompt_tokens = fallback_response.usage.prompt_tokens if fallback_response.usage else 0
        completion_tokens = fallback_response.usage.completion_tokens if fallback_response.usage else 0
        total_tokens = fallback_response.usage.total_tokens if fallback_response.usage else 0
        
        asyncio.create_task(
            fire_and_forget_log_response(
                user_id=user_id,
                api_key=api_key,
                provider=f"fallback:{req.fallback_model}",
                model=req.fallback_model or "unknown",
                status=200,
                request_payload=request_payload,
                response_payload=fallback_response.model_dump(),
                start_time=start_time,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                key_name=f"fallback:{fallback_response.key_name}"
            )
        )
        
        return fallback_response
            
    except Exception:
        # Fallback failed, return None to use original error handling
        return None

async def generate_response_with_provider(client, req: ResponseRequest) -> ResponseOutput:
    """Generate a response using the specified provider client"""
    
    # Convert input to messages format if it's a string
    if isinstance(req.input, str):
        messages = [Message(role="user", content=req.input)]
    else:
        messages = req.input
    
    # Create a chat request from the response request
    from models.chat import ChatRequest
    chat_req = ChatRequest(
        model=req.model,
        messages=messages,
        temperature=req.temperature,
        stream=False,  # Response generation is always non-streaming
        reasoning_effort=req.reasoning_effort,
        tools=req.tools,
        tool_choice=req.tool_choice
    )
    
    # Get the chat completion response
    chat_response = await client.chat_completions(req=chat_req)
    
    # Extract the response text and tool calls
    output_text = ""
    tool_calls = None
    
    if chat_response.choices and len(chat_response.choices) > 0:
        choice = chat_response.choices[0]
        if choice.message.content:
            output_text = choice.message.content
        if choice.message.tool_calls:
            tool_calls = choice.message.tool_calls
    
    # Create the response output
    response_output = ResponseOutput(
        id=str(uuid.uuid4()),
        object="response",
        created=int(time.time()),
        model=req.model,
        output_text=output_text,
        key_name=chat_response.key_name,
        usage=chat_response.usage,
        system_fingerprint=chat_response.system_fingerprint,
        tool_calls=tool_calls
    )
    
    return response_output

@router.post("/responses")
async def create_response(
    req: ResponseRequest, 
    authorization: str = Header(None),
    x_fallback_model: str = Header(None, alias="X-Fallback-Model")
):
    """Create a response using OpenAI responses API format"""
    if not authorization or not authorization.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"error": {"message": "Invalid API Key", "type": "invalid_request_error", "code": "invalid_api_key"}}
        )
        
    api_key = authorization.split(" ")[1]
    
    try:
        user_id = fetch_userid(api_key)
    except InvalidAPIKeyError as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"error": {"message": str(e), "type": e.error_type, "code": e.error_code}}
        )
    
    # Add fallback model to request if provided in headers
    if x_fallback_model:
        req.fallback_model = x_fallback_model
    
    try:
        client = get_provider(model=req.model, user_id=user_id)
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"error": {"message": str(e), "type": "invalid_request_error", "param": "model", "code": "model_not_found"}}
        )

    start_time = time.time()
    request_payload = req.model_dump()
    status_code = 200
    response_data = None
    error_content = None

    try:
        # Generate response using the primary provider
        response_data = await generate_response_with_provider(client, req)
        status_code = 200
        
        # Fire-and-forget logging for successful response
        prompt_tokens = response_data.usage.prompt_tokens if response_data.usage else 0
        completion_tokens = response_data.usage.completion_tokens if response_data.usage else 0
        total_tokens = response_data.usage.total_tokens if response_data.usage else 0
        
        asyncio.create_task(
            fire_and_forget_log_response(
                user_id=user_id,
                api_key=api_key,
                provider=req.model,
                model=req.model,
                status=status_code,
                request_payload=request_payload,
                response_payload=response_data.model_dump(),
                start_time=start_time,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                key_name=response_data.key_name
            )
        )
        return response_data

    except RateLimitExceededError as e:
        # Try fallback model if available
        fallback_response = await attempt_response_fallback(req, user_id, api_key, request_payload, start_time)
        if fallback_response:
            return fallback_response
        
        error_content = {"error": {"message": str(e), "type": e.error_type, "code": e.error_code}}
        
        # Log error
        asyncio.create_task(
            fire_and_forget_log_response(
                user_id=user_id,
                api_key=api_key,
                provider=req.model,
                model=req.model,
                status=e.status_code,
                request_payload=request_payload,
                response_payload=error_content,
                start_time=start_time,
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                key_name=''
            )
        )
        
        return JSONResponse(
            status_code=e.status_code,
            content=error_content
        )
    except ProviderAPIError as e:
        # Try fallback model if available
        fallback_response = await attempt_response_fallback(req, user_id, api_key, request_payload, start_time)
        if fallback_response:
            return fallback_response
        
        error_content = {"error": {"message": str(e), "type": e.error_type, "code": e.error_code}}
        
        # Log error
        asyncio.create_task(
            fire_and_forget_log_response(
                user_id=user_id,
                api_key=api_key,
                provider=req.model,
                model=req.model,
                status=e.status_code,
                request_payload=request_payload,
                response_payload=error_content,
                start_time=start_time,
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                key_name=''
            )
        )
        
        return JSONResponse(
            status_code=e.status_code,
            content=error_content
        )
    except Exception as e:
        status_code = 500
        error_content = {"error": {"message": f"An unexpected error occurred: {e}", "type": "internal_error", "code": "server_error"}}
        
        # Log error
        asyncio.create_task(
            fire_and_forget_log_response(
                user_id=user_id,
                api_key=api_key,
                provider=req.model,
                model=req.model,
                status=status_code,
                request_payload=request_payload,
                response_payload=error_content,
                start_time=start_time,
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                key_name=''
            )
        )
        
        return JSONResponse(
            status_code=status_code,
            content=error_content
        )