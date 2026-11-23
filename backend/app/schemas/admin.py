from datetime import datetime

from pydantic import BaseModel


class AdminDashboardSummary(BaseModel):
    total_registered_users: int
    total_students: int
    total_academic_staff: int
    total_administrators: int
    total_uploaded_documents: int
    total_quizzes: int


class AdminUserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    created_at: datetime
