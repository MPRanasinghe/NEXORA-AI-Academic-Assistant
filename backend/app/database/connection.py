from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

# Database Engine
engine = create_engine(
    settings.database_url,
    connect_args = {"check_same_thread": False}
)

# Database session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine   
)

# Base CLass for models
class Base(DeclarativeBase):
    pass


# Database Session Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()