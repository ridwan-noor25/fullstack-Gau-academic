# app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from .extensions import db, jwt
from .student import student_bp  # NEW


# Optional (only if you actually have a migrate object in extensions.py)
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


def create_app():
    app = Flask(__name__)

    # ----- Config -----
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "dev-jwt-secret"),
        SQLALCHEMY_DATABASE_URI=os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///gau_gradeview.db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        CORS_SUPPORTS_CREDENTIALS=True,
    )

    # ----- Extensions -----
    db.init_app(app)
    jwt.init_app(app)
    if migrate is not None:
        migrate.init_app(app, db)

    # ----- CORS (cover all /api/*, allow both 127.0.0.1 and localhost) -----
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        max_age=600,  # cache preflight for 10 minutes
    )

    # ----- Blueprints -----
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(lecturer_bp, url_prefix="/api/lecturer")
    app.register_blueprint(student_bp, url_prefix="/api/student")

    if api_bp is not None:
        app.register_blueprint(api_bp, url_prefix="/api")
    if hod_bp is not None:
        app.register_blueprint(hod_bp, url_prefix="/api/hod")

    # ----- Health -----
    @app.get("/api/health")
    def health():
        return {"status": "ok"}, 200

    # ----- Dev: create tables if not using migrations -----
    with app.app_context():
        from . import models  # ensure models are imported
        db.create_all()

    return app




















































