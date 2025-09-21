# # app/routes/admin.py  (note the package path)
# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from sqlalchemy import func, desc
# from ..extensions import db
# from ..models import User, Department, Unit, Grade, MissingMarkReport, Activity

# admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# def _require_admin():
#     identity = get_jwt_identity()
#     if not identity:
#         return jsonify({"error": "Missing identity"}), 401
#     u = None
#     if isinstance(identity, int) or (isinstance(identity, str) and identity.isdigit()):
#         u = db.session.get(User, int(identity))
#     if u is None and isinstance(identity, str):
#         u = db.session.scalar(db.select(User).where(User.email == identity.lower()))
#     if u is None:
#         return jsonify({"error": "User not found"}), 401
#     if getattr(u, "role", None) != "admin":
#         return jsonify({"error": "Admins only"}), 403
#     return None

# @admin_bp.route("/summary", methods=["GET", "OPTIONS"])  # ✅ explicit OPTIONS
# @jwt_required()
# def summary():
#     guard = _require_admin()
#     if guard:
#         return guard
#     total_users = db.session.scalar(db.select(func.count(User.id))) or 0
#     students = db.session.scalar(db.select(func.count(User.id)).where(User.role == "student")) or 0
#     lecturers = db.session.scalar(db.select(func.count(User.id)).where(User.role == "lecturer")) or 0
#     hods = db.session.scalar(db.select(func.count(User.id)).where(User.role == "hod")) or 0
#     departments = db.session.scalar(db.select(func.count(Department.id))) or 0
#     units = db.session.scalar(db.select(func.count(Unit.id))) or 0
#     pending_approvals = db.session.scalar(
#         db.select(func.count(Grade.id)).where(Grade.status.in_(["submitted"]))
#     ) or 0
#     open_reports = db.session.scalar(
#         db.select(func.count(MissingMarkReport.id)).where(MissingMarkReport.status != "Resolved")
#     ) or 0
#     return jsonify({
#         "data": {
#             "total_users": total_users,
#             "student_count": students,
#             "lecturer_count": lecturers,
#             "hod_count": hods,
#             "department_count": departments,
#             "unit_count": units,
#             "pending_approvals": pending_approvals,
#             "open_reports": open_reports,
#         }
#     })

# @admin_bp.route("/recent-activity", methods=["GET", "OPTIONS"])  # ✅ explicit OPTIONS
# @jwt_required()
# def recent_activity():
#     guard = _require_admin()
#     if guard:
#         return guard
#     try:
#         limit = min(int(request.args.get("limit", 10)), 50)
#     except ValueError:
#         limit = 10
#     q = db.session.query(Activity).order_by(desc(Activity.created_at)).limit(limit)
#     items = [{
#         "id": a.id,
#         "kind": (a.kind or "activity"),
#         "title": a.title or (a.action or "—"),
#         "actor": a.actor or "System",
#         "timestamp": a.created_at.isoformat() if a.created_at else None,
#         "meta": a.meta_json or {},
#     } for a in q.all()]
#     return jsonify({"data": items})


# # app/routes/admin.py
# from __future__ import annotations

# from typing import Any, Dict, List, Optional

# from flask import Blueprint, jsonify, request
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from flask_cors import cross_origin
# from sqlalchemy import func, select, desc, or_

# from ..extensions import db
# from ..models import (
#     User,
#     Department,
#     Unit,
#     Grade,
#     MissingMarkReport,
#     # Activity model is optional in some setups; import if present
# )

# admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# # Vite dev origins (adjust if you use a different port)
# CORS_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173"]


# # ---------- helpers ----------

# def _get_user_from_identity(identity: Any) -> Optional[User]:
#     """Accepts id or email from the JWT identity and returns the User."""
#     if identity is None:
#         return None
#     # numeric id
#     try:
#         iid = int(identity)
#         u = db.session.get(User, iid)
#         if u:
#             return u
#     except Exception:
#         pass
#     # email identity
#     if isinstance(identity, str):
#         stmt = select(User).where(User.email == identity.lower())
#         return db.session.scalar(stmt)
#     return None


# def _require_admin():
#     """Return (response, status) if not admin; else None."""
#     identity = get_jwt_identity()
#     u = _get_user_from_identity(identity)
#     if not u:
#         return jsonify({"error": "unauthorized"}), 401
#     if getattr(u, "role", None) != "admin":
#         return jsonify({"error": "Admins only"}), 403
#     return None


# def _count(stmt) -> int:
#     """Safe scalar count helper."""
#     try:
#         return int(db.session.scalar(stmt) or 0)
#     except Exception:
#         return 0


# # ---------- summary ----------

# @admin_bp.route("/summary", methods=["GET", "OPTIONS"])
# @cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
# @jwt_required()
# def admin_summary():
#     """Aggregate counters for the Admin dashboard."""
#     guard = _require_admin()
#     if guard:
#         return guard

#     # Users by role
#     total_users = _count(select(func.count(User.id)))
#     students = _count(select(func.count(User.id)).where(User.role == "student"))
#     lecturers = _count(select(func.count(User.id)).where(User.role == "lecturer"))
#     hods = _count(select(func.count(User.id)).where(User.role == "hod"))

#     # Structure
#     departments = _count(select(func.count(Department.id)))
#     units = _count(select(func.count(Unit.id)))

#     # "Pending approvals" — make it resilient to schema differences:
#     # - Grade.status in ('submitted','pending','Pending') OR
#     # - Grades not yet published if you use is_published
#     pending_from_status = _count(
#         select(func.count(Grade.id)).where(
#             or_(
#                 Grade.status.in_(["submitted", "pending", "Pending"]),
#                 # some schemas may not have Grade.status for approvals—leave this OR in
#                 getattr(Grade, "needs_approval", False) and (Grade.needs_approval == True)  # noqa: E712
#             )
#         )
#     )
#     pending_from_unpublished = 0
#     if hasattr(Grade, "is_published"):
#         pending_from_unpublished = _count(select(func.count(Grade.id)).where(Grade.is_published == False))  # noqa: E712

#     # Prefer explicit status counts; fall back to unpublished
#     pending_approvals = pending_from_status or pending_from_unpublished

#     # Open missing-mark reports (anything not resolved)
#     open_reports = _count(
#         select(func.count(MissingMarkReport.id)).where(
#             or_(
#                 MissingMarkReport.status != "Resolved",
#                 MissingMarkReport.status.is_(None),
#             )
#         )
#     )

#     # Return in snake_case (your frontend normalizer supports both)
#     return jsonify(
#         {
#             "data": {
#                 "total_users": total_users,
#                 "student_count": students,
#                 "lecturer_count": lecturers,
#                 "hod_count": hods,
#                 "department_count": departments,
#                 "unit_count": units,
#                 "pending_approvals": pending_approvals,
#                 "open_reports": open_reports,
#             }
#         }
#     ), 200


# # ---------- recent activity ----------

# @admin_bp.route("/recent-activity", methods=["GET", "OPTIONS"])
# @cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
# @jwt_required()
# def admin_recent_activity():
#     """Return the last N activity entries (or synthesize from other tables if Activity is absent)."""
#     guard = _require_admin()
#     if guard:
#         return guard

#     try:
#         limit = min(int(request.args.get("limit", 10)), 50)
#     except Exception:
#         limit = 10

#     items: List[Dict[str, Any]] = []

#     # If you have an Activity model with fields: id, kind, title, actor, created_at, meta_json
#     Activity = None
#     try:
#         from ..models import Activity as _Activity  # type: ignore
#         Activity = _Activity
#     except Exception:
#         Activity = None

#     if Activity is not None:
#         q = select(Activity).order_by(desc(Activity.created_at)).limit(limit)
#         rows = db.session.scalars(q).all()
#         for a in rows:
#             items.append(
#                 {
#                     "id": getattr(a, "id", None),
#                     "kind": getattr(a, "kind", None) or "activity",
#                     "title": getattr(a, "title", None) or getattr(a, "action", None) or "—",
#                     "actor": getattr(a, "actor", None) or "System",
#                     "at": getattr(a, "created_at", None).isoformat()
#                     if getattr(a, "created_at", None)
#                     else None,
#                     "meta": getattr(a, "meta_json", None) or {},
#                 }
#             )
#     else:
#         # Fallback: synthesize from latest MissingMarkReport and Grades
#         # Missing Reports
#         mr_q = (
#             select(MissingMarkReport)
#             .order_by(desc(MissingMarkReport.created_at))
#             .limit(limit)
#         )
#         for r in db.session.scalars(mr_q).all():
#             items.append(
#                 {
#                     "id": f"report-{r.id}",
#                     "kind": "report",
#                     "title": (r.message or r.description or "Missing mark report"),
#                     "actor": getattr(r, "student_email", None) or "Student",
#                     "at": r.created_at.isoformat() if r.created_at else None,
#                     "meta": {
#                         "unit": getattr(r, "unit_id", None),
#                         "status": r.status,
#                     },
#                 }
#             )

#         # Grades (optionally)
#         g_q = select(Grade).order_by(desc(Grade.id)).limit(limit)
#         for g in db.session.scalars(g_q).all():
#             items.append(
#                 {
#                     "id": f"grade-{g.id}",
#                     "kind": "grade",
#                     "title": f"Grade {'published' if getattr(g, 'is_published', False) else 'saved'}",
#                     "actor": "Lecturer",
#                     "at": None,  # add a timestamp field to Grade if you have it
#                     "meta": {
#                         "assessment_id": getattr(g, "assessment_id", None),
#                         "student_id": getattr(g, "student_id", None),
#                         "score": getattr(g, "score", None),
#                     },
#                 }
#             )

#         # Trim to requested limit, newest first (best effort)
#         items = items[:limit]

#     return jsonify({"data": items}), 200



# from __future__ import annotations
# from typing import Any, Dict, List, Optional

# from flask import Blueprint, jsonify, request
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from flask_cors import cross_origin
# from sqlalchemy import func, select, desc, or_

# from ..extensions import db
# from ..models import (
#     User,
#     Department,
#     Unit,
#     Grade,
#     MissingMarkReport,
# )

# admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# # Allow local Vite dev origins
# CORS_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173"]


# # ---------- helpers ----------
# def _get_user_from_identity(identity: Any) -> Optional[User]:
#     """Accepts id or email from the JWT identity and returns the User."""
#     if identity is None:
#         return None
#     try:
#         iid = int(identity)
#         u = db.session.get(User, iid)
#         if u:
#             return u
#     except Exception:
#         pass
#     if isinstance(identity, str):
#         stmt = select(User).where(User.email == identity.lower())
#         return db.session.scalar(stmt)
#     return None


# def _require_admin():
#     """Return (response, status) if not admin; else None."""
#     identity = get_jwt_identity()
#     u = _get_user_from_identity(identity)
#     if not u:
#         return jsonify({"error": "unauthorized"}), 401
#     if getattr(u, "role", None) != "admin":
#         return jsonify({"error": "Admins only"}), 403
#     return None


# def _count(stmt) -> int:
#     """Safe scalar count helper."""
#     try:
#         return int(db.session.scalar(stmt) or 0)
#     except Exception:
#         return 0


# # ---------- summary ----------
# @admin_bp.route("/summary", methods=["GET", "OPTIONS"])
# @cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
# @jwt_required()
# def admin_summary():
#     """Aggregate counters for the Admin dashboard."""
#     guard = _require_admin()
#     if guard:
#         return guard

#     # Users by role
#     total_users = _count(select(func.count(User.id)))
#     student_count = _count(select(func.count(User.id)).where(User.role == "student"))
#     lecturer_count = _count(select(func.count(User.id)).where(User.role == "lecturer"))
#     hod_count = _count(select(func.count(User.id)).where(User.role == "hod"))

#     # Structure
#     department_count = _count(select(func.count(Department.id)))
#     unit_count = _count(select(func.count(Unit.id)))

#     # Pending approvals
#     pending_from_status = _count(
#         select(func.count(Grade.id)).where(
#             or_(Grade.status.in_(["submitted", "pending", "Pending"]))
#         )
#     )
#     pending_from_unpublished = (
#         _count(select(func.count(Grade.id)).where(Grade.is_published == False))  # noqa: E712
#         if hasattr(Grade, "is_published")
#         else 0
#     )
#     pending_approvals = pending_from_status or pending_from_unpublished

#     # Open missing-mark reports
#     open_reports = _count(
#         select(func.count(MissingMarkReport.id)).where(
#             or_(MissingMarkReport.status != "Resolved", MissingMarkReport.status.is_(None))
#         )
#     )

#     return jsonify(
#         data={
#             "total_users": total_users,
#             "student_count": student_count,
#             "lecturer_count": lecturer_count,
#             "hod_count": hod_count,
#             "department_count": department_count,
#             "unit_count": unit_count,
#             "pending_approvals": pending_approvals,
#             "open_reports": open_reports,
#         }
#     ), 200


# # ---------- recent activity ----------
# @admin_bp.route("/recent-activity", methods=["GET", "OPTIONS"])
# @cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
# @jwt_required()
# def admin_recent_activity():
#     """Return the last N activity entries (fallback from Missing Reports & Grades if Activity table is missing)."""
#     guard = _require_admin()
#     if guard:
#         return guard

#     try:
#         limit = min(int(request.args.get("limit", 10)), 50)
#     except Exception:
#         limit = 10

#     items: List[Dict[str, Any]] = []

#     # Try Activity model if present
#     Activity = None
#     try:
#         from ..models import Activity as _Activity  # type: ignore
#         Activity = _Activity
#     except Exception:
#         Activity = None

#     if Activity is not None:
#         q = select(Activity).order_by(desc(Activity.created_at)).limit(limit)
#         rows = db.session.scalars(q).all()
#         for a in rows:
#             items.append(
#                 {
#                     "id": getattr(a, "id", None),
#                     "kind": getattr(a, "kind", None) or "activity",
#                     "title": getattr(a, "title", None) or getattr(a, "action", None) or "—",
#                     "actor": getattr(a, "actor", None) or "System",
#                     "at": getattr(a, "created_at", None).isoformat()
#                     if getattr(a, "created_at", None)
#                     else None,
#                     "meta": getattr(a, "meta_json", None) or {},
#                 }
#             )
#     else:
#         # Fallback: synthesize from MissingMarkReport
#         mr_q = select(MissingMarkReport).order_by(desc(MissingMarkReport.created_at)).limit(limit)
#         for r in db.session.scalars(mr_q).all():
#             items.append(
#                 {
#                     "id": f"report-{r.id}",
#                     "kind": "report",
#                     "title": (r.message or r.description or "Missing mark report"),
#                     "actor": getattr(r.student, "name", None) or "Student",
#                     "at": r.created_at.isoformat() if r.created_at else None,
#                     "meta": {"unit": getattr(r.unit, "title", None), "status": r.status},
#                 }
#             )

#     return jsonify({"data": items}), 200



# from __future__ import annotations
# from typing import Any, Dict, List, Optional

# from flask import Blueprint, jsonify, request
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from flask_cors import cross_origin
# from sqlalchemy import func, select, desc, or_

# from ..extensions import db
# from ..models import (
#     User,
#     Department,
#     Unit,
#     Grade,
#     MissingMarkReport,
#     Activity,   # ✅ unified, always imported if present
# )

# admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# # Allow local Vite dev origins
# CORS_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173"]


# # ---------- helpers ----------
# def _get_user_from_identity(identity: Any) -> Optional[User]:
#     """Accepts id or email from the JWT identity and returns the User."""
#     if identity is None:
#         return None
#     try:
#         iid = int(identity)
#         u = db.session.get(User, iid)
#         if u:
#             return u
#     except Exception:
#         pass
#     if isinstance(identity, str):
#         stmt = select(User).where(User.email == identity.lower())
#         return db.session.scalar(stmt)
#     return None


# def _require_admin():
#     """Return (response, status) if not admin; else None."""
#     identity = get_jwt_identity()
#     u = _get_user_from_identity(identity)
#     if not u:
#         return jsonify({"error": "unauthorized"}), 401
#     if getattr(u, "role", None) != "admin":
#         return jsonify({"error": "Admins only"}), 403
#     return None


# def _count(stmt) -> int:
#     """Safe scalar count helper."""
#     try:
#         return int(db.session.scalar(stmt) or 0)
#     except Exception:
#         return 0


# # ---------- summary ----------
# @admin_bp.route("/summary", methods=["GET", "OPTIONS"])
# @cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
# @jwt_required()
# def admin_summary():
#     """Aggregate counters for the Admin dashboard."""
#     guard = _require_admin()
#     if guard:
#         return guard

#     # Users by role
#     total_users = _count(select(func.count(User.id)))
#     student_count = _count(select(func.count(User.id)).where(User.role == "student"))
#     lecturer_count = _count(select(func.count(User.id)).where(User.role == "lecturer"))
#     hod_count = _count(select(func.count(User.id)).where(User.role == "hod"))

#     # Structure
#     department_count = _count(select(func.count(Department.id)))
#     unit_count = _count(select(func.count(Unit.id)))

#     # Pending approvals
#     pending_from_status = _count(
#         select(func.count(Grade.id)).where(
#             or_(Grade.status.in_(["submitted", "pending", "Pending"]))
#         )
#     )
#     pending_from_unpublished = (
#         _count(select(func.count(Grade.id)).where(Grade.is_published == False))  # noqa: E712
#         if hasattr(Grade, "is_published")
#         else 0
#     )
#     pending_approvals = pending_from_status or pending_from_unpublished

#     # Open missing-mark reports
#     open_reports = _count(
#         select(func.count(MissingMarkReport.id)).where(
#             or_(MissingMarkReport.status != "Resolved", MissingMarkReport.status.is_(None))
#         )
#     )

#     return jsonify(
#         data={
#             "total_users": total_users,
#             "student_count": student_count,
#             "lecturer_count": lecturer_count,
#             "hod_count": hod_count,
#             "department_count": department_count,
#             "unit_count": unit_count,
#             "pending_approvals": pending_approvals,
#             "open_reports": open_reports,
#         }
#     ), 200


# # ---------- recent activity ----------
# @admin_bp.route("/recent-activity", methods=["GET", "OPTIONS"])
# @cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
# @jwt_required()
# def admin_recent_activity():
#     """Return the last N activity entries (or fallback from Missing Reports & Grades)."""
#     guard = _require_admin()
#     if guard:
#         return guard

#     try:
#         limit = min(int(request.args.get("limit", 10)), 50)
#     except Exception:
#         limit = 10

#     items: List[Dict[str, Any]] = []

#     # ✅ Use Activity model if available
#     if Activity is not None:
#         q = select(Activity).order_by(desc(Activity.created_at)).limit(limit)
#         rows = db.session.scalars(q).all()
#         for a in rows:
#             items.append(
#                 {
#                     "id": getattr(a, "id", None),
#                     "kind": getattr(a, "kind", None) or "activity",
#                     "title": getattr(a, "title", None) or getattr(a, "action", None) or "—",
#                     "actor": getattr(a, "actor", None) or "System",
#                     "at": getattr(a, "created_at", None).isoformat()
#                     if getattr(a, "created_at", None)
#                     else None,
#                     "meta": getattr(a, "meta_json", None) or {},
#                 }
#             )
#     else:
#         # Fallback: Missing Reports
#         mr_q = select(MissingMarkReport).order_by(desc(MissingMarkReport.created_at)).limit(limit)
#         for r in db.session.scalars(mr_q).all():
#             items.append(
#                 {
#                     "id": f"report-{r.id}",
#                     "kind": "report",
#                     "title": (r.message or r.description or "Missing mark report"),
#                     "actor": getattr(r.student, "name", None) or "Student",
#                     "at": r.created_at.isoformat() if r.created_at else None,
#                     "meta": {"unit": getattr(r.unit, "title", None), "status": r.status},
#                 }
#             )

#         # Optionally add recent grades
#         g_q = select(Grade).order_by(desc(Grade.id)).limit(limit)
#         for g in db.session.scalars(g_q).all():
#             items.append(
#                 {
#                     "id": f"grade-{g.id}",
#                     "kind": "grade",
#                     "title": f"Grade {'published' if getattr(g, 'is_published', False) else 'saved'}",
#                     "actor": "Lecturer",
#                     "at": None,
#                     "meta": {
#                         "assessment_id": getattr(g, "assessment_id", None),
#                         "student_id": getattr(g, "student_id", None),
#                         "score": getattr(g, "score", None),
#                     },
#                 }
#             )

#         items = items[:limit]

#     return jsonify({"data": items}), 200



from __future__ import annotations
from typing import Any, Dict, List, Optional

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from sqlalchemy import func, select, desc, or_

from .extensions import db
from .models import (
    User,
    Department,
    Unit,
    Grade,
    MissingMarkReport,
    Activity,  # ✅ always imported
)

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# Allow local Vite dev origins
CORS_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173"]


# ---------- helpers ----------
def _get_user_from_identity(identity: Any) -> Optional[User]:
    """Accepts id or email from the JWT identity and returns the User."""
    if identity is None:
        return None
    try:
        iid = int(identity)
        u = db.session.get(User, iid)
        if u:
            return u
    except Exception:
        pass
    if isinstance(identity, str):
        stmt = select(User).where(User.email == identity.lower())
        return db.session.scalar(stmt)
    return None


def _require_admin():
    """Return (response, status) if not admin; else None."""
    identity = get_jwt_identity()
    u = _get_user_from_identity(identity)
    if not u:
        return jsonify({"error": "unauthorized"}), 401
    if getattr(u, "role", None) != "admin":
        return jsonify({"error": "Admins only"}), 403
    return None


def _count(stmt) -> int:
    """Safe scalar count helper."""
    try:
        return int(db.session.scalar(stmt) or 0)
    except Exception:
        return 0


# ---------- summary ----------
@admin_bp.route("/summary", methods=["GET", "OPTIONS"])
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@jwt_required()
def admin_summary():
    """Aggregate counters for the Admin dashboard."""
    guard = _require_admin()
    if guard:
        return guard

    # Users by role
    total_users = _count(select(func.count(User.id)))
    student_count = _count(select(func.count(User.id)).where(User.role == "student"))
    lecturer_count = _count(select(func.count(User.id)).where(User.role == "lecturer"))
    hod_count = _count(select(func.count(User.id)).where(User.role == "hod"))

    # Structure
    department_count = _count(select(func.count(Department.id)))
    unit_count = _count(select(func.count(Unit.id)))

    # Pending approvals
    pending_from_status = _count(
        select(func.count(Grade.id)).where(
            or_(Grade.status.in_(["submitted", "pending", "Pending"]))
        )
    )
    pending_from_unpublished = (
        _count(select(func.count(Grade.id)).where(Grade.is_published == False))  # noqa: E712
        if hasattr(Grade, "is_published")
        else 0
    )
    pending_approvals = pending_from_status or pending_from_unpublished

    # Open missing-mark reports
    open_reports = _count(
        select(func.count(MissingMarkReport.id)).where(
            or_(MissingMarkReport.status != "Resolved", MissingMarkReport.status.is_(None))
        )
    )

    return jsonify(
        data={
            "total_users": total_users,
            "student_count": student_count,
            "lecturer_count": lecturer_count,
            "hod_count": hod_count,
            "department_count": department_count,
            "unit_count": unit_count,
            "pending_approvals": pending_approvals,
            "open_reports": open_reports,
        }
    ), 200


# ---------- recent activity ----------
@admin_bp.route("/recent-activity", methods=["GET", "OPTIONS"])
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@jwt_required()
def admin_recent_activity():
    """Return the last N activity entries (or fallback from Missing Reports & Grades)."""
    guard = _require_admin()
    if guard:
        return guard

    try:
        limit = min(int(request.args.get("limit", 10)), 50)
    except Exception:
        limit = 10

    items: List[Dict[str, Any]] = []

    # ✅ Use Activity model if available
    if Activity is not None:
        q = select(Activity).order_by(desc(Activity.created_at)).limit(limit)
        rows = db.session.scalars(q).all()
        for a in rows:
            items.append(
                {
                    "id": getattr(a, "id", None),
                    "kind": getattr(a, "kind", None) or "activity",
                    "title": getattr(a, "title", None) or getattr(a, "action", None) or "—",
                    "actor": getattr(a, "actor", None) or "System",
                    "at": getattr(a, "created_at", None).isoformat()
                    if getattr(a, "created_at", None)
                    else None,
                    "meta": getattr(a, "meta_json", None) or {},
                }
            )
    else:
        # Fallback: Missing Reports
        mr_q = select(MissingMarkReport).order_by(desc(MissingMarkReport.created_at)).limit(limit)
        for r in db.session.scalars(mr_q).all():
            items.append(
                {
                    "id": f"report-{r.id}",
                    "kind": "report",
                    "title": (r.message or r.description or "Missing mark report"),
                    "actor": getattr(r.student, "name", None) or "Student",
                    "at": r.created_at.isoformat() if r.created_at else None,
                    "meta": {"unit": getattr(r.unit, "title", None), "status": r.status},
                }
            )

        # Optionally add recent grades
        g_q = select(Grade).order_by(desc(Grade.id)).limit(limit)
        for g in db.session.scalars(g_q).all():
            items.append(
                {
                    "id": f"grade-{g.id}",
                    "kind": "grade",
                    "title": f"Grade {'published' if getattr(g, 'is_published', False) else 'saved'}",
                    "actor": "Lecturer",
                    "at": None,
                    "meta": {
                        "assessment_id": getattr(g, "assessment_id", None),
                        "student_id": getattr(g, "student_id", None),
                        "score": getattr(g, "score", None),
                    },
                }
            )

        items = items[:limit]

    return jsonify({"data": items}), 200
