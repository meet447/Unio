from openai import AsyncOpenAI, RateLimitError, APIError
from models.chat import ChatResponse, ChatCompletionChunk, ChatRequest, Usage, Choice, ChoiceMessage, ChoiceChunk, Delta, ToolCall, FunctionCall
from auth.check_key import increment_usage_count, increment_rate_limit_count
from exceptions import RateLimitExceededError, ProviderAPIError
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens, count_tokens_in_tools
import json, time, uuid
import logging

# Configure logging
logger = logging.getLogger(__name__)


class BaseLLMClient:
    def __init__(self, api_keys, base_url: str):
        self.api_keys = api_keys
        self.base_url = base_url

    def _extract_model(self, model: str) -> str:
        """Extract the actual model name from provider:model or provider/model format"""
        if ":" in model:
            parts = model.split(":", 1)
            return parts[1] if len(parts) > 1 else model
        elif "/" in model:
            parts = model.split("/", 1)
            return parts[1] if len(parts) > 1 else model
        else:
            return model

    async def chat_completions(self, req: ChatRequest) -> ChatResponse:
        """
        Non-streaming chat completion built on top of streaming API.
        Collects streamed chunks and returns a final ChatResponse object.
        """
        model = self._extract_model(req.model)
        last_error = None

        # Calculate prompt tokens
        prompt_tokens = count_tokens_in_messages(req.messages, req.model)
        
        # Add tokens for tools if provided
        if req.tools:
            prompt_tokens += count_tokens_in_tools([tool.model_dump() for tool in req.tools], req.model)

        for key_data in self.api_keys:
            api_key = key_data["encrypted_key"]
            api_key_id = key_data["id"]

            try:
                client = AsyncOpenAI(api_key=api_key, base_url=self.base_url)
                
                # Convert messages to dict format for OpenAI API
                messages_dict = []
                for msg in req.messages:
                    msg_dict = {
                        "role": msg.role,
                        "content": msg.content
                    }
                    if msg.tool_calls:
                        msg_dict["tool_calls"] = [tc.model_dump() for tc in msg.tool_calls]
                    if msg.tool_call_id:
                        msg_dict["tool_call_id"] = msg.tool_call_id
                    messages_dict.append(msg_dict)
                
                # Handle reasoning_effort parameter - only include if explicitly provided
                create_params = {
                    "model": model,
                    "messages": messages_dict,
                    "temperature": req.temperature,
                    "stream": True
                }
                
                # Only add reasoning_effort if explicitly provided and valid
                if req.reasoning_effort is not None and req.reasoning_effort in ['minimal', 'low', 'medium', 'high']:
                    create_params["reasoning_effort"] = req.reasoning_effort
                
                # Add tools and tool_choice if provided
                if req.tools:
                    create_params["tools"] = [tool.model_dump() for tool in req.tools]
                
                if req.tool_choice:
                    create_params["tool_choice"] = req.tool_choice
                
                response = await client.chat.completions.create(**create_params)

                increment_usage_count(api_key_id)

                # Collect streamed response
                role = None
                content_parts = []
                finish_reason = None
                tool_calls = []
                
                async for chunk in response:
                    choice = chunk.choices[0]
                    if choice.delta.role:
                        role = choice.delta.role
                    if choice.delta.content:
                        content_parts.append(choice.delta.content)
                    if choice.delta.tool_calls:
                        # Handle tool calls in streaming response
                        for tc in choice.delta.tool_calls:
                            if tc.index is not None:
                                # Extend tool_calls list if needed
                                while len(tool_calls) <= tc.index:
                                    tool_calls.append({
                                        "id": "",
                                        "type": "function",
                                        "function": {"name": "", "arguments": ""}
                                    })
                                
                                # Update the tool call at the specified index
                                if tc.id:
                                    tool_calls[tc.index]["id"] = tc.id
                                if tc.function:
                                    if tc.function.name:
                                        tool_calls[tc.index]["function"]["name"] = tc.function.name
                                    if tc.function.arguments:
                                        tool_calls[tc.index]["function"]["arguments"] += tc.function.arguments
                    
                    if choice.finish_reason:
                        finish_reason = choice.finish_reason

                complete_content = "".join(content_parts)
                completion_tokens = estimate_completion_tokens(complete_content, req.model)
                total_tokens = prompt_tokens + completion_tokens

                # Convert tool_calls to proper format if present
                response_tool_calls = None
                if tool_calls:
                    response_tool_calls = [
                        ToolCall(
                            id=tc["id"],
                            type="function",
                            function=FunctionCall(
                                name=tc["function"]["name"],
                                arguments=tc["function"]["arguments"]
                            )
                        ) for tc in tool_calls if tc["id"] and tc["function"]["name"]
                    ]

                return ChatResponse(
                    id=str(uuid.uuid4()),
                    object="chat.completion",
                    created=int(time.time()),
                    model=req.model,
                    choices=[
                        Choice(
                            index=0,
                            message=ChoiceMessage(
                                role=role or "assistant", 
                                content=complete_content or None,
                                tool_calls=response_tool_calls
                            ),
                            finish_reason=finish_reason or "stop",
                        )
                    ],
                    key_name=key_data["name"],
                    usage=Usage(
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens,
                        total_tokens=total_tokens
                    ),
                    system_fingerprint=f"fp_{int(time.time())}"
                )

            except RateLimitError as e:
                logger.warning(f"Rate limit error with key {key_data['name']}: {str(e)}")
                increment_rate_limit_count(api_key_id)
                last_error = RateLimitExceededError(f"Rate limit exceeded: {str(e)}")
            except APIError as e:
                status_code = getattr(e, 'status_code', 500)
                logger.warning(f"API error with key {key_data['name']}: {str(e)} (status: {status_code})")
                last_error = ProviderAPIError(f"Provider API error: {str(e)}", status_code=status_code)
            except Exception as e:
                logger.error(f"Unexpected error with key {key_data['name']}: {str(e)}")
                last_error = ProviderAPIError(f"Unexpected error: {str(e)}")

        # Log final error state
        if last_error:
            logger.error(f"All API keys exhausted. Final error: {str(last_error)} (Type: {type(last_error).__name__})")
            raise last_error
        
        # This should not happen if api_keys is not empty
        error_msg = "No API keys available"
        logger.error(error_msg)
        raise ProviderAPIError(error_msg)

    async def stream_chat_completions(self, req: ChatRequest):
        """
        Streaming chat completion (SSE style).
        Yields individual chunks as they arrive.
        """
        model = self._extract_model(req.model)
        last_error = None

        # Calculate prompt tokens
        prompt_tokens = count_tokens_in_messages(req.messages, req.model)
        
        # Add tokens for tools if provided
        if req.tools:
            prompt_tokens += count_tokens_in_tools([tool.model_dump() for tool in req.tools], req.model)

        for key_data in self.api_keys:
            api_key = key_data["encrypted_key"]
            api_key_id = key_data["id"]

            try:
                client = AsyncOpenAI(api_key=api_key, base_url=self.base_url)
                
                # Convert messages to dict format for OpenAI API
                messages_dict = []
                for msg in req.messages:
                    msg_dict = {
                        "role": msg.role,
                        "content": msg.content
                    }
                    if msg.tool_calls:
                        msg_dict["tool_calls"] = [tc.model_dump() for tc in msg.tool_calls]
                    if msg.tool_call_id:
                        msg_dict["tool_call_id"] = msg.tool_call_id
                    messages_dict.append(msg_dict)
                
                # Handle reasoning_effort parameter - only include if explicitly provided
                create_params = {
                    "model": model,
                    "messages": messages_dict,
                    "temperature": req.temperature,
                    "stream": True
                }
                
                # Only add reasoning_effort if explicitly provided and valid
                if req.reasoning_effort is not None and req.reasoning_effort in ['minimal', 'low', 'medium', 'high']:
                    create_params["reasoning_effort"] = req.reasoning_effort
                
                # Add tools and tool_choice if provided
                if req.tools:
                    create_params["tools"] = [tool.model_dump() for tool in req.tools]
                
                if req.tool_choice:
                    create_params["tool_choice"] = req.tool_choice
                
                response = await client.chat.completions.create(**create_params)

                # Track completion content for token counting
                completion_content = ""
                finish_reason = None
                usage_incremented = False
                tool_calls_streaming = []  # Track tool calls for streaming

                async for chunk in response:
                    # Increment usage count only after first successful chunk
                    if not usage_incremented:
                        increment_usage_count(api_key_id)
                        usage_incremented = True
                    
                    delta = {}
                    current_finish_reason = None
                    
                    if chunk.choices[0].delta.role:
                        delta["role"] = chunk.choices[0].delta.role
                    if chunk.choices[0].delta.content:
                        delta["content"] = chunk.choices[0].delta.content
                        completion_content += chunk.choices[0].delta.content
                    
                    # Handle tool calls in streaming
                    if chunk.choices[0].delta.tool_calls:
                        delta_tool_calls = []
                        for tc in chunk.choices[0].delta.tool_calls:
                            if tc.index is not None:
                                # Extend tool_calls_streaming list if needed
                                while len(tool_calls_streaming) <= tc.index:
                                    tool_calls_streaming.append({
                                        "id": "",
                                        "type": "function",
                                        "function": {"name": "", "arguments": ""}
                                    })
                                
                                # Create delta tool call
                                delta_tc = {"index": tc.index, "type": "function"}
                                function_delta = {}
                                
                                # Update the tool call at the specified index
                                if tc.id:
                                    tool_calls_streaming[tc.index]["id"] = tc.id
                                    delta_tc["id"] = tc.id
                                
                                if tc.function:
                                    if tc.function.name:
                                        tool_calls_streaming[tc.index]["function"]["name"] = tc.function.name
                                        function_delta["name"] = tc.function.name
                                    if tc.function.arguments:
                                        tool_calls_streaming[tc.index]["function"]["arguments"] += tc.function.arguments
                                        function_delta["arguments"] = tc.function.arguments
                                
                                if function_delta:
                                    delta_tc["function"] = function_delta
                                
                                delta_tool_calls.append(delta_tc)
                        
                        if delta_tool_calls:
                            delta["tool_calls"] = delta_tool_calls
                    
                    # Capture finish reason but only include it in chunks with content
                    if chunk.choices[0].finish_reason:
                        finish_reason = chunk.choices[0].finish_reason
                        # Only include finish_reason if this chunk has content or role or tool_calls
                        if delta:
                            current_finish_reason = finish_reason
                    
                    # Only yield chunks that have meaningful delta content
                    if delta:
                        event = ChatCompletionChunk(
                            id=str(uuid.uuid4()),
                            object="chat.completion.chunk",
                            created=int(time.time()),
                            model=req.model,
                            choices=[ChoiceChunk(
                                index=0, 
                                delta=Delta(**delta),
                                finish_reason=current_finish_reason
                            )],
                            key_name=key_data["name"],
                            system_fingerprint=f"fp_{int(time.time())}"
                        ).model_dump_json()

                        yield f"data: {event}\n\n"

                # Send usage information in final chunk before [DONE]
                completion_tokens = estimate_completion_tokens(completion_content, req.model)
                total_tokens = prompt_tokens + completion_tokens
                
                usage_chunk = ChatCompletionChunk(
                    id=str(uuid.uuid4()),
                    object="chat.completion.chunk",
                    created=int(time.time()),
                    model=req.model,
                    choices=[ChoiceChunk(
                        index=0,
                        delta=Delta(content=None),  # Explicitly set content to None for usage chunks
                        finish_reason=None
                    )],
                    key_name=key_data["name"],
                    usage=Usage(
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens,
                        total_tokens=total_tokens
                    ),
                    system_fingerprint=f"fp_{int(time.time())}"
                ).model_dump_json()

                yield f"data: {usage_chunk}\n\n"
                yield "data: [DONE]\n\n"
                return

            except RateLimitError as e:
                logger.warning(f"Rate limit error in streaming with key {key_data['name']}: {str(e)}")
                increment_rate_limit_count(api_key_id)
                last_error = RateLimitExceededError(f"Rate limit exceeded: {str(e)}")
            except APIError as e:
                status_code = getattr(e, 'status_code', 500)
                logger.warning(f"API error in streaming with key {key_data['name']}: {str(e)} (status: {status_code})")
                last_error = ProviderAPIError(f"Provider API error: {str(e)}", status_code=status_code)
            except Exception as e:
                logger.error(f"Unexpected error in streaming with key {key_data['name']}: {str(e)}")
                last_error = ProviderAPIError(f"Unexpected error: {str(e)}")

        # Log final error state
        if last_error:
            logger.error(f"All API keys exhausted in streaming. Final error: {str(last_error)} (Type: {type(last_error).__name__})")
            raise last_error
        
        # This should not happen if api_keys is not empty
        error_msg = "No API keys available for streaming"
        logger.error(error_msg)
        raise ProviderAPIError(error_msg)