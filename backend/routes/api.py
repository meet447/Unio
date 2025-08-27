from fastapi import Header, APIRouter, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from models.chat import ChatRequest
from services.provider import get_provider
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError, ModelNotFoundError, InternalServerError
from auth.log import log_request
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens
import time
import asyncio
import json

router = APIRouter()

async def fire_and_forget_log(user_id, api_key, provider, model, status, request_payload, response_payload, start_time, prompt_tokens, completion_tokens, total_tokens, key_name):
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
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=total_tokens,
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
            status_code=e.status_code,
            content={"error": {"message": str(e), "type": e.error_type, "code": e.error_code}}
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
            # Calculate prompt tokens using tiktoken
            prompt_tokens = count_tokens_in_messages(req.messages, req.model)
            
            async def generator_wrapper():
                completion_content = ""
                extracted_key = None  # store key_name
                completion_tokens = 0
                
                async for chunk in client.stream_chat_completions(req=req):
                    # Extract completion content for token counting
                    if chunk.startswith('data: ') and not chunk.strip().endswith('[DONE]'):
                        try:
                            key_chunk = chunk[len("data: "):].strip()
                            if key_chunk and key_chunk != '[DONE]':
                                data = json.loads(key_chunk)
                                if extracted_key is None and 'key_name' in data:
                                    extracted_key = data['key_name']
                                
                                # Extract content from delta for token counting
                                if 'choices' in data and data['choices']:
                                    choice = data['choices'][0]
                                    if 'delta' in choice and 'content' in choice['delta'] and choice['delta']['content']:
                                        completion_content += choice['delta']['content']
                        except (json.JSONDecodeError, KeyError, IndexError):
                            pass  # Skip malformed chunks
                    
                    yield chunk
                
                # Calculate completion tokens using tiktoken
                completion_tokens = estimate_completion_tokens(completion_content, req.model)
                total_tokens = prompt_tokens + completion_tokens
                
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
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens,
                        total_tokens=total_tokens,
                        key_name=extracted_key
                    )
                )

            return StreamingResponse(generator_wrapper(), media_type="text/event-stream")
        else:
            response_data = await client.chat_completions(req=req)
            status_code = 200
            
            # Fire-and-forget logging for successful non-streaming
            prompt_tokens = response_data.usage.prompt_tokens if response_data.usage else 0
            completion_tokens = response_data.usage.completion_tokens if response_data.usage else 0
            total_tokens = response_data.usage.total_tokens if response_data.usage else 0
            
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
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                    total_tokens=total_tokens,
                    key_name=response_data.key_name
                )
            )
            return response_data

    except RateLimitExceededError as e:
        error_content = {"error": {"message": str(e), "type": e.error_type, "code": e.error_code}}
        
        # Log error
        asyncio.create_task(
            fire_and_forget_log(
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
        error_content = {"error": {"message": str(e), "type": e.error_type, "code": e.error_code}}
        
        # Log error
        asyncio.create_task(
            fire_and_forget_log(
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
            fire_and_forget_log(
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