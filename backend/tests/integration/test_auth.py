from jose import jwt
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.connection import Base, get_db
from app.models import Document, Quiz, User
from app.core.config import settings


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_password_hashing():
    from app.core.security import hash_password, verify_password

    hashed = hash_password("SecurePass123")
    assert verify_password("SecurePass123", hashed)
    assert not verify_password("WrongPass123", hashed)

    expired_token = jwt.encode(
        {
            "sub": "1",
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        settings.secret_key,
        algorithm="HS256",
    )
    expired = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert expired.status_code == 401


def test_registration_duplicate_login_me_and_role_restriction():
    staff_self_registration = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Unauthorized Staff",
            "email": "staff@example.com",
            "password": "SecurePass123",
            "role": "academic_staff",
        },
    )
    assert staff_self_registration.status_code == 403

    administrator_self_registration = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Unauthorized Admin",
            "email": "admin@example.com",
            "password": "SecurePass123",
            "role": "administrator",
        },
    )
    assert administrator_self_registration.status_code == 403

    registration = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test Student",
            "email": "Student@Example.com",
            "password": "SecurePass123",
            "role": "student",
        },
    )
    assert registration.status_code == 201
    registered = registration.json()
    assert registered["role"] == "student"
    assert "hashed_password" not in registered
    assert "password" not in registered

    duplicate_role_escalation = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Changed Existing Student",
            "email": "student@example.com",
            "password": "DifferentPass123",
            "role": "academic_staff",
        },
    )
    assert duplicate_role_escalation.status_code == 403

    db = TestingSessionLocal()
    existing_student = db.query(User).filter_by(
        email="student@example.com"
    ).one()
    assert existing_student.full_name == "Test Student"
    assert existing_student.role == "student"
    assert db.query(User).filter_by(email="staff@example.com").first() is None
    assert db.query(User).filter_by(email="admin@example.com").first() is None
    db.close()

    duplicate = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Other Student",
            "email": "student@example.com",
            "password": "SecurePass123",
        },
    )
    assert duplicate.status_code == 409

    wrong = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "WrongPass123"},
    )
    assert wrong.status_code == 401

    login = client.post(
        "/api/v1/auth/login",
        json={"email": "STUDENT@EXAMPLE.COM", "password": "SecurePass123"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me.status_code == 200
    assert me.json()["email"] == "student@example.com"

    forbidden_upload = client.post(
        "/api/v1/documents/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("sample.pdf", b"%PDF-1.4", "application/pdf")},
    )
    assert forbidden_upload.status_code == 403

    invalid = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid.token.value"},
    )
    assert invalid.status_code == 401


def test_inactive_account_rejected():
    db = TestingSessionLocal()
    user = db.query(User).filter(User.email == "student@example.com").first()
    user.is_active = False
    db.commit()
    db.close()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "SecurePass123"},
    )
    assert response.status_code == 403


def test_role_logins_and_administrator_authorization():
    from app.core.security import hash_password

    db = TestingSessionLocal()
    for email, full_name, role, is_active in (
        ("role.student@example.com", "Role Student", "student", True),
        ("staff.login@example.com", "Login Staff", "academic_staff", True),
        ("admin.login@example.com", "Login Admin", "administrator", True),
        ("inactive.admin@example.com", "Inactive Admin", "administrator", False),
    ):
        existing = db.query(User).filter(User.email == email).first()
        if existing is None:
            db.add(
                User(
                    full_name=full_name,
                    email=email,
                    hashed_password=hash_password("SecurePass123"),
                    role=role,
                    is_active=is_active,
                )
            )
    db.commit()
    db.close()

    staff_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "staff.login@example.com",
            "password": "SecurePass123",
        },
    )
    assert staff_login.status_code == 200
    assert staff_login.json()["user"]["role"] == "academic_staff"

    admin_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "admin.login@example.com",
            "password": "SecurePass123",
        },
    )
    assert admin_login.status_code == 200
    assert admin_login.json()["user"]["role"] == "administrator"
    admin_token = admin_login.json()["access_token"]

    invalid_admin = client.post(
        "/api/v1/auth/login",
        json={
            "email": "admin.login@example.com",
            "password": "WrongPass123",
        },
    )
    assert invalid_admin.status_code == 401

    inactive_admin = client.post(
        "/api/v1/auth/login",
        json={
            "email": "inactive.admin@example.com",
            "password": "SecurePass123",
        },
    )
    assert inactive_admin.status_code == 403

    student_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "role.student@example.com",
            "password": "SecurePass123",
        },
    )
    assert student_login.status_code == 200
    assert student_login.json()["user"]["role"] == "student"
    student_token = student_login.json()["access_token"]

    student_delete = client.delete(
        "/api/v1/documents/999999",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert student_delete.status_code == 403

    staff_delete = client.delete(
        "/api/v1/documents/999999",
        headers={"Authorization": f"Bearer {staff_login.json()['access_token']}"},
    )
    assert staff_delete.status_code == 403

    admin_delete = client.delete(
        "/api/v1/documents/999999",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert admin_delete.status_code == 404


def test_administrator_dashboard_summary_access_and_counts():
    from app.core.security import hash_password

    db = TestingSessionLocal()

    role_accounts = (
        ("dashboard.student@example.com", "Dashboard Student", "student"),
        ("dashboard.staff@example.com", "Dashboard Staff", "academic_staff"),
        ("dashboard.admin@example.com", "Dashboard Admin", "administrator"),
    )
    for email, full_name, role in role_accounts:
        existing = db.query(User).filter(User.email == email).first()
        if existing is None:
            db.add(
                User(
                    full_name=full_name,
                    email=email,
                    hashed_password=hash_password("SecurePass123"),
                    role=role,
                    is_active=True,
                )
            )

    db.commit()

    for filename in ("dashboard-one.pdf", "dashboard-two.pdf"):
        if db.query(Document).filter(Document.filename == filename).first() is None:
            db.add(
                Document(
                    filename=filename,
                    file_path=f"/tmp/{filename}",
                    status="processed",
                )
            )

    for quiz_code, title in (
        ("DASHBOARD-QUIZ-1", "Dashboard Quiz 1"),
        ("DASHBOARD-QUIZ-2", "Dashboard Quiz 2"),
    ):
        if db.query(Quiz).filter(Quiz.quiz_code == quiz_code).first() is None:
            db.add(
                Quiz(
                    quiz_code=quiz_code,
                    title=title,
                    description="Dashboard test quiz",
                    subject="Testing",
                    difficulty="Intermediate",
                    duration=30,
                    max_attempts=1,
                    status="Published",
                )
            )

    db.commit()

    expected = {
        "total_registered_users": db.query(User).count(),
        "total_students": db.query(User).filter(User.role == "student").count(),
        "total_academic_staff": db.query(
            User
        ).filter(User.role == "academic_staff").count(),
        "total_administrators": db.query(
            User
        ).filter(User.role == "administrator").count(),
        "total_uploaded_documents": db.query(Document).count(),
        "total_quizzes": db.query(Quiz).count(),
    }
    db.close()

    student_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "dashboard.student@example.com",
            "password": "SecurePass123",
        },
    )
    assert student_login.status_code == 200

    student_denied = client.get(
        "/api/v1/admin/dashboard/summary",
        headers={
            "Authorization": f"Bearer {student_login.json()['access_token']}"
        },
    )
    assert student_denied.status_code == 403

    staff_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "dashboard.staff@example.com",
            "password": "SecurePass123",
        },
    )
    assert staff_login.status_code == 200

    staff_denied = client.get(
        "/api/v1/admin/dashboard/summary",
        headers={
            "Authorization": f"Bearer {staff_login.json()['access_token']}"
        },
    )
    assert staff_denied.status_code == 403

    admin_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "dashboard.admin@example.com",
            "password": "SecurePass123",
        },
    )
    assert admin_login.status_code == 200

    administrator_response = client.get(
        "/api/v1/admin/dashboard/summary",
        headers={
            "Authorization": f"Bearer {admin_login.json()['access_token']}"
        },
    )
    assert administrator_response.status_code == 200
    assert administrator_response.json() == expected


def test_administrator_users_access_and_database_results():
    from app.core.security import hash_password

    db = TestingSessionLocal()
    role_accounts = (
        ("users.student@example.com", "Users Student", "student"),
        ("users.staff@example.com", "Users Staff", "academic_staff"),
        ("users.admin@example.com", "Users Admin", "administrator"),
    )
    for email, full_name, role in role_accounts:
        existing = db.query(User).filter(User.email == email).first()
        if existing is None:
            db.add(
                User(
                    full_name=full_name,
                    email=email,
                    hashed_password=hash_password("SecurePass123"),
                    role=role,
                    is_active=True,
                )
            )
    db.commit()

    expected_users = [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at.isoformat(),
        }
        for user in db.query(User).order_by(User.id).all()
    ]
    db.close()

    student_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "users.student@example.com",
            "password": "SecurePass123",
        },
    )
    assert student_login.status_code == 200

    student_response = client.get(
        "/api/v1/admin/users",
        headers={
            "Authorization": f"Bearer {student_login.json()['access_token']}"
        },
    )
    assert student_response.status_code == 403

    staff_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "users.staff@example.com",
            "password": "SecurePass123",
        },
    )
    assert staff_login.status_code == 200

    staff_response = client.get(
        "/api/v1/admin/users",
        headers={
            "Authorization": f"Bearer {staff_login.json()['access_token']}"
        },
    )
    assert staff_response.status_code == 403

    admin_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "users.admin@example.com",
            "password": "SecurePass123",
        },
    )
    assert admin_login.status_code == 200

    admin_response = client.get(
        "/api/v1/admin/users",
        headers={
            "Authorization": f"Bearer {admin_login.json()['access_token']}"
        },
    )
    assert admin_response.status_code == 200

    returned_users = admin_response.json()
    assert returned_users == expected_users
    assert all("password" not in user for user in returned_users)
    assert all("hashed_password" not in user for user in returned_users)
