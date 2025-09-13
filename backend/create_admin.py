# create_admin.py  (run from backend folder)
import os
from app import create_app
from app.extensions import db
from app.models import User

def main():
    app = create_app()
    with app.app_context():
        # Read from env if provided; otherwise prompt with sensible defaults
        email = (os.getenv("ADMIN_EMAIL") or input("Admin email [admin@gmail.com]: ") or "admin@gmail.com").strip().lower()
        name = (os.getenv("ADMIN_NAME") or input("Admin name [Admin]: ") or "Admin").strip()
        password = (os.getenv("ADMIN_PASSWORD") or input("Admin password [Admin#12345]: ") or "Admin#12345").strip()

        if not email or not name or not password:
            raise SystemExit("name, email, and password are required (non-empty).")

        u = User.query.filter_by(email=email).first()
        if u is None:
            u = User(name=name, email=email, role="admin")
            u.set_password(password)
            db.session.add(u)
            action = "created"
        else:
            # ensure role + password refreshed; keep existing name if blank input
            u.role = "admin"
            u.name = name or u.name
            u.set_password(password)
            action = "updated"

        db.session.commit()
        print(f"✅ Admin {action}: {email}")

if __name__ == "__main__":
    main()
