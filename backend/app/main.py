from fastapi import FastAPI
from app.config.settings import get_settings
from app.middleware.cors import setup_cors
from app.middleware.error_handler import setup_error_handler
from app.routes import documents, chat
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-ready Retrieval-Augmented Generation API",
    version="1.0.0"
)

# Setup Middlewares
setup_cors(app)
setup_error_handler(app)

# Include Routers
app.include_router(documents.router, prefix="/api", tags=["Documents"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
