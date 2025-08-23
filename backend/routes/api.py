from fastapi import Header, APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from models.chat import ChatRequest
from services.provider import get_provider
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError
from auth.log import log_request
import time
import asyncio

router = APIRouter()

async def fire_and_forget_log(user_id, api_key, provider, model, status, request_payload, response_payload, start_time):
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
        total_tokens=0,
        estimated_cost=0.0,
        response_time_ms=int((end_time - start_time) * 1000)
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
    status_code = 200
    request_payload = req.model_dump()

    try:
        if req.stream:
            # Wrap the generator to log after streaming finishes (fire-and-forget)
            async def generator_wrapper():
                async for chunk in client.stream_chat_completions(req=req):
                    yield chunk
                asyncio.create_task(
                    fire_and_forget_log(
                        user_id=user_id,
                        api_key=api_key,
                        provider=req.model,
                        model=req.model,
                        status=status_code,
                        request_payload=request_payload,
                        response_payload={},  # streaming, no full payload
                        start_time=start_time
                    )
                )

            return StreamingResponse(generator_wrapper(), media_type="text/event-stream")
        else:
            response_data = await client.chat_completions(req=req)
            status_code = 200
            # Fire-and-forget logging for non-streaming
            asyncio.create_task(
                fire_and_forget_log(
                    user_id=user_id,
                    api_key=api_key,
                    provider=req.model,
                    model=req.model,
                    status=status_code,
                    request_payload=request_payload,
                    response_payload=response_data,
                    start_time=start_time
                )
            )
            return response_data

    except RateLimitExceededError as e:
        status_code = 429
        return JSONResponse(
            status_code=status_code,
            content={"error": {"message": str(e), "type": "rate_limit_exceeded", "code": "rate_limit_exceeded"}}
        )
    except ProviderAPIError as e:
        status_code = e.status_code
        return JSONResponse(
            status_code=status_code,
            content={"error": {"message": str(e), "type": "api_error", "code": "provider_error"}}
        )
    except Exception as e:
        status_code = 500
        return JSONResponse(
            status_code=status_code,
            content={"error": {"message": f"An unexpected error occurred: {e}", "type": "internal_error", "code": "server_error"}}
        )