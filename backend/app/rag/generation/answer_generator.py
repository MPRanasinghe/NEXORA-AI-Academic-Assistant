
from typing import List, Dict, Any, Optional

from google import genai
from google.genai import types


class GeminiAnswerGenerator:
    """
    Generate grounded academic answers using Gemini
    and context retrieved from university documents.
    """

    def __init__(
        self,
        client: genai.Client,
        model: str,
        temperature: float = 0.2
    ):
        if client is None:
            raise ValueError("Gemini client is required.")

        if not isinstance(model, str) or not model.strip():
            raise ValueError("A valid Gemini model is required.")

        if (
            isinstance(temperature, bool)
            or not isinstance(temperature, (int, float))
            or not 0.0 <= temperature <= 2.0
        ):
            raise ValueError("Temperature must be between 0 and 2.")

        self.client = client
        self.model = model
        self.temperature = temperature

    def generate_answer(
        self,
        query: str,
        context: str,
        sources: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Generate an academic answer using retrieved context.

        Args:
            query: Student's question.
            context: Context prepared by ContextBuilder.
            sources: Source metadata returned by ContextBuilder.

        Returns:
            Generated answer and source information.
        """

        if not isinstance(query, str) or not query.strip():
            raise ValueError("Query cannot be empty.")

        if not isinstance(context, str):
            raise TypeError("Context must be a string.")

        if sources is not None and not isinstance(sources, list):
            raise TypeError("Sources must be a list.")

        # Do not generate unsupported answers without context.
        if not context.strip():
            return {
                "answer": (
                    "I couldn't find relevant information in the "
                    "available academic documents to answer your "
                    "question. Please try another question or "
                    "upload the relevant study material."
                ),
                "model": self.model,
                "sources": [],
                "context_used": False
            }

        system_instruction = """
        You are NEXORA, an AI academic assistant for university students.

        Your task is to answer student questions using the academic
        document context provided to you.

        Follow these rules:

        1. Base your answers primarily on the supplied context.
        2. Do not invent facts or claim that unsupported information
           comes from university documents.
        3. If the context does not contain enough information,
           clearly acknowledge this limitation.
        4. Explain academic concepts clearly and accurately.
        5. Use an appropriate level of detail for university students.
        6. Organize longer answers using headings and bullet points
           when helpful.
        7. Include source references using the labels provided
           in the context, such as [Source 1].
        8. Never invent source numbers or document references.
        """

        prompt = f"""
        Student Question:
        {query}

        Academic Document Context:
        {context}

        Instructions:
        Answer the student's question using the academic context above.
        Include relevant source references in your answer.
        If the context is insufficient, explain what information
        is missing rather than guessing.
        """

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=self.temperature
            )
        )

        answer = response.text

        if not answer or not answer.strip():
            raise RuntimeError(
                "Gemini did not return a valid text response."
            )

        return {
            "answer": answer.strip(),
            "model": self.model,
            "sources": sources or [],
            "context_used": True
        }
