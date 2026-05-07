from fastapi import APIRouter, HTTPException, Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_service import rag_service
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: ChatRequest, user_id: str = Depends(get_current_user)):
    try:
        response = await rag_service.ask_question(request.question, user_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate answer: {str(e)}")
