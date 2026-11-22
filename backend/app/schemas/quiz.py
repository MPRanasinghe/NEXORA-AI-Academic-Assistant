
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class QuizQuestionResponse(BaseModel):
    id: int
    question_code: str
    question_text: str
    options: list[str]
    order_index: int

    model_config = ConfigDict(from_attributes=True)


class QuizResponse(BaseModel):
    id: int
    quiz_code: str
    title: str
    description: str | None = None
    subject: str
    difficulty: str
    duration: int
    max_attempts: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QuizDetailResponse(QuizResponse):
    questions: list[QuizQuestionResponse] = []


class QuizQuestionCreate(BaseModel):
    question_code: str
    question_text: str
    options: list[str] = Field(min_length=2)
    correct_answer: int = Field(ge=0)
    explanation: str | None = None
    order_index: int = Field(ge=0)


class QuizCreate(BaseModel):
    quiz_code: str
    title: str
    description: str | None = None
    subject: str
    difficulty: str
    duration: int = Field(gt=0)
    max_attempts: int = Field(ge=1)
    status: str = "Draft"
    questions: list[QuizQuestionCreate] = Field(min_length=1)
