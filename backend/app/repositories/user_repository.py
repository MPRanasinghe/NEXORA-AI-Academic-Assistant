from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import User


class UserRepository:

    @staticmethod
    def create(
        db: Session,
        full_name: str,
        email: str,
        hashed_password: str,
        role: str
    ) -> User:

        user = User(
            full_name=full_name,
            email=email.lower().strip(),
            hashed_password=hashed_password,
            role=role
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        normalized_email = email.lower().strip()
        return db.query(User).filter(
            func.lower(User.email) == normalized_email
        ).first()

    @staticmethod
    def get_all(db: Session) -> list[User]:
        return db.query(User).order_by(User.id).all()

    @staticmethod
    def update(db: Session, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if hasattr(user, key) and key != "id":
                setattr(user, key, value)

        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def delete(db: Session, user_id: int) -> bool:
        user = UserRepository.get_by_id(db, user_id)

        if user is None:
            return False

        db.delete(user)
        db.commit()

        return True