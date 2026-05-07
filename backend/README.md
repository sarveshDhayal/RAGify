# RAGify Backend - Production Ready RAG API

This is the FastAPI backend for RAGify, implementing a full Retrieval-Augmented Generation (RAG) pipeline.

## Tech Stack
- **Framework**: FastAPI
- **LLM Engine**: OpenAI (GPT-4o-mini)
- **Embeddings**: BAAI/bge-small-en-v1.5 (via HuggingFace / sentence-transformers)
- **Vector Database**: ChromaDB (Local persistent)
- **Document Processing**: Langchain, PyPDF2
- **Validation**: Pydantic v2

## Architecture

```
backend/
├── app/
│   ├── main.py              # Application entrypoint
│   ├── config/              # Pydantic BaseSettings
│   ├── middleware/          # CORS and global error handlers
│   ├── routes/              # FastAPI APIRouter endpoints
│   ├── schemas/             # Request/Response Pydantic models
│   ├── services/            # Business logic and AI components
│   │   ├── chunk_service.py # Langchain text splitting
│   │   ├── embedding_service.py # HuggingFace embeddings
│   │   ├── llm_service.py   # OpenAI GPT integration
│   │   ├── pdf_service.py   # PDF text extraction
│   │   ├── rag_service.py   # RAG pipeline orchestrator
│   │   └── vector_service.py # ChromaDB interactions
│   ├── uploads/             # Raw PDF storage
│   └── vectorstore/         # ChromaDB persistence directory
```

## Setup Instructions

1. Ensure you have Python 3.9+ installed.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env`:
   ```env
   OPENAI_API_KEY=your-api-key-here
   LLM_MODEL=gpt-4o-mini
   ENVIRONMENT=development
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Documentation
Once running, interactive API docs (Swagger UI) are available at:
`http://localhost:8000/docs`
