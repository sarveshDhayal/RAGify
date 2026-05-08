import os
from typing import Dict, Any
from app.services.pdf_service import pdf_service
from app.services.chunk_service import chunk_service
from app.services.vector_service import vector_service
from app.services.llm_service import llm_service
from app.schemas.chat import ChatResponse, SourceCitation
import logging

logger = logging.getLogger(__name__)

class RAGService:
    async def process_document(self, file_path: str, filename: str, user_id: str) -> Dict[str, Any]:
        """
        End-to-end pipeline for ingesting a document for a specific user.
        """
        logger.info(f"Processing document: {filename} for user: {user_id}")
        
        # 1. Extract text
        docs = await pdf_service.extract_text(file_path)
        logger.info(f"Extracted text from {len(docs)} pages.")
        
        # 2. Chunk text
        chunks = await chunk_service.create_chunks(docs)
        logger.info(f"Created {len(chunks)} chunks.")
        
        # 3. Embed & Store with tenant isolation
        ids = await vector_service.store_chunks(chunks, user_id)
        logger.info(f"Stored {len(ids)} vectors in ChromaDB.")
        
        return {
            "status": "success",
            "chunks_processed": len(chunks),
            "document_id": filename
        }

    async def ask_question(self, messages: list, user_id: str) -> ChatResponse:
        """
        End-to-end pipeline for RAG querying specific to a user.
        """
        question = messages[-1].content
        # 1. Retrieve relevant chunks for THIS user only
        results = await vector_service.similarity_search(question, user_id, k=4)
        
        # 2. Generate answer using LLM
        answer = await llm_service.generate_answer(messages, results)
        
        # 3. Format citations
        sources = []
        for res in results:
            sources.append(SourceCitation(
                page=res["metadata"].get("page"),
                text=res["text"],
                document=res["metadata"].get("source", "Unknown"),
                chunk_id=str(res["metadata"].get("chunk_index", "")) if res["metadata"].get("chunk_index") is not None else None
            ))
            
        return ChatResponse(
            answer=answer,
            sources=sources
        )

rag_service = RAGService()
