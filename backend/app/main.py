from fastapi import FastAPI
from app.api.routes.health import router as health_router

app = FastAPI(
    title="NEXORA AI Academic Assistant",
    description="Backend API for the NEXORA University Academic Assistant",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {
        "message": "NEXORA AI Academic Assistant API is running"
    }

app.include_router(
    health_router,
    prefix="/api/v1",
)