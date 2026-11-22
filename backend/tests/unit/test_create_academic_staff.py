from types import SimpleNamespace

from scripts import create_academic_staff


class StubSession:
    def __init__(self):
        self.closed = False

    def close(self):
        self.closed = True


def patch_prompts(monkeypatch, password="SecurePass123"):
    answers = iter(("Test Staff", "staff@example.com"))
    monkeypatch.setattr("builtins.input", lambda _prompt: next(answers))
    passwords = iter((password, password))
    monkeypatch.setattr(
        create_academic_staff,
        "getpass",
        lambda _prompt: next(passwords),
    )
    monkeypatch.setattr(
        create_academic_staff.settings,
        "database_url",
        "sqlite:///:memory:",
    )


def test_staff_provisioning_refuses_existing_email_without_modifying_it(
    monkeypatch,
    capsys,
):
    patch_prompts(monkeypatch)
    session = StubSession()
    monkeypatch.setattr(
        create_academic_staff,
        "SessionLocal",
        lambda: session,
    )
    monkeypatch.setattr(
        create_academic_staff.UserRepository,
        "get_by_email",
        lambda _db, _email: SimpleNamespace(
            full_name="Existing User",
            role="student",
        ),
    )
    monkeypatch.setattr(
        create_academic_staff.UserRepository,
        "create",
        lambda **_kwargs: (_ for _ in ()).throw(
            AssertionError("Existing account must not be changed.")
        ),
    )

    assert create_academic_staff.main() == 1
    assert "already exists" in capsys.readouterr().out
    assert session.closed


def test_staff_provisioning_uses_secure_password_and_staff_role(monkeypatch):
    patch_prompts(monkeypatch)
    session = StubSession()
    calls = {}
    monkeypatch.setattr(
        create_academic_staff,
        "SessionLocal",
        lambda: session,
    )
    monkeypatch.setattr(
        create_academic_staff.UserRepository,
        "get_by_email",
        lambda _db, _email: None,
    )
    monkeypatch.setattr(
        create_academic_staff,
        "hash_password",
        lambda password: f"hashed:{password}",
    )

    def create_user(**kwargs):
        calls.update(kwargs)
        return SimpleNamespace(
            full_name=kwargs["full_name"],
            email=kwargs["email"],
        )

    monkeypatch.setattr(
        create_academic_staff.UserRepository,
        "create",
        create_user,
    )

    assert create_academic_staff.main() == 0
    assert calls["role"] == "academic_staff"
    assert calls["hashed_password"] == "hashed:SecurePass123"
    assert session.closed


def test_staff_provisioning_rejects_password_that_exceeds_existing_limit(
    monkeypatch,
):
    patch_prompts(monkeypatch, password="x" * 73)

    def unexpected_session():
        raise AssertionError("Invalid password must not open the database.")

    monkeypatch.setattr(
        create_academic_staff,
        "SessionLocal",
        unexpected_session,
    )

    assert create_academic_staff.main() == 1
