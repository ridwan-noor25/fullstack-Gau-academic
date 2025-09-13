# # app/routes/units.py
# from flask import Blueprint, jsonify, request
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from sqlalchemy import select, or_, func
# from ..extensions import db
# from ..models import User, Unit, Enrollment

# units_bp = Blueprint("units", __name__, url_prefix="/api")

# def _get_current_user():
#     identity = get_jwt_identity()
#     if identity is None:
#         return None
#     u = None
#     if isinstance(identity, int) or (isinstance(identity, str) and identity.isdigit()):
#         u = db.session.get(User, int(identity))
#     if u is None and isinstance(identity, str):
#         u = db.session.scalar(select(User).where(User.email == identity.lower()))
#     return u

# @units_bp.get("/student/units")
# @jwt_required()
# def student_units():
#     """
#     Returns the logged-in student's enrolled units:
#     [{id, code, title}]
#     """
#     user = _get_current_user()
#     if not user:
#         return jsonify({"error": "Unauthorized"}), 401
#     if user.role != "student":
#         return jsonify({"error": "Only students can access this endpoint"}), 403

#     q = (
#         db.session.execute(
#             select(Unit.id, Unit.code, Unit.title)
#             .join(Enrollment, Enrollment.unit_id == Unit.id)
#             .where(Enrollment.student_id == user.id)
#             .order_by(func.lower(Unit.code))
#         )
#         .all()
#     )

#     items = [{"id": rid, "code": code or "", "title": title or ""} for (rid, code, title) in q]
#     return jsonify(items)  # simple array works with your frontend normalizer

# @units_bp.get("/units/lookup")
# @jwt_required()
# def lookup_unit_by_code():
#     """
#     Resolve a unit by code (case-insensitive).
#     GET /api/units/lookup?code=CHE%20211
#     Returns {id, code, title} or 404.
#     """
#     code = (request.args.get("code") or "").strip()
#     if not code:
#         return jsonify({"error": "code is required"}), 400

#     unit = db.session.scalar(
#         select(Unit).where(func.lower(Unit.code) == code.lower()).limit(1)
#     )
#     if not unit:
#         return jsonify({"error": "Unit not found"}), 404

#     return jsonify({"id": unit.id, "code": unit.code, "title": unit.title})



# app/units_api.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, func
from .extensions import db
from .models import User, Unit, Enrollment

units_bp = Blueprint("units", __name__, url_prefix="/api")

def _get_current_user():
    identity = get_jwt_identity()
    if identity is None:
        return None
    u = None
    if isinstance(identity, int) or (isinstance(identity, str) and identity.isdigit()):
        u = db.session.get(User, int(identity))
    if u is None and isinstance(identity, str):
        u = db.session.scalar(select(User).where(User.email == identity.lower()))
    return u

@units_bp.get("/student/units")
@jwt_required()
def student_units():
    """Return the logged-in student's enrolled units: [{id, code, title}]"""
    user = _get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "student":
        return jsonify({"error": "Only students can access this endpoint"}), 403

    rows = db.session.execute(
        select(Unit.id, Unit.code, Unit.title)
        .join(Enrollment, Enrollment.unit_id == Unit.id)
        .where(Enrollment.student_id == user.id)
        .order_by(func.lower(Unit.code))
    ).all()

    items = [{"id": rid, "code": code or "", "title": title or ""} for (rid, code, title) in rows]
    return jsonify(items)

@units_bp.get("/units/lookup")
@jwt_required()
def lookup_unit_by_code():
    """Resolve a unit by code (case-insensitive). /api/units/lookup?code=CHE%20211"""
    code = (request.args.get("code") or "").strip()
    if not code:
        return jsonify({"error": "code is required"}), 400

    unit = db.session.scalar(
        select(Unit).where(func.lower(Unit.code) == code.lower()).limit(1)
    )
    if not unit:
        return jsonify({"error": "Unit not found"}), 404

    return jsonify({"id": unit.id, "code": unit.code, "title": unit.title})
