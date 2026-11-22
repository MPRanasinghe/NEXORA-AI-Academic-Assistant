from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.database.connection import Base, engine
from app.models import AcademicResource, Course, CourseEnrollment, Document, User, Quiz, QuizQuestion, QuizAttempt, QuizAttemptAnswer
from app.api.routes.documents import router as documents_router
from app.api.routes.quizzes import router as quizzes_router
from app.api.routes.auth import router as auth_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables when the application starts
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="NEXORA AI Academic Assistant",
    description="Backend API for the NEXORA University Academic Assistant",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.frontend_origins.split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "NEXORA AI Academic Assistant API is running"
    }


app.include_router(
    health_router,
    prefix="/api/v1"
)

app.include_router(
    documents_router,
    prefix="/api/v1"
)

app.include_router(
    quizzes_router,
    prefix="/api/v1"
)

app.include_router(
    auth_router,
    prefix="/api/v1"
)