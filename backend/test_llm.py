import asyncio
from app.services.llm_service import LLMService

async def main():
    try:
        service = LLMService()
        res = await service.generate_answer("Hello", "Context: Hello")
        print("Success:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
