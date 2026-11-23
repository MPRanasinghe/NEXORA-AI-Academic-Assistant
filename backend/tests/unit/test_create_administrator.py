from types import SimpleNamespace

from scripts import create_administrator


class StubSession:
    def __init__(self):
        self.closed = False

    def close(self):
        self.closed = True


def patch_prompts(monkeypatch, password="SecurePass123"):
    answers = iter(("Test Administrator", "administrator@example.com"))
    monkeypatch.setattr("builtins.input", lambda _prompt: next(answers))
    passwords = iter((password, password))
    monkeypatch.setattr(
        create_administrator,
        "getpass",
        lambda _prompt: next(passwords),
    )
    monkeypatch.setattr(
        create_administrator.settings,
        "database_url",
        "sqlite:///:memory:",
    )


def test_administrator_provisioning_refuses_existing_email(monkeypatch, capsys):
    patch_prompts(monkeypatch)
    session = StubSession()
    monkeypatch.setattr(create_administrator, "SessionLocal", lambda: session)
    monkeypatch.setattr(
        create_administrator.UserRepository,
        "get_by_email",
        lambda _db, _email: SimpleNamespace(role="student"),
    )
    monkeypatch.setattr(
        create_administrator.UserRepository,
        "create",
        lambda **_kwargs: (_ for _ in ()).throw(
            AssertionError("Existing account must not be changed.")
        ),
    )

    assert create_administrator.main() == 1
    assert "already exists" in capsys.readouterr().out
    assert session.closed


def test_administrator_provisioning_uses_admin_role(monkeypatch):
    patch_prompts(monkeypatch)
    session = StubSession()
    calls = {}
    monkeypatch.setattr(create_administrator, "SessionLocal", lambda: session)
    monkeypatch.setattr(
        create_administrator.UserRepository,
        "get_by_email",
        lambda _db, _email: None,
    )
    monkeypatch.setattr(
        create_administrator,
        "hash_password",
        lambda password: f"hashed:{password}",
    )

    def create_user(**kwargs):
        calls.update(kwargs)
        return SimpleNamespace(
            full_name=kwargs["full_name"],
            email=kwargs["email"],
        )

    monkeypatch.setattr(create_administrator.UserRepository, "create", create_user)

    assert create_administrator.main() == 0
    assert calls["role"] == "administrator"
    assert calls["hashed_password"] == "hashed:SecurePass123"
    assert session.closed


def test_administrator_provisioning_rejects_bad_password(monkeypatch):
    patch_prompts(monkeypatch, password="x" * 73)

    def unexpected_session():
        raise AssertionError("Invalid password must not open the database.")

    monkeypatch.setattr(create_administrator, "SessionLocal", unexpected_session)

    assert create_administrator.main() == 1
