from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.database.connection import Base, engine
from app.models import Document

from app.api.routes.documents import router as documents_router


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