# # app/routes/reports.py
# from flask import Blueprint, jsonify, request
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from sqlalchemy import select, func
# from ..extensions import db
# from ..models import User, Unit, Enrollment, MissingMarkReport

# reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")

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

# @reports_bp.post("/missing")
# @jwt_required()
# def create_missing_mark_report():
#     """
#     Create a MissingMarkReport.
#     Accepts either:
#       - { unit_code: "CHE 211", description: "..." }
#       - { unit_id: 123,        description: "..." }
#     Validates the student is enrolled in the unit.
#     Returns: {id, ...}
#     """
#     user = _get_current_user()
#     if not user:
#         return jsonify({"error": "Unauthorized"}), 401
#     if user.role != "student":
#         return jsonify({"error": "Only students can report missing marks"}), 403

#     data = request.get_json(silent=True) or {}
#     description = (data.get("description") or "").strip()
#     unit_id = data.get("unit_id")
#     unit_code = (data.get("unit_code") or "").strip()

#     if not description:
#         return jsonify({"error": "description is required"}), 400

#     unit = None
#     # Resolve by code (preferred for your UI)
#     if unit_code:
#         unit = db.session.scalar(
#             select(Unit).where(func.lower(Unit.code) == unit_code.lower()).limit(1)
#         )
#         if unit:
#             unit_id = unit.id

#     # Or by id
#     if not unit and unit_id:
#         unit = db.session.get(Unit, int(unit_id))

#     if not unit:
#         return jsonify({"error": "Unit not found"}), 404

#     # Ensure student is enrolled in this unit
#     enrolled = db.session.scalar(
#         select(Enrollment.id).where(
#             Enrollment.student_id == user.id,
#             Enrollment.unit_id == unit.id,
#         ).limit(1)
#     )
#     if not enrolled:
#         return jsonify({"error": "You are not enrolled in this unit"}), 403

#     report = MissingMarkReport(
#         student_id=user.id,
#         unit_id=unit.id,
#         description=description,
#         status="Pending",
#     )
#     db.session.add(report)
#     db.session.commit()

#     return jsonify({
#         "id": report.id,
#         "student_id": report.student_id,
#         "unit_id": report.unit_id,
#         "status": report.status,
#         "created_at": report.created_at.isoformat() if report.created_at else None,
#     }), 201


# # app/reports_api.py
# from flask import Blueprint, jsonify, request
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from sqlalchemy import select, func
# from .extensions import db
# from .models import User, Unit, Enrollment, MissingMarkReport

# reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")

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

# @reports_bp.post("/missing")
# @jwt_required()
# def create_missing_mark_report():
#     """
#     Create a MissingMarkReport.
#     Accepts:
#       { unit_code: "CHE 211", description: "..." }  OR
#       { unit_id: 123,        description: "..." }
#     Validates the student is enrolled in the unit.
#     """
#     user = _get_current_user()
#     if not user:
#         return jsonify({"error": "Unauthorized"}), 401
#     if user.role != "student":
#         return jsonify({"error": "Only students can report missing marks"}), 403

#     data = request.get_json(silent=True) or {}
#     description = (data.get("description") or "").strip()
#     unit_id = data.get("unit_id")
#     unit_code = (data.get("unit_code") or "").strip()

#     if not description:
#         return jsonify({"error": "description is required"}), 400

#     unit = None
#     if unit_code:
#         unit = db.session.scalar(
#             select(Unit).where(func.lower(Unit.code) == unit_code.lower()).limit(1)
#         )
#         if unit:
#             unit_id = unit.id
#     if not unit and unit_id:
#         unit = db.session.get(Unit, int(unit_id))

#     if not unit:
#         return jsonify({"error": "Unit not found"}), 404

#     enrolled = db.session.scalar(
#         select(Enrollment.id).where(
#             Enrollment.student_id == user.id,
#             Enrollment.unit_id == unit.id,
#         ).limit(1)
#     )
#     if not enrolled:
#         return jsonify({"error": "You are not enrolled in this unit"}), 403

#     report = MissingMarkReport(
#         student_id=user.id,
#         unit_id=unit.id,
#         description=description,
#         status="Pending",
#     )
#     db.session.add(report)
#     db.session.commit()

#     return jsonify({
#         "id": report.id,
#         "student_id": report.student_id,
#         "unit_id": report.unit_id,
#         "status": report.status,
#         "created_at": report.created_at.isoformat() if report.created_at else None,
#     }), 201



# app/reports_api.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, func
from .extensions import db
from .models import User, Unit, Enrollment, MissingMarkReport

# Blueprint mounted at /api/reports (as in your __init__.py)
reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")

def _get_current_user():
    identity = get_jwt_identity()
    if identity is None:
        return None
    u = None
    # Support identity being user id OR email (depending on your login implementation)
    if isinstance(identity, int) or (isinstance(identity, str) and identity.isdigit()):
        u = db.session.get(User, int(identity))
    if u is None and isinstance(identity, str):
        u = db.session.scalar(select(User).where(User.email == identity.lower()))
    return u

@reports_bp.post("/missing")
@jwt_required()
def create_missing_mark_report():
    """
    Create a MissingMarkReport.
    Accepts either:
      - { unit_code: "CHE 211", description: "..." }
      - { unit_id: 123,        description: "..." }
    Validates the student is enrolled in the unit.
    Returns: { id, student_id, unit_id, status, message, description, created_at }
    """
    user = _get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "student":
        return jsonify({"error": "Only students can report missing marks"}), 403

    data = request.get_json(silent=True) or {}

    # Text from the form
    description = (data.get("description") or "").strip()
    if not description:
        return jsonify({"error": "description is required"}), 400

    # Unit resolver: prefer code, fallback to id
    unit_id = data.get("unit_id")
    unit_code = (data.get("unit_code") or "").strip()

    unit = None
    if unit_code:
        unit = db.session.scalar(
            select(Unit).where(func.lower(Unit.code) == unit_code.lower()).limit(1)
        )
        if unit:
            unit_id = unit.id

    if not unit and unit_id:
        try:
            unit = db.session.get(Unit, int(unit_id))
        except Exception:
            unit = None

    if not unit:
        return jsonify({"error": "Unit not found"}), 404

    # Ensure the student is enrolled in this unit
    enrolled = db.session.scalar(
        select(Enrollment.id).where(
            Enrollment.student_id == user.id,
            Enrollment.unit_id == unit.id,
        ).limit(1)
    )
    if not enrolled:
        return jsonify({"error": "You are not enrolled in this unit"}), 403

    # Save BOTH fields so downstream UIs (lecturer dashboard) can read either
    report = MissingMarkReport(
        student_id=user.id,
        unit_id=unit.id,
        description=description,
        message=description,   # <-- important: mirror into message for UI
        status="Pending",
    )
    db.session.add(report)
    db.session.commit()

    return jsonify({
        "id": report.id,
        "student_id": report.student_id,
        "unit_id": report.unit_id,
        "status": report.status,
        "message": report.message,           # echo back
        "description": report.description,   # echo back
        "created_at": report.created_at.isoformat() if report.created_at else None,
    }), 201
