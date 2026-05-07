from pydantic import BaseModel
from typing import List, Optional

class SourceCitation(BaseModel):
    page: Optional[int]
    text: str
    document: str
    chunk_id: Optional[str]

class ChatRequest(BaseModel):
    question: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceCitation]
