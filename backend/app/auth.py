# # app/auth.py
# from __future__ import annotations
# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# from .extensions import db
# from .models import User

# auth_bp = Blueprint("auth", __name__)

# @auth_bp.post("/register")   # PUBLIC — no jwt_required here
# def register():
#     data = request.get_json(force=True) or {}
#     name = (data.get("name") or "").strip()
#     email = (data.get("email") or "").strip().lower()
#     password = data.get("password") or ""
#     role = (data.get("role") or "student").strip().lower()

#     if not all([name, email, password]):
#         return jsonify(error="name, email, password required"), 400
#     if role not in ("admin", "hod", "lecturer", "student"):
#         return jsonify(error="invalid role"), 400
#     if User.query.filter_by(email=email).first():
#         return jsonify(error="email already exists"), 409

#     u = User(name=name, email=email, role=role)
#     u.set_password(password)
#     db.session.add(u)
#     db.session.commit()

#     return jsonify(message="Account created successfully.", user=u.to_dict()), 201


# @auth_bp.post("/login")      # PUBLIC
# def login():
#     data = request.get_json(force=True) or {}
#     email = (data.get("email") or "").strip().lower()
#     password = data.get("password") or ""
#     user = User.query.filter_by(email=email).first()

#     if not user or not user.check_password(password):
#         return jsonify(error="invalid email or password"), 401

#     # Include role in JWT claims so @role_required works
#     access_token = create_access_token(identity=str(user.id),
#                                        additional_claims={"role": user.role})
#     return jsonify(access_token=access_token, user=user.to_dict()), 200


# @auth_bp.get("/me")          # PROTECTED
# @jwt_required()
# def me():
#     uid = get_jwt_identity()
#     user = User.query.get(uid)
#     if not user:
#         return jsonify(error="user not found"), 404
#     return jsonify(user=user.to_dict()), 200



from __future__ import annotations
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .extensions import db
from .models import User, Department

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")   # PUBLIC — no jwt_required here
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

    # Create user
    u = User(name=name, email=email, role=role)
    u.set_password(password)

    # If creating a HoD, require department and assign both ways
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

        # attach user to department, and mark user as HOD of that department
        u.department_id = dept.id
        db.session.add(u)
        db.session.flush()          # get u.id without committing

        dept.hod_user_id = u.id     # set HoD
        db.session.add(dept)
        db.session.commit()
        return jsonify(message="HoD created and assigned to department.", user=u.to_dict()), 201

    # Non-HoD users: optional department assignment
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


@auth_bp.post("/login")      # PUBLIC
def login():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify(error="invalid email or password"), 401

    # identity must be STRING to avoid 422 ("Subject must be a string")
    access_token = create_access_token(identity=str(user.id),
                                       additional_claims={"role": user.role})
    return jsonify(access_token=access_token, user=user.to_dict()), 200


@auth_bp.get("/me")          # PROTECTED
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(int(uid))
    if not user:
        return jsonify(error="user not found"), 404
    return jsonify(user=user.to_dict()), 200
