# app/auth.py
from __future__ import annotations
import datetime
from flask import Blueprint, request, jsonify, current_app, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mailman import EmailMultiAlternatives
from werkzeug.security import generate_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from .extensions import db
from .models import User, Department, Activity

auth_bp = Blueprint("auth", __name__)


# ==========================
# Helpers for reset tokens
# ==========================
def generate_reset_token(email: str) -> str:
    """Generate a secure password reset token for an email"""
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return s.dumps(email, salt="reset-salt")


def verify_reset_token(token: str, max_age: int = 3600) -> str | None:
    """Verify a reset token and return the email if valid"""
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        email = s.loads(token, salt="reset-salt", max_age=max_age)
    except (SignatureExpired, BadSignature):
        return None
    return email


# ==========================
# Register
# ==========================
@auth_bp.post("/register")
def register():
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "student").strip().lower()
    department_id = data.get("department_id")

    if not all([name, email, password]):
        return jsonify(error="name, email, password required"), 400
    if role not in ("admin", "hod", "lecturer", "student"):
        return jsonify(error="invalid role"), 400
    if User.query.filter_by(email=email).first():
        return jsonify(error="email already exists"), 409

    u = User(name=name, email=email, role=role)
    u.set_password(password)

    # Special handling for HOD creation
    if role == "hod":
        if department_id is None:
            return jsonify(error="department_id required for HOD creation"), 400
        try:
            department_id = int(department_id)
        except (TypeError, ValueError):
            return jsonify(error="department_id must be integer"), 400

        dept = Department.query.get(department_id)
        if not dept:
            return jsonify(error="department not found"), 404
        if dept.hod_user_id:
            return jsonify(error="department already has a HoD"), 409

        u.department_id = dept.id
        db.session.add(u)
        db.session.flush()
        dept.hod_user_id = u.id
        db.session.add(dept)
        db.session.commit()

        return jsonify(message="HoD created and assigned to department.", user=u.to_dict()), 201

    # Other roles: optional department assignment
    if department_id is not None:
        try:
            department_id = int(department_id)
        except (TypeError, ValueError):
            return jsonify(error="department_id must be integer"), 400
        if not Department.query.get(department_id):
            return jsonify(error="department not found"), 404
        u.department_id = department_id

    db.session.add(u)
    db.session.commit()

    return jsonify(message="Account created successfully.", user=u.to_dict()), 201


# ==========================
# Login
# ==========================
@auth_bp.post("/login")
def login():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify(error="invalid email or password"), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    return jsonify(access_token=access_token, user=user.to_dict()), 200


# ==========================
# Current User (/me)
# ==========================
@auth_bp.get("/me")
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(int(uid))
    if not user:
        return jsonify(error="user not found"), 404
    return jsonify(user=user.to_dict()), 200


# ==========================
# Forgot Password
# ==========================
@auth_bp.post("/forgot")
def forgot_password():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()

    if not email:
        return jsonify(error="email required"), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        # Don’t reveal account existence
        return jsonify(message="If this account exists, a reset link was sent.")

    token = generate_reset_token(user.email)
    reset_url = url_for("auth.reset_password", _external=True) + f"?token={token}"

    # HTML template
    html_template = f"""
    <div style="font-family:Arial,sans-serif; background:#f9fafb; padding:20px;">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;padding:30px;
                  box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color:#16a34a; text-align:center;">Password Reset Request</h2>
        <p>Hello <b>{user.name}</b>,</p>
        <p>We received a request to reset your password for your GAU account.</p>
        <p style="text-align:center; margin:20px 0;">
          <a href="{reset_url}" 
             style="background:#16a34a;color:#ffffff;padding:12px 25px;border-radius:5px;
                    text-decoration:none;font-weight:bold;display:inline-block;">
            Reset Password
          </a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />
        <p style="font-size:12px; color:#6b7280; text-align:center;">
          © {datetime.datetime.utcnow().year} Garissa University System. All rights reserved.
        </p>
      </div>
    </div>
    """

    # Send email (plain + HTML)
    msg = EmailMultiAlternatives(
        subject="Password Reset Request",
        body=f"Reset your password here: {reset_url}",  # plain fallback
        from_email="no-reply@gau.ac.ke",
        to=[user.email],
    )
    msg.attach_alternative(html_template, "text/html")
    msg.send()

    return jsonify(message="If this account exists, a reset link was sent.")


# ==========================
# Reset Password
# ==========================
@auth_bp.post("/reset")
def reset_password():
    data = request.get_json(force=True) or {}
    token = data.get("token")
    new_password = data.get("password")

    if not token or not new_password:
        return jsonify(error="token and password required"), 400

    email = verify_reset_token(token)
    if not email:
        return jsonify(error="invalid or expired token"), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(error="user not found"), 404

    user._password_hash = generate_password_hash(new_password)
    db.session.commit()

    # Optional: log activity
    act = Activity(
        kind="success",
        title="Password Reset",
        actor=user.email,
        action=f"User {user.email} reset their password.",
        meta_json={"user_id": user.id},
    )
    db.session.add(act)
    db.session.commit()

    return jsonify(message="Password reset successful. You can now log in.")
