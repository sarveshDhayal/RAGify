from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from app.config.settings import get_settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        settings = get_settings()
        logger.info(f"Initializing HuggingFace BGE Embeddings: {settings.EMBEDDING_MODEL}")
        
        # BAAI/bge-small-en or similar
        model_kwargs = {'device': 'cpu'} # Change to cuda if GPU is available
        encode_kwargs = {'normalize_embeddings': True} # True for cosine similarity
        
        try:
            self.embeddings = HuggingFaceBgeEmbeddings(
                model_name=settings.EMBEDDING_MODEL,
                model_kwargs=model_kwargs,
                encode_kwargs=encode_kwargs
            )
        except Exception as e:
            logger.warning(f"Failed to initialize BGE embeddings, falling back to dummy/default: {e}")
            self.embeddings = None

    def get_embeddings(self):
        return self.embeddings

embedding_service = EmbeddingService()
