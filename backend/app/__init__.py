# app/__init__.py
from __future__ import annotations
import os
from flask import Flask
from flask_cors import CORS
from .extensions import db, jwt 

# Optional migrate support if defined in extensions.py
try:
    from .extensions import migrate  # e.g., migrate = Migrate()
except Exception:  # pragma: no cover
    migrate = None

# --- Blueprints (auth is required, others optional) ---
from .auth import auth_bp

try:
    from .routes import api_bp  # general API routes
except Exception:  # pragma: no cover
    api_bp = None

try:
    from .hod import hod_bp     # HoD routes
except Exception:  # pragma: no cover
    hod_bp = None

try:
    from .lecturer import lecturer_bp  # Lecturer routes
except Exception:  # pragma: no cover
    lecturer_bp = None


def create_app():
    app = Flask(__name__)

    # -----------------------------
    # Config
    # -----------------------------
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI", "sqlite:///gau_gradeview.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = (
        os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", "False").lower() == "true"
    )

    # -----------------------------
    # Init extensions
    # -----------------------------
    db.init_app(app)
    jwt.init_app(app)
    if migrate is not None:
        migrate.init_app(app, db)

    # -----------------------------
    # CORS (Vite dev runs on :5173)
    # -----------------------------
    allowed_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")

    CORS(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    # -----------------------------
    # Register blueprints
    # -----------------------------
    # Auth endpoints -> /api/auth/*
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Lecturer endpoints -> /api/lecturer/*
    if lecturer_bp is not None:
        app.register_blueprint(lecturer_bp, url_prefix="/api/lecturer")

    # General API -> /api/*
    if api_bp is not None:
        app.register_blueprint(api_bp, url_prefix="/api")

    # HoD endpoints -> /api/hod/*
    if hod_bp is not None:
        app.register_blueprint(hod_bp, url_prefix="/api/hod")

    # -----------------------------
    # Health check
    # -----------------------------
    @app.get("/api/health")
    def health():
        return {"status": "ok"}, 200

    # -----------------------------
    # Create tables in development only
    # -----------------------------
    if os.getenv("FLASK_ENV", "development") == "development":
        with app.app_context():
            from . import models  # ensure models are registered
            db.create_all()

    return app
