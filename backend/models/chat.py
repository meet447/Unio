from typing import List, Optional, Union, Any, Literal
from pydantic import BaseModel


# ---- Content blocks ----
class TextContent(BaseModel):
    type: str = "text"
    text: str


class ImageURL(BaseModel):
    url: str


class ImageContent(BaseModel):
    type: str = "image_url"
    image_url: ImageURL


Content = Union[str, TextContent, ImageContent]


# ---- Tool calling models ----
class FunctionParameters(BaseModel):
    type: str = "object"
    properties: dict
    required: Optional[List[str]] = None


class Function(BaseModel):
    name: str
    description: Optional[str] = None
    parameters: Optional[FunctionParameters] = None


class Tool(BaseModel):
    type: Literal["function"] = "function"
    function: Function


class ToolCall(BaseModel):
    id: str
    type: Literal["function"] = "function"
    function: "FunctionCall"


class FunctionCall(BaseModel):
    name: str
    arguments: str  # JSON string


# ---- Chat message ----
class Message(BaseModel):
    role: str
    content: Optional[Union[str, List[Content]]] = None   # <-- supports plain string OR structured list
    tool_calls: Optional[List[ToolCall]] = None  # For assistant messages with tool calls
    tool_call_id: Optional[str] = None  # For tool messages


# ---- Response models ----
class ChoiceMessage(BaseModel):
    role: str
    content: Optional[Union[str, List[Content]]] = None
    tool_calls: Optional[List[ToolCall]] = None


class Choice(BaseModel):
    index: int
    message: ChoiceMessage
    finish_reason: Optional[str] = None
    logprobs: Optional[dict] = None


class Delta(BaseModel):
    content: Optional[str] = None
    role: Optional[str] = None
    tool_calls: Optional[List[ToolCall]] = None


class ChoiceChunk(BaseModel):
    index: int
    delta: Delta
    finish_reason: Optional[str] = None
    logprobs: Optional[dict] = None


class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


# ---- Request / Response ----
class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: float = 0.7
    stream: Optional[bool] = False
    reasoning_effort: Optional[str] = None
    fallback_model: Optional[str] = None  # For automatic fallback when primary provider fails
    tools: Optional[List[Tool]] = None  # Tool definitions for function calling
    tool_choice: Optional[Union[str, dict]] = None  # Controls tool usage: "none", "auto", or specific tool


class ChatResponse(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[Choice]
    key_name: str
    usage: Optional[Usage] = None
    system_fingerprint: Optional[str] = None


class ChatCompletionChunk(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[ChoiceChunk]
    key_name: str
    usage: Optional[Usage] = None
    system_fingerprint: Optional[str] = None


# ---- OpenAI Response API Models (Official Types) ----
class ResponseRequest(BaseModel):
    model: str
    input: Union[str, List[Message]]  # Can be a simple string or conversation messages
    temperature: Optional[float] = 0.7
    stream: Optional[bool] = False  # Enable streaming responses
    reasoning_effort: Optional[str] = None
    fallback_model: Optional[str] = None  # For automatic fallback when primary provider fails
    tools: Optional[List[Tool]] = None  # Tool definitions for function calling
    tool_choice: Optional[Union[str, dict]] = None  # Controls tool usage: "none", "auto", or specific tool
    max_output_tokens: Optional[int] = None
    instructions: Optional[str] = None
    metadata: Optional[dict] = None
    parallel_tool_calls: Optional[bool] = True
    response_format: Optional[dict] = None
    top_p: Optional[float] = None
    truncation: Optional[dict] = None
    user: Optional[str] = None


# Response content part structures (matching OpenAI official types)
class OutputTextContentPart(BaseModel):
    type: Literal["text"] = "text"
    text: str


class ToolCallsContentPart(BaseModel):
    type: Literal["tool_calls"] = "tool_calls"
    tool_calls: List[ToolCall]


# Union type for all content parts
ResponseContentPart = Union[OutputTextContentPart, ToolCallsContentPart]


# Response message structure (official OpenAI format)
class ResponseMessage(BaseModel):
    id: str
    type: Literal["message"] = "message"
    role: Literal["assistant"] = "assistant"
    content: List[ResponseContentPart]
    status: Literal["in_progress", "completed"] = "completed"


# Main response object (official OpenAI format)
class ResponseData(BaseModel):
    id: str
    object: Literal["response"] = "response"
    created: int
    model: str
    output: List[ResponseMessage]
    status: Literal["in_progress", "completed", "failed", "cancelled"] = "completed"
    
    # Optional fields
    error: Optional[dict] = None
    incomplete_details: Optional[dict] = None
    instructions: Optional[str] = "You are a helpful assistant."
    max_output_tokens: Optional[int] = None
    parallel_tool_calls: Optional[bool] = True
    previous_response_id: Optional[str] = None
    reasoning: Optional[dict] = None
    response_format: Optional[dict] = None
    store: Optional[bool] = None
    temperature: Optional[float] = None
    text: Optional[dict] = None
    tool_choice: Optional[Union[str, dict]] = None
    tools: Optional[List[Tool]] = None
    top_p: Optional[float] = None
    truncation: Optional[dict] = None
    usage: Optional[Usage] = None
    user: Optional[str] = None
    metadata: Optional[dict] = None
    
    # Custom fields for compatibility
    key_name: Optional[str] = None
    system_fingerprint: Optional[str] = None


# Streaming response structures
class ResponseDelta(BaseModel):
    content: Optional[str] = None
    tool_calls: Optional[List[ToolCall]] = None


class ResponseChoiceChunk(BaseModel):
    index: int
    delta: ResponseDelta
    finish_reason: Optional[str] = None


class ResponseCompletionChunk(BaseModel):
    id: str
    object: str = "response.chunk"
    created: int
    model: str
    choices: List[ResponseChoiceChunk]
    key_name: str
    usage: Optional[Usage] = None
    system_fingerprint: Optional[str] = None

