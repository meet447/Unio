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

