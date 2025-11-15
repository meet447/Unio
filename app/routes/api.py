from fastapi import Header, APIRouter, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from models.chat import ChatRequest
from services.provider import get_provider, get_all_providers, models, provider_id_to_name
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError, ModelNotFoundError, InternalServerError
from auth.log import log_request
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens
import time
import asyncio
import json
import logging
import traceback

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def log_and_return_error(error: Exception, user_id: str, api_key: str, provider: str, model: str, 
                               request_payload: dict, start_time: float, key_name: str = ""):
    """Log error details and return standardized error response"""
    
    # Log the error details for debugging
    logger.error(f"Error in chat completion - Provider: {provider}, Model: {model}, Error: {str(error)}, Type: {type(error).__name__}")
    logger.error(f"Error traceback: {traceback.format_exc()}")
    
    # Determine error details based on exception type
    if isinstance(error, (RateLimitExceededError, ProviderAPIError, InvalidAPIKeyError, ModelNotFoundError)):
        status_code = error.status_code
        error_content = {
            "error": {
                "message": str(error),
                "type": error.error_type,
                "code": error.error_code
            }
        }
    else:
        # For unexpected errors, log the full details but return a safe message
        logger.error(f"Unexpected error details: {repr(error)}")
        status_code = 500
        error_content = {
            "error": {
                "message": f"An unexpected error occurred: {str(error)}",
                "type": "internal_error",
                "code": "server_error"
            }
        }
    
    # Log the error to database
    asyncio.create_task(
        fire_and_forget_log(
            user_id=user_id,
            api_key=api_key,
            provider=provider,
            model=model,
            status=status_code,
            request_payload=request_payload,
            response_payload=error_content,
            start_time=start_time,
            prompt_tokens=0,
            completion_tokens=0,
            total_tokens=0,
            key_name=key_name
        )
    )
    
    return JSONResponse(
        status_code=status_code,
        content=error_content
    )

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

async def attempt_provider_fallback(req: ChatRequest, user_id: str, api_key: str, request_payload: dict, start_time: float, original_provider_id: str):
    """
    Attempt to use other providers when all keys of the selected provider are rate limited.
    Returns a generator for streaming requests, or ChatResponse for non-streaming requests.
    """
    logger.info(f"All keys of provider {original_provider_id} are rate limited, attempting fallback to other providers")
    
    # Get all available providers
    all_providers = get_all_providers(user_id)
    
    # Extract the model name (without provider prefix)
    # If model has provider prefix, extract just the model name; otherwise use the full model name
    model_name = req.model
    if ":" in model_name:
        model_name = model_name.split(":", 1)[1]
    elif "/" in model_name:
        model_name = model_name.split("/", 1)[1]
    # If no separator, model_name is already just the model name
    
    # Try each available provider (excluding the original one)
    for provider_id, fallback_client in all_providers.items():
        if provider_id == original_provider_id:
            continue  # Skip the original provider
        
        provider_name = provider_id_to_name.get(provider_id)
        if not provider_name:
            continue
        
        # Construct fallback model name
        fallback_model = f"{provider_name}:{model_name}"
        
        logger.info(f"Attempting fallback to provider {provider_name} with model {fallback_model}")
        
        try:
            # Create new request with fallback model
            fallback_req = ChatRequest(
                model=fallback_model,
                messages=req.messages,
                temperature=req.temperature,
                stream=req.stream,
                reasoning_effort=req.reasoning_effort,
                tools=req.tools,
                tool_choice=req.tool_choice
            )
            
            if req.stream:
                # Return a generator for streaming
                async def fallback_generator():
                    completion_content = ""
                    extracted_key = None
                    completion_tokens = 0
                    
                    try:
                        async for chunk in fallback_client.stream_chat_completions(req=fallback_req):
                            if chunk.startswith('data: ') and not chunk.strip().endswith('[DONE]'):
                                try:
                                    key_chunk = chunk[len("data: "):].strip()
                                    if key_chunk and key_chunk != '[DONE]':
                                        data = json.loads(key_chunk)
                                        if extracted_key is None and 'key_name' in data:
                                            extracted_key = data['key_name']
                                        
                                        if 'choices' in data and data['choices']:
                                            choice = data['choices'][0]
                                            if 'delta' in choice and 'content' in choice['delta'] and choice['delta']['content']:
                                                completion_content += choice['delta']['content']
                                except (json.JSONDecodeError, KeyError, IndexError):
                                    pass
                            yield chunk
                        
                        # Log fallback usage
                        completion_tokens = estimate_completion_tokens(completion_content, fallback_model)
                        total_tokens = count_tokens_in_messages(req.messages, fallback_model) + completion_tokens
                        
                        asyncio.create_task(
                            fire_and_forget_log(
                                user_id=user_id,
                                api_key=api_key,
                                provider=f"fallback:{provider_name}",
                                model=fallback_model,
                                status=200,
                                request_payload=request_payload,
                                response_payload={},
                                start_time=start_time,
                                prompt_tokens=count_tokens_in_messages(req.messages, fallback_model),
                                completion_tokens=completion_tokens,
                                total_tokens=total_tokens,
                                key_name=f"fallback:{extracted_key}"
                            )
                        )
                    except (RateLimitExceededError, ProviderAPIError) as e:
                        logger.warning(f"Fallback provider {provider_name} also rate limited or failed: {str(e)}")
                        # Continue to next provider
                        raise
                
                return fallback_generator()
            else:
                fallback_response = await fallback_client.chat_completions(req=fallback_req)
                
                # Log fallback usage
                prompt_tokens = fallback_response.usage.prompt_tokens if fallback_response.usage else 0
                completion_tokens = fallback_response.usage.completion_tokens if fallback_response.usage else 0
                total_tokens = fallback_response.usage.total_tokens if fallback_response.usage else 0
                
                asyncio.create_task(
                    fire_and_forget_log(
                        user_id=user_id,
                        api_key=api_key,
                        provider=f"fallback:{provider_name}",
                        model=fallback_model,
                        status=200,
                        request_payload=request_payload,
                        response_payload=[],
                        start_time=start_time,
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens,
                        total_tokens=total_tokens,
                        key_name=f"fallback:{fallback_response.key_name}"
                    )
                )
                
                return fallback_response
                
        except (RateLimitExceededError, ProviderAPIError) as e:
            # This provider also failed, try the next one
            logger.warning(f"Fallback provider {provider_name} failed: {str(e)}, trying next provider")
            continue
        except Exception as e:
            # Other errors (like model not found), try next provider
            logger.warning(f"Fallback provider {provider_name} error: {str(e)}, trying next provider")
            continue
    
    # All fallback providers failed
    logger.error("All fallback providers exhausted")
    return None

async def attempt_fallback(req: ChatRequest, user_id: str, api_key: str, request_payload: dict, start_time: float):
    """Attempt to use fallback model when primary model fails"""
    if not req.fallback_model:
        logger.debug("No fallback model specified")
        return None
        
    logger.info(f"Attempting fallback from {req.model} to {req.fallback_model}")
    
    try:
        fallback_client = get_provider(model=req.fallback_model, user_id=user_id)
        
        # Create new request with fallback model
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
            async def fallback_generator_wrapper():
                completion_content = ""
                extracted_key = None
                completion_tokens = 0
                
                async for chunk in fallback_client.stream_chat_completions(req=fallback_req):
                    if chunk.startswith('data: ') and not chunk.strip().endswith('[DONE]'):
                        try:
                            key_chunk = chunk[len("data: "):].strip()
                            if key_chunk and key_chunk != '[DONE]':
                                data = json.loads(key_chunk)
                                if extracted_key is None and 'key_name' in data:
                                    extracted_key = data['key_name']
                                
                                if 'choices' in data and data['choices']:
                                    choice = data['choices'][0]
                                    if 'delta' in choice and 'content' in choice['delta'] and choice['delta']['content']:
                                        completion_content += choice['delta']['content']
                        except (json.JSONDecodeError, KeyError, IndexError):
                            pass
                    yield chunk
                
                # Log fallback usage
                fallback_model_safe = req.fallback_model or "unknown"
                completion_tokens = estimate_completion_tokens(completion_content, fallback_model_safe)
                total_tokens = count_tokens_in_messages(req.messages, fallback_model_safe) + completion_tokens
                
                asyncio.create_task(
                    fire_and_forget_log(
                        user_id=user_id,
                        api_key=api_key,
                        provider=f"fallback:{req.fallback_model}",
                        model=fallback_model_safe,
                        status=200,
                        request_payload=request_payload,
                        response_payload={},
                        start_time=start_time,
                        prompt_tokens=count_tokens_in_messages(req.messages, fallback_model_safe),
                        completion_tokens=completion_tokens,
                        total_tokens=total_tokens,
                        key_name=f"fallback:{extracted_key}"
                    )
                )
            
            return StreamingResponse(fallback_generator_wrapper(), media_type="text/event-stream")
        else:
            fallback_response = await fallback_client.chat_completions(req=fallback_req)
            
            # Log fallback usage
            prompt_tokens = fallback_response.usage.prompt_tokens if fallback_response.usage else 0
            completion_tokens = fallback_response.usage.completion_tokens if fallback_response.usage else 0
            total_tokens = fallback_response.usage.total_tokens if fallback_response.usage else 0
            
            asyncio.create_task(
                fire_and_forget_log(
                    user_id=user_id,
                    api_key=api_key,
                    provider=f"fallback:{req.fallback_model}",
                    model=req.fallback_model or "unknown",
                    status=200,
                    request_payload=request_payload,
                    response_payload=[],
                    start_time=start_time,
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                    total_tokens=total_tokens,
                    key_name=f"fallback:{fallback_response.key_name}"
                )
            )
            
            return fallback_response
            
    except Exception as e:
        # Fallback failed, log the error and return None to use original error handling
        logger.error(f"Fallback model {req.fallback_model} also failed: {str(e)}")
        return None

@router.post("/chat/completions")
async def chat_completions(
    req: ChatRequest, 
    authorization: str = Header(None),
    x_fallback_model: str = Header(None, alias="X-Fallback-Model")
):
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
    
    # Extract provider information for fallback
    original_provider = None
    original_provider_id = None
    if ":" in req.model:
        original_provider = req.model.split(":")[0]
    elif "/" in req.model:
        original_provider = req.model.split("/")[0]
    else:
        original_provider = req.model
    
    if original_provider in models:
        original_provider_id = models[original_provider]
    
    try:
        client = get_provider(model=req.model, user_id=user_id)
    except (ValueError, KeyError) as e:
        logger.error(f"Invalid model or provider for {req.model}: {str(e)}")
        return JSONResponse(
            status_code=400,
            content={"error": {"message": str(e), "type": "invalid_request_error", "param": "model", "code": "model_not_found"}}
        )
    except Exception as e:
        logger.error(f"Unexpected error getting provider for {req.model}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": {"message": f"Failed to initialize provider: {str(e)}", "type": "internal_error", "code": "provider_initialization_error"}}
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
                
                try:
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
                    
                except RateLimitExceededError as e:
                    logger.warning(f"Rate limit exceeded for model {req.model} during streaming - trying provider fallback")
                    # Try provider fallback first (automatic fallback to other providers)
                    if original_provider_id:
                        provider_fallback_generator = await attempt_provider_fallback(req, user_id, api_key, request_payload, start_time, original_provider_id)
                        if provider_fallback_generator:
                            logger.info(f"Provider fallback successful for streaming model {req.model}")
                            async for chunk in provider_fallback_generator:
                                yield chunk
                            return
                    
                    # Try explicit fallback model if available
                    fallback_response = await attempt_fallback(req, user_id, api_key, request_payload, start_time)
                    if fallback_response:
                        logger.info(f"Explicit fallback successful for streaming model {req.model}")
                        async for chunk in fallback_response.body_iterator:
                            yield chunk
                        return
                    else:
                        logger.error(f"Rate limit exceeded and no fallback available for streaming model {req.model}")
                        # Yield error in SSE format
                        error_data = {
                            "error": {
                                "message": str(e),
                                "type": e.error_type,
                                "code": e.error_code
                            }
                        }
                        yield f"data: {json.dumps(error_data)}\n\n"
                        # Log error
                        asyncio.create_task(
                            fire_and_forget_log(
                                user_id=user_id,
                                api_key=api_key,
                                provider=req.model,
                                model=req.model,
                                status=e.status_code,
                                request_payload=request_payload,
                                response_payload=error_data,
                                start_time=start_time,
                                prompt_tokens=prompt_tokens,
                                completion_tokens=0,
                                total_tokens=prompt_tokens,
                                key_name=extracted_key
                            )
                        )
                        
                except ProviderAPIError as e:
                    logger.warning(f"Provider API error for streaming model {req.model}: {str(e)} - trying provider fallback")
                    # Try provider fallback first (automatic fallback to other providers)
                    if original_provider_id:
                        provider_fallback_generator = await attempt_provider_fallback(req, user_id, api_key, request_payload, start_time, original_provider_id)
                        if provider_fallback_generator:
                            logger.info(f"Provider fallback successful after provider error for streaming model {req.model}")
                            async for chunk in provider_fallback_generator:
                                yield chunk
                            return
                    
                    # Try explicit fallback model if available
                    fallback_response = await attempt_fallback(req, user_id, api_key, request_payload, start_time)
                    if fallback_response:
                        logger.info(f"Explicit fallback successful after provider error for streaming model {req.model}")
                        async for chunk in fallback_response.body_iterator:
                            yield chunk
                        return
                    else:
                        logger.error(f"Provider API error and no fallback available for streaming model {req.model}: {str(e)}")
                        # Yield error in SSE format
                        error_data = {
                            "error": {
                                "message": str(e),
                                "type": e.error_type,
                                "code": e.error_code
                            }
                        }
                        yield f"data: {json.dumps(error_data)}\n\n"
                        # Log error
                        asyncio.create_task(
                            fire_and_forget_log(
                                user_id=user_id,
                                api_key=api_key,
                                provider=req.model,
                                model=req.model,
                                status=e.status_code,
                                request_payload=request_payload,
                                response_payload=error_data,
                                start_time=start_time,
                                prompt_tokens=prompt_tokens,
                                completion_tokens=0,
                                total_tokens=prompt_tokens,
                                key_name=extracted_key
                            )
                        )
                        
                except (InvalidAPIKeyError, ModelNotFoundError) as e:
                    logger.error(f"Client error for streaming model {req.model}: {str(e)}")
                    # Yield error in SSE format
                    error_data = {
                        "error": {
                            "message": str(e),
                            "type": e.error_type,
                            "code": e.error_code
                        }
                    }
                    yield f"data: {json.dumps(error_data)}\n\n"
                    # Log error
                    asyncio.create_task(
                        fire_and_forget_log(
                            user_id=user_id,
                            api_key=api_key,
                            provider=req.model,
                            model=req.model,
                            status=e.status_code,
                            request_payload=request_payload,
                            response_payload=error_data,
                            start_time=start_time,
                            prompt_tokens=prompt_tokens,
                            completion_tokens=0,
                            total_tokens=prompt_tokens,
                            key_name=extracted_key
                        )
                    )
                    
                except Exception as e:
                    logger.error(f"Unexpected error in streaming chat completion for model {req.model}: {str(e)}")
                    logger.error(f"Unexpected streaming error traceback: {traceback.format_exc()}")
                    # Yield error in SSE format
                    error_data = {
                        "error": {
                            "message": f"An unexpected error occurred: {str(e)}",
                            "type": "internal_error",
                            "code": "server_error"
                        }
                    }
                    yield f"data: {json.dumps(error_data)}\n\n"
                    # Log error
                    asyncio.create_task(
                        fire_and_forget_log(
                            user_id=user_id,
                            api_key=api_key,
                            provider=req.model,
                            model=req.model,
                            status=500,
                            request_payload=request_payload,
                            response_payload=error_data,
                            start_time=start_time,
                            prompt_tokens=prompt_tokens,
                            completion_tokens=0,
                            total_tokens=prompt_tokens,
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
        logger.warning(f"Rate limit exceeded for model {req.model} - trying provider fallback")
        # Try provider fallback first (automatic fallback to other providers)
        if original_provider_id:
            provider_fallback_response = await attempt_provider_fallback(req, user_id, api_key, request_payload, start_time, original_provider_id)
            if provider_fallback_response:
                logger.info(f"Provider fallback successful for model {req.model}")
                return provider_fallback_response
        
        # Try explicit fallback model if available
        fallback_response = await attempt_fallback(req, user_id, api_key, request_payload, start_time)
        if fallback_response:
            logger.info(f"Explicit fallback successful for model {req.model}")
            return fallback_response
        
        logger.error(f"Rate limit exceeded and no fallback available for model {req.model}")
        return await log_and_return_error(e, user_id, api_key, req.model, req.model, request_payload, start_time)
        
    except ProviderAPIError as e:
        logger.warning(f"Provider API error for model {req.model}: {str(e)} - trying provider fallback")
        # Try provider fallback first (automatic fallback to other providers)
        if original_provider_id:
            provider_fallback_response = await attempt_provider_fallback(req, user_id, api_key, request_payload, start_time, original_provider_id)
            if provider_fallback_response:
                logger.info(f"Provider fallback successful after provider error for model {req.model}")
                return provider_fallback_response
        
        # Try explicit fallback model if available
        fallback_response = await attempt_fallback(req, user_id, api_key, request_payload, start_time)
        if fallback_response:
            logger.info(f"Explicit fallback successful after provider error for model {req.model}")
            return fallback_response
        
        logger.error(f"Provider API error and no fallback available for model {req.model}: {str(e)}")
        return await log_and_return_error(e, user_id, api_key, req.model, req.model, request_payload, start_time)
        
    except (InvalidAPIKeyError, ModelNotFoundError) as e:
        logger.error(f"Client error for model {req.model}: {str(e)}")
        return await log_and_return_error(e, user_id, api_key, req.model, req.model, request_payload, start_time)
        
    except Exception as e:
        logger.error(f"Unexpected error in chat completion for model {req.model}: {str(e)}")
        logger.error(f"Unexpected error traceback: {traceback.format_exc()}")
        return await log_and_return_error(e, user_id, api_key, req.model, req.model, request_payload, start_time)