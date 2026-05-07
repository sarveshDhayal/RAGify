# 🚀 RAGify: AI-Powered Multi-Tenant SaaS

RAGify is a full-stack, secure, multi-tenant AI Document Q&A platform. It seamlessly isolates user documents, embeddings, and chat histories using native Google OAuth.

## 🛠️ Tech Stack
* **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Vercel
* **Backend**: FastAPI, Python, ChromaDB, LangChain, Render
* **AI Models**: Google Gemini (LLM & Embeddings via OpenAI SDK)
* **Auth**: Native Google OAuth 2.0 JWTs

---

## 🌍 Production Deployment Guide

Follow these step-by-step instructions to take RAGify live on the internet for free using **Vercel** (Frontend) and **Render** (Backend).

### Step 1: Push Code to GitHub
Ensure all your latest code is pushed to your main branch:
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Deploy Backend to Render.com
Your backend needs a persistent disk to save uploaded PDFs and ChromaDB vector embeddings.

1. Create an account on [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub account and select your `RAGify` repository.
4. **Setup configuration:**
   - **Name:** `ragify-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Set Environment Variables** (Click Advanced > Add Environment Variable):
   - `OPENAI_API_KEY`: `AIzaSy...` (Your Gemini API Key)
   - `LLM_MODEL`: `gemini-2.5-flash`
   - `ENVIRONMENT`: `production`
6. **Add Persistent Disks** (Required so data survives server restarts):
   - Disk 1 Name: `ragify-uploads` | Mount Path: `/opt/render/project/src/backend/app/uploads`
   - Disk 2 Name: `ragify-chroma` | Mount Path: `/opt/render/project/src/backend/chroma_db`
7. Select the **Starter ($7/mo)** plan (Free tier does not support Disks).
8. Click **Create Web Service**. 
9. *Save your new backend URL (e.g., `https://ragify-backend-xyz.onrender.com`).*

### Step 3: Deploy Frontend to Vercel.com
Vercel is the ultimate hosting platform for Vite/React applications.

1. Log into [Vercel.com](https://vercel.com) with GitHub.
2. Click **Add New Project**.
3. Import your `RAGify` repository.
4. **Setup configuration:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit this to `frontend`
5. **Set Environment Variables**:
   - Add `VITE_API_URL`
   - Value: `https://ragify-backend-xyz.onrender.com` (Your Render URL from Step 2)
6. Click **Deploy**.
7. *Save your new frontend URL (e.g., `https://ragify-app.vercel.app`).*

### Step 4: Final Security Whitelisting
To allow your frontend to talk to your backend and Google:

**1. Update Backend CORS:**
Open `backend/app/middleware/cors.py` locally and add your Vercel URL:
```python
origins = [
    "http://localhost:5173",
    "https://ragify-app.vercel.app"  # Your Vercel URL
]
```
Push this to GitHub (`git add . && git commit -m "Update CORS" && git push`). Render will auto-deploy.

**2. Update Google Cloud OAuth:**
1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Edit your OAuth 2.0 Client ID.
3. Under **Authorized JavaScript origins**, click "Add URI" and paste your Vercel URL.
4. Under **Authorized redirect URIs**, click "Add URI" and paste your Vercel URL.
5. Save.

🎉 **RAGify is now successfully deployed!**