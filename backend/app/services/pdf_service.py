import os
from PyPDF2 import PdfReader
from typing import List, Dict, Any

class PDFService:
    async def extract_text(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts text from a PDF file.
        Returns a list of dictionaries containing text and metadata (page number).
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        docs = []
        try:
            reader = PdfReader(file_path)
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    docs.append({
                        "text": text,
                        "metadata": {
                            "page": i + 1,
                            "source": os.path.basename(file_path)
                        }
                    })
        except Exception as e:
            raise Exception(f"Failed to parse PDF: {str(e)}")
            
        return docs

pdf_service = PDFService()
