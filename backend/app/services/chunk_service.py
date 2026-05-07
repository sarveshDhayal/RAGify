from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Dict, Any
from app.config.settings import get_settings

class ChunkService:
    def __init__(self):
        settings = get_settings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

    async def create_chunks(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Splits documents into smaller chunks for embedding.
        Maintains metadata (page numbers, source) for each chunk.
        """
        chunks = []
        for doc in documents:
            texts = self.text_splitter.split_text(doc["text"])
            for idx, text in enumerate(texts):
                chunk_meta = doc["metadata"].copy()
                chunk_meta["chunk_index"] = idx
                chunks.append({
                    "text": text,
                    "metadata": chunk_meta
                })
        return chunks

chunk_service = ChunkService()
