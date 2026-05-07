from openai import AsyncOpenAI
from app.config.settings import get_settings
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.settings = get_settings()
        self.client = AsyncOpenAI(api_key=self.settings.OPENAI_API_KEY)
        self.model = self.settings.LLM_MODEL

    async def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]]) -> str:
        """
        Generates an answer using OpenAI GPT based on the provided context chunks.
        """
        if not self.settings.OPENAI_API_KEY:
            return "Mock AI Answer: OpenAI API key is not configured. Here is what I found in the documents:\n\n" + "\n".join([f"- {c['text'][:100]}..." for c in context_chunks])

        context_text = "\n\n---\n\n".join(
            [f"Document: {chunk['metadata'].get('source', 'Unknown')} (Page {chunk['metadata'].get('page', 'Unknown')})\n{chunk['text']}" 
             for chunk in context_chunks]
        )

        system_prompt = (
            "You are an expert AI assistant. Answer the user's question based ONLY on the provided context. "
            "If the answer cannot be found in the context, say 'I cannot answer this based on the provided documents.' "
            "Always be accurate, concise, and helpful."
        )

        user_prompt = f"Context:\n{context_text}\n\nQuestion: {query}"

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise Exception("Failed to generate answer from LLM.")

llm_service = LLMService()
