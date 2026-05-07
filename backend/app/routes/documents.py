import os
import uuid
import glob
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.schemas.document import DocumentResponse, DocumentListResponse
from app.services.rag_service import rag_service
from typing import List

router = APIRouter()

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")
    
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        result = await rag_service.process_document(file_path, file.filename)
        
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
async def get_documents():
    """Get list of uploaded documents from local directory"""
    files = glob.glob(os.path.join(UPLOAD_DIR, "*"))
    docs = []
    for filepath in files:
        filename = os.path.basename(filepath)
        # Assumes format: uuid_filename.ext
        parts = filename.split("_", 1)
        if len(parts) == 2:
            docs.append(DocumentListResponse(
                id=parts[0],
                filename=parts[1]
            ))
    return docs

@router.delete("/document/{doc_id}")
async def delete_document(doc_id: str):
    files = glob.glob(os.path.join(UPLOAD_DIR, f"{doc_id}_*"))
    if not files:
        raise HTTPException(status_code=404, detail="Document not found")
        
    for filepath in files:
        try:
            os.remove(filepath)
        except:
            pass
    return {"status": "success", "message": f"Document {doc_id} deleted."}
