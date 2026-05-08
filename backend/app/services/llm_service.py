from openai import AsyncOpenAI
from app.config.settings import get_settings
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.settings = get_settings()
        api_key = self.settings.OPENAI_API_KEY
        # Automatically route to Gemini if a Google API Key is provided
        if api_key and api_key.startswith("AIza"):
            self.client = AsyncOpenAI(api_key=api_key, base_url="https://generativelanguage.googleapis.com/v1beta/openai/")
        else:
            self.client = AsyncOpenAI(api_key=api_key)
        self.model = self.settings.LLM_MODEL

    async def generate_answer(self, messages: list, context_chunks: List[Dict[str, Any]]) -> str:
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
            "You are RAGify AI, a sophisticated document assistant. "
            "Use the provided context to answer the user's questions accurately and professionally. "
            "1. If the user greets you (e.g., 'hi', 'hello'), respond warmly and invite them to ask about the documents. "
            "2. If the answer is in the context, provide a detailed response with citations where possible. "
            "3. If the answer is NOT in the context but is general knowledge, you may answer it but mention that the info isn't in the specific documents. "
            "4. Only say 'I cannot find that in the documents' if the question is specific to the documents but the data is missing."
        )

        question = messages[-1].content
        user_prompt = f"Context:\n{context_text}\n\nQuestion: {question}"

        openai_messages = [{"role": "system", "content": system_prompt}]
        for msg in messages[:-1]:
            openai_messages.append({"role": msg.role, "content": msg.content})
        openai_messages.append({"role": "user", "content": user_prompt})

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=openai_messages,
                temperature=0.3,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"Failed to generate answer from LLM. Detail: {str(e)}")

llm_service = LLMService()
