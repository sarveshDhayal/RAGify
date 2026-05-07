import asyncio
import os
from app.services.embedding_service import embedding_service
from app.config.settings import get_settings

async def test_embeddings():
    settings = get_settings()
    print(f"API Key start: {settings.OPENAI_API_KEY[:10]}...")
    
    embedder = embedding_service.get_embeddings()
    if embedder is None:
        print("Error: Embedder is None")
        return

    try:
        text = "This is a test document."
        vector = embedder.embed_query(text)
        print(f"Success! Embedding length: {len(vector)}")
    except Exception as e:
        print(f"Embedding failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_embeddings())
