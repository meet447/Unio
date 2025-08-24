from typing import List, Optional, Union
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


# ---- Chat message ----
class Message(BaseModel):
    role: str
    content: Union[str, List[Content]]   # <-- supports plain string OR structured list


# ---- Response models ----
class ChoiceMessage(BaseModel):
    role: str
    content: Union[str, List[Content]]


class Choice(BaseModel):
    index: int
    message: ChoiceMessage
    finish_reason: Optional[str] = None


class Delta(BaseModel):
    content: Optional[str] = None
    role: Optional[str] = None


class ChoiceChunk(BaseModel):
    index: int
    delta: Delta
    finish_reason: Optional[str] = None


# ---- Request / Response ----
class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: float = 0.7
    stream: Optional[bool] = False


class ChatResponse(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[Choice]
    usage: Optional[dict]


class ChatCompletionChunk(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[ChoiceChunk]
