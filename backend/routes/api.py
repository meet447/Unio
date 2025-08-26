from fastapi import Header, APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from models.chat import ChatRequest
from services.provider import get_provider
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError
from auth.log import log_request
import time
import asyncio
import json

router = APIRouter()

async def fire_and_forget_log(user_id, api_key, provider, model, status, request_payload, response_payload, start_time, tokens, key_name):
    """Fire-and-forget logging for both streaming and non-streaming requests"""
    end_time = time.time()
    await log_request(
        user_id=user_id,
        api_key=api_key,
        provider=provider,
        model=model,
        status=status,
        request_payload=request_payload,
        response_payload=response_payload,
        prompt_tokens=0,
        completion_tokens=0,
        total_tokens=tokens,
        estimated_cost=0.0,
        response_time_ms=int((end_time - start_time) * 1000),
        key_name=key_name
    )

@router.post("/chat/completions")
async def chat_completions(req: ChatRequest, authorization: str = Header(None)):
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
            status_code=401,
            content={"error": {"message": str(e), "type": "invalid_request_error", "code": "invalid_api_key"}}
        )
    
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
        if req.stream:
            async def generator_wrapper():
                try:
                    total_tokens = 0
                    extracted_key = None  # store key_name
                    async for chunk in client.stream_chat_completions(req=req):
                        total_tokens += 1
                        if chunk.startswith('data: ') and extracted_key == None:
                            key_chunk = chunk[len("data: "):].strip()
                            data = json.loads(key_chunk)
                            extracted_key = data['key_name']
                        
                        yield chunk
                    # Log successful streaming
                    asyncio.create_task(
                        fire_and_forget_log(
                            user_id=user_id,
                            api_key=api_key,
                            provider=req.model,
                            model=req.model,
                            status=200,
                            request_payload=request_payload,
                            response_payload={},  # streaming, no full payload
                            start_time=start_time,
                            tokens=total_tokens,
                            key_name=extracted_key
                        )
                    )
                except Exception as e:
                    # For streaming errors, we yield the error in SSE format
                    if isinstance(e, RateLimitExceededError):
                        error_status = 429
                        error_content = {"error": {"message": str(e), "type": "rate_limit_exceeded", "code": "rate_limit_exceeded"}}
                    elif isinstance(e, ProviderAPIError):
                        error_status = e.status_code
                        error_content = {"error": {"message": str(e), "type": "api_error", "code": "provider_error"}}
                    else:
                        error_status = 500
                        error_content = {"error": {"message": f"An unexpected error occurred: {e}", "type": "internal_error", "code": "server_error"}}
                    
                    # Log error for streaming
                    asyncio.create_task(
                        fire_and_forget_log(
                            user_id=user_id,
                            api_key=api_key,
                            provider=req.model,
                            model=req.model,
                            status=error_status,
                            request_payload=request_payload,
                            response_payload=error_content,
                            start_time=start_time,
                            tokens=0,
                            key_name=''
                        )
                    )
                    
                    # Yield error in SSE format
                    yield f"data: {json.dumps(error_content)}\n\n"

            return StreamingResponse(generator_wrapper(), media_type="text/event-stream")
        else:
            response_data = await client.chat_completions(req=req)
            status_code = 200
            tokens = response_data.usage
            
            # Fire-and-forget logging for successful non-streaming
            asyncio.create_task(
                fire_and_forget_log(
                    user_id=user_id,
                    api_key=api_key,
                    provider=req.model,
                    model=req.model,
                    status=status_code,
                    request_payload=request_payload,
                    response_payload=[],
                    start_time=start_time,
                    tokens=tokens['total_tokens'],
                    key_name=response_data.key_name
                )
            )
            return response_data

    except RateLimitExceededError as e:
        status_code = 429
        error_content = {"error": {"message": str(e), "type": "rate_limit_exceeded", "code": "rate_limit_exceeded"}}
        
        # Log error
        asyncio.create_task(
            fire_and_forget_log(
                user_id=user_id,
                api_key=api_key,
                provider=req.model,
                model=req.model,
                status=status_code,
                request_payload=request_payload,
                response_payload=error_content,
                start_time=start_time,
                tokens=0,
                key_name=''
            )
        )
        
        return JSONResponse(
            status_code=status_code,
            content=error_content
        )
    except ProviderAPIError as e:
        status_code = e.status_code
        error_content = {"error": {"message": str(e), "type": "api_error", "code": "provider_error"}}
        
        # Log error
        asyncio.create_task(
            fire_and_forget_log(
                user_id=user_id,
                api_key=api_key,
                provider=req.model,
                model=req.model,
                status=status_code,
                request_payload=request_payload,
                response_payload=error_content,
                start_time=start_time,
                tokens=0,
                key_name=''
            )
        )
        
        return JSONResponse(
            status_code=status_code,
            content=error_content
        )
    except Exception as e:
        status_code = 500
        error_content = {"error": {"message": f"An unexpected error occurred: {e}", "type": "internal_error", "code": "server_error"}}
        
        # Log error
        asyncio.create_task(
            fire_and_forget_log(
                user_id=user_id,
                api_key=api_key,
                provider=req.model,
                model=req.model,
                status=status_code,
                request_payload=request_payload,
                response_payload=error_content,
                start_time=start_time,
                tokens=0,
                key_name=''
            )
        )
        
        return JSONResponse(
            status_code=status_code,
            content=error_content
        )