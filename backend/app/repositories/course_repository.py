from sqlalchemy.orm import Session

from app.models import Course


class CourseRepository:

    @staticmethod
    def create(
        db: Session,
        course_code: str,
        course_name: str,
        description: str | None = None
    ) -> Course:
        course = Course(
            course_code=course_code.upper().strip(),
            course_name=course_name.strip(),
            description=description
        )

        db.add(course)
        db.commit()
        db.refresh(course)

        return course

    @staticmethod
    def get_by_id(db: Session, course_id: int) -> Course | None:
        return db.query(Course).filter(
            Course.id == course_id
        ).first()

    @staticmethod
    def get_by_code(db: Session, course_code: str) -> Course | None:
        return db.query(Course).filter(
            Course.course_code == course_code.upper().strip()
        ).first()

    @staticmethod
    def get_all(db: Session) -> list[Course]:
        return db.query(Course).order_by(Course.course_code).all()

    @staticmethod
    def update(db: Session, course: Course, **kwargs) -> Course:
        for key, value in kwargs.items():
            if hasattr(course, key) and key not in {"id"}:
                setattr(course, key, value)

        db.commit()
        db.refresh(course)
        return course

    @staticmethod
    def delete(db: Session, course_id: int) -> bool:
        course = CourseRepository.get_by_id(db, course_id)

        if course is None:
            return False

        db.delete(course)
        db.commit()
        return True