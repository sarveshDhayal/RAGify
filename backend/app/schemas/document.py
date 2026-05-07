from pydantic import BaseModel
from typing import List, Optional

class DocumentResponse(BaseModel):
    id: str
    filename: str
    status: str
    chunks: int
    message: str

class DocumentListResponse(BaseModel):
    id: str
    filename: str
    metadata: Optional[dict] = None
