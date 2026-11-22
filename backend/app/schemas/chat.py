from pydantic import BaseModel, Field, field_validator


class ChatAskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Question cannot be empty.")
        return value


class ChatSource(BaseModel):
    title: str
    category: str = "Academic Document"
    relevance: float = Field(ge=0, le=100)


class ChatAskResponse(BaseModel):
    answer: str
    sources: list[ChatSource]
    context_used: bool
