# app/hod.py
from __future__ import annotations

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from .decorators import role_required
from .extensions import db
from .models import User, Department

hod_bp = Blueprint("hod", __name__)

@hod_bp.post("/lecturers")
@role_required("hod")  # Admin also allowed because allow_admin=True by default
def create_lecturer():
    """
    Create a lecturer with full name, email, password ONLY.
    The lecturer is automatically assigned to the HoD's department.
    """
    me = get_jwt_identity()

    # Find the department headed by this HoD
    dept = Department.query.filter_by(hod_user_id=me).first()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not all([name, email, password]):
        return jsonify(error="name, email, password required"), 400

    if User.query.filter_by(email=email).first():
        return jsonify(error="email already exists"), 409

    # Create lecturer and attach to HoD's department
    u = User(name=name, email=email, role="lecturer", department_id=dept.id)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()

    return jsonify(message="Lecturer created", user=u.to_dict()), 201
