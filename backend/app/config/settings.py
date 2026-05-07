from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "RAGify API"
    ENVIRONMENT: str = "development"
    
    # OpenAI Settings
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4-turbo-preview" # Fallback or you can use gpt-4o-mini
    
    # ChromaDB Settings
    CHROMA_DB_DIR: str = "./app/vectorstore"
    
    # Chunking Settings
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 150
    
    # Embeddings
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
