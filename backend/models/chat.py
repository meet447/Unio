from typing import List, Optional
from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class ChoiceMessage(BaseModel):
    role: str
    content: str

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

class ChatCompletionChunk(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[ChoiceChunk]
