from sqlalchemy.orm import Session

from app.models import CourseEnrollment


class EnrollmentRepository:

    @staticmethod
    def enroll(
        db: Session,
        student_id: int,
        course_id: int
    ) -> CourseEnrollment | None:

        existing = db.query(CourseEnrollment).filter(
            CourseEnrollment.student_id == student_id,
            CourseEnrollment.course_id == course_id
        ).first()

        if existing:
            return existing

        enrollment = CourseEnrollment(
            student_id=student_id,
            course_id=course_id
        )

        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)

        return enrollment

    @staticmethod
    def get_by_student(
        db: Session,
        student_id: int
    ) -> list[CourseEnrollment]:

        return db.query(CourseEnrollment).filter(
            CourseEnrollment.student_id == student_id
        ).all()

    @staticmethod
    def get_by_course(
        db: Session,
        course_id: int
    ) -> list[CourseEnrollment]:

        return db.query(CourseEnrollment).filter(
            CourseEnrollment.course_id == course_id
        ).all()

    @staticmethod
    def is_enrolled(
        db: Session,
        student_id: int,
        course_id: int
    ) -> bool:

        return db.query(CourseEnrollment).filter(
            CourseEnrollment.student_id == student_id,
            CourseEnrollment.course_id == course_id
        ).first() is not None

    @staticmethod
    def unenroll(
        db: Session,
        student_id: int,
        course_id: int
    ) -> bool:

        enrollment = db.query(CourseEnrollment).filter(
            CourseEnrollment.student_id == student_id,
            CourseEnrollment.course_id == course_id
        ).first()

        if enrollment is None:
            return False

        db.delete(enrollment)
        db.commit()

        return True