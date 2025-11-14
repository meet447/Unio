from fastapi import Header, APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from models.chat import (
    ResponseRequest, OutputTextContentPart, ToolCallsContentPart, ResponseMessage, ResponseData, ResponseDelta, ResponseChoiceChunk, 
    ResponseCompletionChunk, Message, Usage, ToolCall, FunctionCall
)
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
            temperature=req.temperature or 0.7,
            stream=req.stream,  # Preserve streaming preference
            reasoning_effort=req.reasoning_effort,
            tools=req.tools,
            tool_choice=req.tool_choice
        )
        
        # Generate response using the fallback provider
        if req.stream:
            # For streaming fallback, return the streaming response directly
            fallback_response = await generate_streaming_response_with_provider(fallback_client, fallback_req)
            return fallback_response
        else:
            # For non-streaming fallback
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
                    response_payload=fallback_response.dict() if hasattr(fallback_response, 'dict') else fallback_response.model_dump(),
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

async def generate_streaming_response_with_provider(client, req: ResponseRequest) -> StreamingResponse:
    """Generate a streaming response using the specified provider client with OpenAI Responses API format"""
    
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
        temperature=req.temperature or 0.7,
        stream=True,  # Force streaming for this function
        reasoning_effort=req.reasoning_effort,
        tools=req.tools,
        tool_choice=req.tool_choice
    )
    
    # Calculate prompt tokens
    prompt_tokens = count_tokens_in_messages(messages, req.model)
    if req.tools:
        prompt_tokens += count_tokens_in_tools([tool.dict() if hasattr(tool, 'dict') else tool.model_dump() for tool in req.tools], req.model)
    
    async def response_stream_generator():
        completion_content = ""
        completion_tokens = 0
        extracted_key = None
        tool_calls_streaming = []  # Track tool calls as they come in
        response_id = f"resp_{uuid.uuid4().hex}"
        message_id = f"msg_{uuid.uuid4().hex}"
        created_time = int(time.time())
        has_content = False  # Track if we have text content
        has_tool_calls = False  # Track if we have tool calls
        content_part_index = 0  # Track content parts
        
        # Create base response object
        base_response = {
            "id": response_id,
            "object": "response",
            "created_at": created_time,
            "status": "in_progress",
            "error": None,
            "incomplete_details": None,
            "instructions": "You are a helpful assistant.",
            "max_output_tokens": None,
            "model": req.model,
            "output": [],
            "parallel_tool_calls": True,
            "previous_response_id": None,
            "reasoning": {"effort": req.reasoning_effort, "summary": None},
            "response_format": None,
            "store": True,
            "temperature": req.temperature,
            "text": {"format": {"type": "text"}},
            "tool_choice": req.tool_choice or "auto",
            "tools": [tool.dict() if hasattr(tool, 'dict') else tool.model_dump() for tool in req.tools] if req.tools else [],
            "top_p": 1.0,
            "truncation": {"type": "auto", "last_messages": None},
            "usage": None,
            "user": None,
            "metadata": {}
        }
        
        try:
            # Send response.created event
            yield f"event: response.created\n"
            yield f"data: {{\"type\":\"response.created\",\"response\":{json.dumps(base_response)}}}\n\n"
            
            # Send response.in_progress event
            yield f"event: response.in_progress\n"
            yield f"data: {{\"type\":\"response.in_progress\",\"response\":{json.dumps(base_response)}}}\n\n"
            
            # Send response.output_item.added event
            output_item = {
                "id": message_id,
                "type": "message",
                "status": "in_progress",
                "role": "assistant",
                "content": []
            }
            yield f"event: response.output_item.added\n"
            yield f"data: {{\"type\":\"response.output_item.added\",\"output_index\":0,\"item\":{json.dumps(output_item)}}}\n\n"
            
            # Stream content deltas
            async for chunk in client.stream_chat_completions(req=chat_req):
                # Parse SSE chunk from chat completions
                if chunk.startswith('data: ') and not chunk.strip().endswith('[DONE]'):
                    try:
                        chunk_data = chunk[len("data: "):].strip()
                        if chunk_data and chunk_data != '[DONE]':
                            chat_chunk = json.loads(chunk_data)
                            
                            # Extract key name if available
                            if extracted_key is None and 'key_name' in chat_chunk:
                                extracted_key = chat_chunk['key_name']
                            
                            # Process content deltas
                            if 'choices' in chat_chunk and chat_chunk['choices']:
                                choice = chat_chunk['choices'][0]
                                
                                if 'delta' in choice:
                                    delta = choice['delta']
                                    
                                    # Handle text content
                                    if 'content' in delta and delta['content']:
                                        # Add text content part if this is the first content
                                        if not has_content:
                                            content_part = OutputTextContentPart(type="text", text="")
                                            yield f"event: response.content_part.added\n"
                                            part_dict = content_part.dict() if hasattr(content_part, 'dict') else content_part.model_dump()
                                            yield f"data: {{\"type\":\"response.content_part.added\",\"item_id\":\"{message_id}\",\"output_index\":0,\"content_index\":{content_part_index},\"part\":{json.dumps(part_dict)}}}\n\n"
                                            has_content = True
                                        
                                        delta_content = delta['content']
                                        completion_content += delta['content']
                                        
                                        # Send response.output_text.delta event
                                        yield f"event: response.output_text.delta\n"
                                        yield f"data: {{\"type\":\"response.output_text.delta\",\"item_id\":\"{message_id}\",\"output_index\":0,\"content_index\":{content_part_index},\"delta\":{json.dumps(delta_content)}}}\n\n"
                                    
                                    # Handle tool calls
                                    if 'tool_calls' in delta and delta['tool_calls']:
                                        for tc in delta['tool_calls']:
                                            # Handle case where index might be None (for single tool call)
                                            tc_index = tc.get('index') if tc.get('index') is not None else 0
                                            
                                            # Extend tool_calls_streaming list if needed
                                            while len(tool_calls_streaming) <= tc_index:
                                                tool_calls_streaming.append({
                                                    "id": "",
                                                    "type": "function",
                                                    "function": {"name": "", "arguments": ""}
                                                })
                                            
                                            # Update the tool call at the specified index
                                            if 'id' in tc and tc['id']:
                                                tool_calls_streaming[tc_index]['id'] = tc['id']
                                            if 'function' in tc and tc['function']:
                                                if tc['function'].get('name'):
                                                    tool_calls_streaming[tc_index]['function']['name'] = tc['function']['name']
                                                if tc['function'].get('arguments'):
                                                    tool_calls_streaming[tc_index]['function']['arguments'] += tc['function']['arguments']
                                            
                                            has_tool_calls = True
                    
                    except (json.JSONDecodeError, KeyError, IndexError) as e:
                        # Skip malformed chunks
                        continue
                
                elif chunk.strip().endswith('[DONE]'):
                    # Calculate final tokens
                    completion_tokens = estimate_completion_tokens(completion_content, req.model)
                    total_tokens = prompt_tokens + completion_tokens
                    
                    # Build final content array
                    final_content = []
                    
                    # Add text content if present
                    if has_content:
                        # Send response.output_text.done event
                        yield f"event: response.output_text.done\n"
                        yield f"data: {{\"type\":\"response.output_text.done\",\"item_id\":\"{message_id}\",\"output_index\":0,\"content_index\":{content_part_index},\"text\":{json.dumps(completion_content)}}}\n\n"
                        
                        # Send response.content_part.done event for text
                        final_part = OutputTextContentPart(type="text", text=completion_content)
                        yield f"event: response.content_part.done\n"
                        part_dict = final_part.dict() if hasattr(final_part, 'dict') else final_part.model_dump()
                        yield f"data: {{\"type\":\"response.content_part.done\",\"item_id\":\"{message_id}\",\"output_index\":0,\"content_index\":{content_part_index},\"part\":{json.dumps(part_dict)}}}\n\n"
                        
                        final_content.append(final_part)
                        content_part_index += 1
                    
                    # Add tool calls if present
                    if has_tool_calls and tool_calls_streaming:
                        # Filter out incomplete tool calls
                        complete_tool_calls = [
                            tc for tc in tool_calls_streaming 
                            if tc['id'] and tc['function']['name']
                        ]
                        
                        if complete_tool_calls:
                            # Add tool calls content part
                            tool_calls_part = ToolCallsContentPart(
                                type="tool_calls",
                                tool_calls=complete_tool_calls
                            )
                            
                            yield f"event: response.content_part.added\n"
                            part_dict_added = tool_calls_part.dict() if hasattr(tool_calls_part, 'dict') else tool_calls_part.model_dump()
                            yield f"data: {{\"type\":\"response.content_part.added\",\"item_id\":\"{message_id}\",\"output_index\":0,\"content_index\":{content_part_index},\"part\":{json.dumps(part_dict_added)}}}\n\n"
                            
                            yield f"event: response.content_part.done\n"
                            part_dict_done = tool_calls_part.dict() if hasattr(tool_calls_part, 'dict') else tool_calls_part.model_dump()
                            yield f"data: {{\"type\":\"response.content_part.done\",\"item_id\":\"{message_id}\",\"output_index\":0,\"content_index\":{content_part_index},\"part\":{json.dumps(part_dict_done)}}}\n\n"
                            
                            final_content.append(tool_calls_part)
                    
                    # Send response.output_item.done event
                    final_item = ResponseMessage(
                        id=message_id,
                        type="message",
                        role="assistant",
                        content=final_content,
                        status="completed"
                    )
                    yield f"event: response.output_item.done\n"
                    item_dict = final_item.dict() if hasattr(final_item, 'dict') else final_item.model_dump()
                    yield f"data: {{\"type\":\"response.output_item.done\",\"output_index\":0,\"item\":{json.dumps(item_dict)}}}\n\n"
                    
                    # Send response.completed event
                    final_response = base_response.copy()
                    final_response.update({
                        "status": "completed",
                        "output": [final_item.dict() if hasattr(final_item, 'dict') else final_item.model_dump()],
                        "usage": {
                            "input_tokens": prompt_tokens,
                            "output_tokens": completion_tokens,
                            "output_tokens_details": {"reasoning_tokens": 0},
                            "total_tokens": total_tokens
                        }
                    })
                    yield f"event: response.completed\n"
                    yield f"data: {{\"type\":\"response.completed\",\"response\":{json.dumps(final_response)}}}\n\n"
                    break
        
        except Exception as e:
            # Send error event
            error_response = base_response.copy()
            error_response.update({
                "status": "failed",
                "error": {
                    "message": f"Streaming error: {str(e)}",
                    "type": "stream_error",
                    "code": "streaming_failed"
                }
            })
            yield f"event: response.failed\n"
            yield f"data: {{\"type\":\"response.failed\",\"response\":{json.dumps(error_response)}}}\n\n"
    
    return StreamingResponse(response_stream_generator(), media_type="text/event-stream")

async def generate_response_with_provider(client, req: ResponseRequest) -> ResponseData:
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
        temperature=req.temperature or 0.7,
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
    
    # Build content array based on what we have
    content_parts = []
    
    # Add text content if present
    if output_text:
        content_parts.append(OutputTextContentPart(type="text", text=output_text))
    
    # Add tool calls if present
    if tool_calls:
        content_parts.append(ToolCallsContentPart(type="tool_calls", tool_calls=tool_calls))
    
    # Create the response output in the format expected by OpenAI client
    response_data = ResponseData(
        id=str(uuid.uuid4()),
        object="response",
        created=int(time.time()),
        model=req.model,
        status="completed",
        output=[ResponseMessage(
            id=f"msg_{uuid.uuid4().hex}",
            type="message",
            role="assistant",
            content=content_parts,
            status="completed"
        )],
        usage=chat_response.usage,
        key_name=chat_response.key_name,
        system_fingerprint=chat_response.system_fingerprint,
        instructions="You are a helpful assistant.",
        temperature=req.temperature or 0.7,
        tools=req.tools,
        tool_choice=req.tool_choice,
        parallel_tool_calls=True
    )
    
    return response_data

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
    # Use .dict() for Pydantic v1, .model_dump() for v2
    request_payload = req.dict() if hasattr(req, 'dict') else req.model_dump()
    status_code = 200
    response_data = None
    error_content = None

    try:
        # Check if streaming is requested
        if req.stream:
            # Handle streaming response
            streaming_response = await generate_streaming_response_with_provider(client, req)
            
            # For streaming, we'll need to set up fire-and-forget logging differently
            # since we can't get exact token counts until the stream is complete
            # This is handled within the streaming generator
            
            return streaming_response
        else:
            # Generate response using the primary provider (non-streaming)
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
                    response_payload=response_data.dict() if hasattr(response_data, 'dict') else response_data.model_dump(),
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