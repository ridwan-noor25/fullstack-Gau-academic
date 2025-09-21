# # app/__init__.py
# import os
# from flask import Flask
# from flask_cors import CORS
# from .extensions import db, jwt
# from .student import student_bp  # NEW


# # Optional (only if you actually have a migrate object in extensions.py)
# try:
#     from .extensions import migrate
# except Exception:
#     migrate = None

# # Blueprints
# from .auth import auth_bp
# from .lecturer import lecturer_bp
# try:
#     from .routes import api_bp
# except Exception:
#     api_bp = None
# try:
#     from .hod import hod_bp
# except Exception:
#     hod_bp = None


# def create_app():
#     app = Flask(__name__)

#     # ----- Config -----
#     app.config.update(
#         SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret"),
#         JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "dev-jwt-secret"),
#         SQLALCHEMY_DATABASE_URI=os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///gau_gradeview.db"),
#         SQLALCHEMY_TRACK_MODIFICATIONS=False,
#         CORS_SUPPORTS_CREDENTIALS=True,
#     )

#     # ----- Extensions -----
#     db.init_app(app)
#     jwt.init_app(app)
#     if migrate is not None:
#         migrate.init_app(app, db)

#     # ----- CORS (cover all /api/*, allow both 127.0.0.1 and localhost) -----
#     CORS(
#         app,
#         resources={r"/api/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}},
#         supports_credentials=True,
#         allow_headers=["Content-Type", "Authorization"],
#         expose_headers=["Authorization"],
#         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
#         max_age=600,  # cache preflight for 10 minutes
#     )

#     # ----- Blueprints -----
#     app.register_blueprint(auth_bp, url_prefix="/api/auth")
#     app.register_blueprint(lecturer_bp, url_prefix="/api/lecturer")
#     app.register_blueprint(student_bp, url_prefix="/api/student")

#     if api_bp is not None:
#         app.register_blueprint(api_bp, url_prefix="/api")
#     if hod_bp is not None:
#         app.register_blueprint(hod_bp, url_prefix="/api/hod")

#     # ----- Health -----
#     @app.get("/api/health")
#     def health():
#         return {"status": "ok"}, 200

#     # ----- Dev: create tables if not using migrations -----
#     with app.app_context():
#         from . import models  # ensure models are imported
#         db.create_all()

#     return app





# # app/__init__.py
# import os
# from flask import Flask
# from flask_cors import CORS
# from .extensions import db, jwt
# from .student import student_bp  # NEW
# from .hod_students import hod_students_bp

# # Optional migrate
# try:
#     from .extensions import migrate
# except Exception:
#     migrate = None

# # Blueprints
# from .auth import auth_bp
# from .lecturer import lecturer_bp
# try:
#     from .routes import api_bp  # <-- this is your existing routes.py module (keep if you use it)
# except Exception:
#     api_bp = None
# try:
#     from .hod import hod_bp
# except Exception:
#     hod_bp = None

# # 👉 REPLACE the broken imports with these:
# from .units_api import units_bp        # ✅ Student units + unit lookup
# from .reports_api import reports_bp    # ✅ Missing mark reports

# def create_app():
#     app = Flask(__name__)

#     # ----- Config -----
#     app.config.update(
#         SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret"),
#         JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "dev-jwt-secret"),
#         SQLALCHEMY_DATABASE_URI=os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///gau_gradeview.db"),
#         SQLALCHEMY_TRACK_MODIFICATIONS=False,
#         CORS_SUPPORTS_CREDENTIALS=True,
#     )

#     # ----- Extensions -----
#     db.init_app(app)
#     jwt.init_app(app)
#     if migrate is not None:
#         migrate.init_app(app, db)

#     # ----- CORS -----
#     CORS(
#         app,
#         resources={r"/api/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}},
#         supports_credentials=True,
#         allow_headers=["Content-Type", "Authorization"],
#         expose_headers=["Authorization"],
#         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
#         max_age=600,
#     )

#     # ----- Blueprints -----
#     app.register_blueprint(auth_bp, url_prefix="/api/auth")
#     app.register_blueprint(lecturer_bp, url_prefix="/api/lecturer")
#     app.register_blueprint(student_bp, url_prefix="/api/student")

#     if api_bp is not None:
#         app.register_blueprint(api_bp, url_prefix="/api")
#     if hod_bp is not None:
#         app.register_blueprint(hod_bp, url_prefix="/api/hod")

#     # 👉 NEW: register our API blueprints (no url_prefix override; they define their own)
#     app.register_blueprint(units_bp)      # /api/student/units, /api/units/lookup
#     app.register_blueprint(reports_bp)    # /api/reports/missing
#     app.register_blueprint(hod_students_bp)

#     # ----- Health -----
#     @app.get("/api/health")
#     def health():
#         return {"status": "ok"}, 200

#     # ----- Dev: create tables if not using migrations -----
#     with app.app_context():
#         from . import models  # ensure models are imported
#         db.create_all()

#     return app



# import os
# from flask import Flask
# from flask_cors import CORS
# from .extensions import db, jwt, mail
# from .student import student_bp
# from .hod_students import hod_students_bp

# # Optional migrate
# try:
#     from .extensions import migrate
# except Exception:
#     migrate = None

# # Blueprints
# from .auth import auth_bp
# from .lecturer import lecturer_bp
# try:
#     from .routes import api_bp
# except Exception:
#     api_bp = None
# try:
#     from .hod import hod_bp
# except Exception:
#     hod_bp = None

# from .units_api import units_bp
# from .reports_api import reports_bp

# def create_app():
#     app = Flask(__name__)

#     # ----- Config -----
#     app.config.update(
#         SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret"),
#         JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "dev-jwt-secret"),
#         SQLALCHEMY_DATABASE_URI=os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///gau_gradeview.db"),
#         SQLALCHEMY_TRACK_MODIFICATIONS=False,
#         CORS_SUPPORTS_CREDENTIALS=True,

#         # ✅ Mail Config (use env vars in production)
#         MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
#         MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
#         MAIL_USE_TLS=True,
#         MAIL_USERNAME=os.getenv("MAIL_USERNAME", "your.email@gmail.com"),
#         MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "your-app-password"),
#         MAIL_DEFAULT_SENDER=(os.getenv("MAIL_SENDER_NAME", "GAU System"),
#                              os.getenv("MAIL_SENDER_EMAIL", "your.email@gmail.com")),
#     )

#     # ----- Extensions -----
#     db.init_app(app)
#     jwt.init_app(app)
#     mail.init_app(app)  # ✅ Added
#     if migrate is not None:
#         migrate.init_app(app, db)

#     # ----- CORS -----
#     CORS(
#         app,
#         resources={r"/api/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}},
#         supports_credentials=True,
#         allow_headers=["Content-Type", "Authorization"],
#         expose_headers=["Authorization"],
#         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
#         max_age=600,
#     )

#     # ----- Blueprints -----
#     app.register_blueprint(auth_bp, url_prefix="/api/auth")
#     app.register_blueprint(lecturer_bp, url_prefix="/api/lecturer")
#     app.register_blueprint(student_bp, url_prefix="/api/student")

#     if api_bp is not None:
#         app.register_blueprint(api_bp, url_prefix="/api")
#     if hod_bp is not None:
#         app.register_blueprint(hod_bp, url_prefix="/api/hod")

#     app.register_blueprint(units_bp)
#     app.register_blueprint(reports_bp)
#     app.register_blueprint(hod_students_bp)

#     # ----- Health -----
#     @app.get("/api/health")
#     def health():
#         return {"status": "ok"}, 200

#     # ----- Dev: create tables if not using migrations -----
#     with app.app_context():
#         from . import models
#         db.create_all()

#     return app


# import os
# from flask import Flask
# from flask_cors import CORS
# from .extensions import db, jwt, mail
# from .student import student_bp
# from .hod_students import hod_students_bp

# # Optional migrate
# try:
#     from .extensions import migrate
# except Exception:
#     migrate = None

# # Blueprints
# from .auth import auth_bp
# from .lecturer import lecturer_bp
# try:
#     from .routes import api_bp
# except Exception:
#     api_bp = None
# try:
#     from .hod import hod_bp
# except Exception:
#     hod_bp = None

# from .units_api import units_bp
# from .reports_api import reports_bp

# # ✅ Import the admin blueprint
# try:
#     from .routes.admin import admin_bp
# except Exception:
#     admin_bp = None


# def create_app():
#     app = Flask(__name__)

#     # ----- Config -----
#     app.config.update(
#         SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret"),
#         JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "dev-jwt-secret"),
#         SQLALCHEMY_DATABASE_URI=os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///gau_gradeview.db"),
#         SQLALCHEMY_TRACK_MODIFICATIONS=False,
#         CORS_SUPPORTS_CREDENTIALS=True,

#         # ✅ Mail Config (use env vars in production)
#         MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
#         MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
#         MAIL_USE_TLS=True,
#         MAIL_USERNAME=os.getenv("MAIL_USERNAME", "your.email@gmail.com"),
#         MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "your-app-password"),
#         MAIL_DEFAULT_SENDER=(os.getenv("MAIL_SENDER_NAME", "GAU System"),
#                              os.getenv("MAIL_SENDER_EMAIL", "your.email@gmail.com")),
#     )

#     # ----- Extensions -----
#     db.init_app(app)
#     jwt.init_app(app)
#     mail.init_app(app)  # ✅ Added
#     if migrate is not None:
#         migrate.init_app(app, db)

#     # ----- CORS -----
#     CORS(
#         app,
#         resources={r"/api/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}},
#         supports_credentials=True,
#         allow_headers=["Content-Type", "Authorization"],
#         expose_headers=["Authorization"],
#         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
#         max_age=600,
#     )

#     # ----- Blueprints -----
#     app.register_blueprint(auth_bp, url_prefix="/api/auth")
#     app.register_blueprint(lecturer_bp, url_prefix="/api/lecturer")
#     app.register_blueprint(student_bp, url_prefix="/api/student")

#     if api_bp is not None:
#         app.register_blueprint(api_bp, url_prefix="/api")
#     if hod_bp is not None:
#         app.register_blueprint(hod_bp, url_prefix="/api/hod")

#     app.register_blueprint(units_bp)
#     app.register_blueprint(reports_bp)
#     app.register_blueprint(hod_students_bp)

#     # ✅ Register Admin blueprint
#     if admin_bp is not None:
#         app.register_blueprint(admin_bp)  # already has url_prefix="/api/admin"

#     # ----- Health -----
#     @app.get("/api/health")
#     def health():
#         return {"status": "ok"}, 200

#     # ----- Dev: create tables if not using migrations -----
#     with app.app_context():
#         from . import models
#         db.create_all()

#     return app


import os
from flask import Flask
from flask_cors import CORS
from .extensions import db, jwt, mail
from .student import student_bp
from .hod_students import hod_students_bp

# Optional migrate
try:
    from .extensions import migrate
except Exception:
    migrate = None

# Blueprints
from .auth import auth_bp
from .lecturer import lecturer_bp
try:
    from .routes import api_bp
except Exception:
    api_bp = None
try:
    from .hod import hod_bp
except Exception:
    hod_bp = None

from .units_api import units_bp
from .reports_api import reports_bp

# ✅ Import admin blueprint directly from app/admin.py
try:
    from .admin import admin_bp
except Exception:
    admin_bp = None


def create_app():
    app = Flask(__name__)

    # ----- Config -----
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "dev-jwt-secret"),
        SQLALCHEMY_DATABASE_URI=os.getenv(
            "SQLALCHEMY_DATABASE_URI", "sqlite:///gau_gradeview.db"
        ),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        CORS_SUPPORTS_CREDENTIALS=True,

        # ✅ Mail Config (use env vars in production)
        MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
        MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
        MAIL_USE_TLS=True,
        MAIL_USERNAME=os.getenv("MAIL_USERNAME", "your.email@gmail.com"),
        MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "your-app-password"),
        MAIL_DEFAULT_SENDER=(
            os.getenv("MAIL_SENDER_NAME", "GAU System"),
            os.getenv("MAIL_SENDER_EMAIL", "your.email@gmail.com"),
        ),
    )

    # ----- Extensions -----
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    if migrate is not None:
        migrate.init_app(app, db)

    # ----- CORS -----
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        max_age=600,
    )

    # ----- Blueprints -----
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(lecturer_bp, url_prefix="/api/lecturer")
    app.register_blueprint(student_bp, url_prefix="/api/student")

    if api_bp is not None:
        app.register_blueprint(api_bp, url_prefix="/api")
    if hod_bp is not None:
        app.register_blueprint(hod_bp, url_prefix="/api/hod")

    app.register_blueprint(units_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(hod_students_bp)

    # ✅ Register Admin blueprint (already has url_prefix="/api/admin")
    if admin_bp is not None:
        app.register_blueprint(admin_bp)

    # ----- Health -----
    @app.get("/api/health")
    def health():
        return {"status": "ok"}, 200

    # ----- Dev: auto-create tables -----
    with app.app_context():
        from . import models
        db.create_all()

    return app
