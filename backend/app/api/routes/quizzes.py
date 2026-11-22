
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.database.connection import get_db
from app.models import Quiz, QuizQuestion
from app.schemas.quiz import QuizResponse, QuizDetailResponse

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


@router.get("/", response_model=list[QuizResponse])
def get_quizzes(db: Session = Depends(get_db)):
    return (
        db.query(Quiz)
        .filter(Quiz.status == "Published")
        .order_by(Quiz.id)
        .all()
    )


@router.get("/{quiz_code}", response_model=QuizDetailResponse)
def get_quiz(quiz_code: str, db: Session = Depends(get_db)):
    quiz = (
        db.query(Quiz)
        .options(selectinload(Quiz.questions))
        .filter(
            Quiz.quiz_code == quiz_code,
            Quiz.status == "Published"
        )
        .first()
    )

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )

    return quiz
