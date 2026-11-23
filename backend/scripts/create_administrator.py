import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


from getpass import getpass
from pathlib import Path

from pydantic import ValidationError
from sqlalchemy.engine import make_url
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.core.security import hash_password
from app.database.connection import SessionLocal
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserRegistration




def main() -> int:
    database_url = make_url(settings.database_url)
    if (
        database_url.drivername.startswith("sqlite")
        and database_url.database not in (None, ":memory:")
        and not Path(database_url.database).exists()
    ):
        print(
            "Configured SQLite database does not exist. "
            "Start the application once or configure the existing database."
        )
        return 1

    full_name = input("Administrator name: ").strip()
    email = input("Administrator email: ").strip()
    password = getpass("Password: ")
    confirmation = getpass("Confirm password: ")

    if password != confirmation:
        print("Passwords do not match.")
        return 1

    try:
        account = UserRegistration(
            full_name=full_name,
            email=email,
            password=password,
            role="administrator",
        )
    except ValidationError:
        print(
            "Name, email, or password is invalid. Passwords must be at "
            "least 8 characters and no more than 72 UTF-8 bytes."
        )
        return 1

    db = SessionLocal()
    try:
        if UserRepository.get_by_email(db, str(account.email)) is not None:
            print("An account with that email already exists; no changes made.")
            return 1

        try:
            user = UserRepository.create(
                db=db,
                full_name=account.full_name,
                email=str(account.email),
                hashed_password=hash_password(account.password),
                role="administrator",
            )
        except IntegrityError:
            db.rollback()
            print("An account with that email already exists; no changes made.")
            return 1

        print(
            f"Created administrator account for {user.full_name} "
            f"({user.email})."
        )
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("\nAdministrator account provisioning cancelled.")
        raise SystemExit(1) from None
