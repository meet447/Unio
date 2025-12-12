from fastapi import Header, APIRouter
from fastapi.responses import JSONResponse, StreamingResponse
from models.chat import (
    ResponseRequest, OutputTextContentPart, ToolCallsContentPart, ResponseMessage, ResponseData, 
    Message, Usage, ChatRequest
)
from services.provider import get_provider
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError
from utils.error_handler import create_error_response, fire_and_forget_log
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
            return await _generate_response(client, req, user_id, api_key, request_payload, start_time)
            
    except (RateLimitExceededError, ProviderAPIError) as e:
        # Try fallback
        if req.fallback_model:
            try:
                fallback_client = get_provider(model=req.fallback_model, user_id=user_id)
                req.model = req.fallback_model
                if req.stream:
                    return await _generate_streaming_response(fallback_client, req, user_id, api_key, request_payload, start_time)
                else:
                    return await _generate_response(fallback_client, req, user_id, api_key, request_payload, start_time)
            except Exception:
                pass
        return create_error_response(e)
    
    except Exception as e:
        logger.error(f"Response generation error: {e}", exc_info=True)
        return create_error_response(e)


async def _generate_response(client, req: ResponseRequest, user_id: str, api_key: str, request_payload: dict, start_time: float) -> ResponseData:
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
    
    # Build response content
    content_parts = []
    if chat_response.choices and chat_response.choices[0].message.content:
        content_parts.append(OutputTextContentPart(type="text", text=chat_response.choices[0].message.content))
    if chat_response.choices and chat_response.choices[0].message.tool_calls:
        content_parts.append(ToolCallsContentPart(type="tool_calls", tool_calls=chat_response.choices[0].message.tool_calls))
    
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
        instructions=req.instructions or "You are a helpful assistant.",
        temperature=req.temperature or 0.7,
        tools=req.tools,
        tool_choice=req.tool_choice
    )
    
    # Log request
    usage = chat_response.usage
    fire_and_forget_log(
        user_id=user_id,
        api_key=api_key,
        provider=req.model,
        model=req.model,
        status=200,
        request_payload=request_payload,
        response_payload=response_data.model_dump(),
        start_time=start_time,
        prompt_tokens=usage.prompt_tokens if usage else 0,
        completion_tokens=usage.completion_tokens if usage else 0,
        total_tokens=usage.total_tokens if usage else 0,
        key_name=chat_response.key_name
    )
    
    return response_data


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
    
    prompt_tokens = count_tokens_in_messages(messages, req.model)
    if req.tools:
        prompt_tokens += count_tokens_in_tools([tool.model_dump() for tool in req.tools], req.model)
    
    async def stream_generator():
        response_id = f"resp_{uuid.uuid4().hex}"
        message_id = f"msg_{uuid.uuid4().hex}"
        created_time = int(time.time())
        completion_content = ""
        
        base_response = {
            "id": response_id,
            "object": "response",
            "created_at": created_time,
            "status": "in_progress",
            "model": req.model,
            "output": [],
        }
        
        # Send initial events
        yield f"event: response.created\ndata: {json.dumps({'type': 'response.created', 'response': base_response})}\n\n"
        yield f"event: response.in_progress\ndata: {json.dumps({'type': 'response.in_progress', 'response': base_response})}\n\n"
        
        output_item = {"id": message_id, "type": "message", "status": "in_progress", "role": "assistant", "content": []}
        yield f"event: response.output_item.added\ndata: {json.dumps({'type': 'response.output_item.added', 'output_index': 0, 'item': output_item})}\n\n"
        
        content_added = False
        
        async for chunk in client.stream_chat_completions(req=chat_req):
            if chunk.startswith('data: ') and '[DONE]' not in chunk:
                try:
                    data = json.loads(chunk[6:].strip())
                    if 'choices' in data and data['choices']:
                        delta = data['choices'][0].get('delta', {})
                        if delta.get('content'):
                            if not content_added:
                                yield f"event: response.content_part.added\ndata: {json.dumps({'type': 'response.content_part.added', 'item_id': message_id, 'output_index': 0, 'content_index': 0, 'part': {'type': 'text', 'text': ''}})}\\n\\n"
                                content_added = True
                            
                            completion_content += delta['content']
                            yield f"event: response.output_text.delta\ndata: {json.dumps({'type': 'response.output_text.delta', 'item_id': message_id, 'output_index': 0, 'content_index': 0, 'delta': delta['content']})}\n\n"
                except (json.JSONDecodeError, KeyError):
                    pass
        
        # Send completion events
        completion_tokens = estimate_completion_tokens(completion_content, req.model)
        total_tokens = prompt_tokens + completion_tokens
        
        if content_added:
            yield f"event: response.output_text.done\ndata: {json.dumps({'type': 'response.output_text.done', 'item_id': message_id, 'output_index': 0, 'content_index': 0, 'text': completion_content})}\n\n"
        
        final_response = base_response.copy()
        final_response.update({
            "status": "completed",
            "usage": {"input_tokens": prompt_tokens, "output_tokens": completion_tokens, "total_tokens": total_tokens}
        })
        yield f"event: response.completed\ndata: {json.dumps({'type': 'response.completed', 'response': final_response})}\n\n"
    
    return StreamingResponse(stream_generator(), media_type="text/event-stream")