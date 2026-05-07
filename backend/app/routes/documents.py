import os
import uuid
import glob
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.schemas.document import DocumentResponse, DocumentListResponse
from app.services.rag_service import rag_service
from app.utils.auth import get_current_user
from typing import List

router = APIRouter()

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    if not file.filename.endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")
    
    file_id = str(uuid.uuid4())
    safe_filename = f"{user_id}_{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        result = await rag_service.process_document(file_path, file.filename, user_id)
        
        return DocumentResponse(
            id=file_id,
            filename=file.filename,
            status="success",
            chunks=result["chunks_processed"],
            message="File processed and vectors stored successfully"
        )
        
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@router.get("/documents", response_model=List[DocumentListResponse])
async def get_documents(user_id: str = Depends(get_current_user)):
    """Get list of uploaded documents for the current user"""
    files = glob.glob(os.path.join(UPLOAD_DIR, f"{user_id}_*"))
    docs = []
    for filepath in files:
        filename = os.path.basename(filepath)
        # Format: user_id_file_id_filename.ext
        parts = filename.split("_", 2)
        if len(parts) == 3:
            docs.append(DocumentListResponse(
                id=parts[1],
                filename=parts[2]
            ))
    return docs

@router.delete("/document/{doc_id}")
async def delete_document(doc_id: str, user_id: str = Depends(get_current_user)):
    files = glob.glob(os.path.join(UPLOAD_DIR, f"{user_id}_{doc_id}_*"))
    if not files:
        raise HTTPException(status_code=404, detail="Document not found")
        
    for filepath in files:
        try:
            os.remove(filepath)
        except:
            pass
    # TODO: Delete from ChromaDB
    return {"status": "success", "message": f"Document {doc_id} deleted."}
