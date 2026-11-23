from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.routes.auth import require_roles
from app.database.connection import get_db
from app.models import Document, Quiz, User
from app.schemas.admin import AdminDashboardSummary, AdminUserResponse
from app.repositories.user_repository import UserRepository


router = APIRouter(
    prefix="/admin",
    tags=["Administrator"],
)


@router.get(
    "/dashboard/summary",
    response_model=AdminDashboardSummary,
)
def get_admin_dashboard_summary(
    db: Session = Depends(get_db),
    _user=Depends(require_roles("administrator")),
):
    return AdminDashboardSummary(
        total_registered_users=db.query(User).count(),
        total_students=db.query(User).filter(User.role == "student").count(),
        total_academic_staff=db.query(
            User
        ).filter(User.role == "academic_staff").count(),
        total_administrators=db.query(
            User
        ).filter(User.role == "administrator").count(),
        total_uploaded_documents=db.query(Document).count(),
        total_quizzes=db.query(Quiz).count(),
    )


@router.get(
    "/users",
    response_model=list[AdminUserResponse],
)
def get_admin_users(
    db: Session = Depends(get_db),
    _user=Depends(require_roles("administrator")),
):
    return UserRepository.get_all(db)
