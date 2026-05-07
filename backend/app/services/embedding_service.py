from app.config.settings import get_settings
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        settings = get_settings()
        api_key = settings.OPENAI_API_KEY
        
        try:
            if api_key and api_key.startswith("AIza"):
                logger.info("Initializing Google Generative AI Embeddings")
                self.embeddings = GoogleGenerativeAIEmbeddings(
                    model="models/text-embedding-004",
                    google_api_key=api_key
                )
            elif api_key and api_key.startswith("sk-"):
                logger.info("Initializing OpenAI Embeddings")
                self.embeddings = OpenAIEmbeddings(
                    model="text-embedding-3-small",
                    openai_api_key=api_key
                )
            else:
                logger.warning("No valid API key found. Embeddings will not work.")
                self.embeddings = None
        except Exception as e:
            logger.error(f"Failed to initialize embeddings: {e}")
            self.embeddings = None

    def get_embeddings(self):
        return self.embeddings

embedding_service = EmbeddingService()
