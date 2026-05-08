from pydantic import BaseModel
from typing import List, Optional

class SourceCitation(BaseModel):
    page: Optional[int]
    text: str
    document: str
    chunk_id: Optional[str]

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceCitation]
