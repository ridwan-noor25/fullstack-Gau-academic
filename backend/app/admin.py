# app/routes/admin.py  (note the package path)
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, desc
from ..extensions import db
from ..models import User, Department, Unit, Grade, MissingMarkReport, Activity

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

def _require_admin():
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Missing identity"}), 401
    u = None
    if isinstance(identity, int) or (isinstance(identity, str) and identity.isdigit()):
        u = db.session.get(User, int(identity))
    if u is None and isinstance(identity, str):
        u = db.session.scalar(db.select(User).where(User.email == identity.lower()))
    if u is None:
        return jsonify({"error": "User not found"}), 401
    if getattr(u, "role", None) != "admin":
        return jsonify({"error": "Admins only"}), 403
    return None

@admin_bp.route("/summary", methods=["GET", "OPTIONS"])  # ✅ explicit OPTIONS
@jwt_required()
def summary():
    guard = _require_admin()
    if guard:
        return guard
    total_users = db.session.scalar(db.select(func.count(User.id))) or 0
    students = db.session.scalar(db.select(func.count(User.id)).where(User.role == "student")) or 0
    lecturers = db.session.scalar(db.select(func.count(User.id)).where(User.role == "lecturer")) or 0
    hods = db.session.scalar(db.select(func.count(User.id)).where(User.role == "hod")) or 0
    departments = db.session.scalar(db.select(func.count(Department.id))) or 0
    units = db.session.scalar(db.select(func.count(Unit.id))) or 0
    pending_approvals = db.session.scalar(
        db.select(func.count(Grade.id)).where(Grade.status.in_(["submitted"]))
    ) or 0
    open_reports = db.session.scalar(
        db.select(func.count(MissingMarkReport.id)).where(MissingMarkReport.status != "Resolved")
    ) or 0
    return jsonify({
        "data": {
            "total_users": total_users,
            "student_count": students,
            "lecturer_count": lecturers,
            "hod_count": hods,
            "department_count": departments,
            "unit_count": units,
            "pending_approvals": pending_approvals,
            "open_reports": open_reports,
        }
    })

@admin_bp.route("/recent-activity", methods=["GET", "OPTIONS"])  # ✅ explicit OPTIONS
@jwt_required()
def recent_activity():
    guard = _require_admin()
    if guard:
        return guard
    try:
        limit = min(int(request.args.get("limit", 10)), 50)
    except ValueError:
        limit = 10
    q = db.session.query(Activity).order_by(desc(Activity.created_at)).limit(limit)
    items = [{
        "id": a.id,
        "kind": (a.kind or "activity"),
        "title": a.title or (a.action or "—"),
        "actor": a.actor or "System",
        "timestamp": a.created_at.isoformat() if a.created_at else None,
        "meta": a.meta_json or {},
    } for a in q.all()]
    return jsonify({"data": items})
