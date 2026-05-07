# RAGify - Fullstack AI Document Q&A (RAG) Platform

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Vector Database**: ChromaDB
- **Embeddings**: HuggingFace BGE-small
- **LLM**: OpenAI GPT
- **Database**: MongoDB (Future Support)

## Project Structure
```
RAGify/
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components/views
│   │   ├── services/     # API integration
│   │   ├── hooks/        # Custom React hooks
│   │   ├── types/        # TypeScript interfaces
│   │   ├── layouts/      # Page layouts
│   │   ├── utils/        # Helper functions
│   │   └── App.tsx       # Root component
├── backend/              # FastAPI application
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic and AI services
│   ├── models/           # Data models (Pydantic, later Beanie/Mongo)
│   ├── utils/            # Helper functions
│   ├── vectorstore/      # Local ChromaDB persistence
│   ├── uploads/          # Temporary/Stored uploaded PDFs
│   ├── app.py            # FastAPI main application
│   └── requirements.txt  # Python dependencies
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment:
   - Mac/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and add your API keys.
6. Run the server: `uvicorn app:app --reload` (Server will start on `http://localhost:8000`)

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev` (Server will start on `http://localhost:5173`)

### Docker Setup
To run everything together using Docker:
```bash
docker-compose up --build
```