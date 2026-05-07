import os
from typing import List, Dict, Any
from langchain_community.vectorstores import Chroma
from app.config.settings import get_settings
from app.services.embedding_service import embedding_service
import uuid

class VectorService:
    def __init__(self):
        self.settings = get_settings()
        os.makedirs(self.settings.CHROMA_DB_DIR, exist_ok=True)
        self.vectorstore = None

    def _get_vectorstore(self):
        if not self.vectorstore:
            embeddings = embedding_service.get_embeddings()
            if not embeddings:
                raise ValueError("Embeddings model not initialized.")
            
            self.vectorstore = Chroma(
                persist_directory=self.settings.CHROMA_DB_DIR,
                embedding_function=embeddings,
                collection_name="ragify_docs"
            )
        return self.vectorstore

    async def store_chunks(self, chunks: List[Dict[str, Any]], user_id: str) -> List[str]:
        """
        Stores document chunks into ChromaDB with tenant isolation.
        """
        vs = self._get_vectorstore()
        texts = [chunk["text"] for chunk in chunks]
        metadatas = []
        for chunk in chunks:
            meta = chunk["metadata"].copy()
            meta["user_id"] = user_id  # Inject tenant ID for isolation
            metadatas.append(meta)
            
        ids = [str(uuid.uuid4()) for _ in chunks]
        
        vs.add_texts(texts=texts, metadatas=metadatas, ids=ids)
        vs.persist()
        return ids

    async def similarity_search(self, query: str, user_id: str, k: int = 4) -> List[Dict[str, Any]]:
        """
        Performs similarity search against stored vectors ONLY for the given user.
        """
        vs = self._get_vectorstore()
        # Ensure we only fetch chunks that belong to this specific user_id
        results = vs.similarity_search_with_score(query, k=k, filter={"user_id": user_id})
        
        formatted_results = []
        for doc, score in results:
            formatted_results.append({
                "text": doc.page_content,
                "metadata": doc.metadata,
                "score": float(score)
            })
            
        return formatted_results

vector_service = VectorService()
