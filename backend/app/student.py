# # app/student.py
# from __future__ import annotations

# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity

# from .decorators import role_required
# from .extensions import db
# from .models import User, Unit, Enrollment, Assessment, Grade

# student_bp = Blueprint("student", __name__)


# # ---------------------------
# # Helpers
# # ---------------------------
# def _me() -> User:
#     uid = get_jwt_identity()
#     return User.query.get(int(uid)) if uid else None


# # ---------------------------
# # Enrollments
# # ---------------------------
# @student_bp.get("/enrollments")
# @jwt_required()
# @role_required("student")
# def list_enrollments():
#     me = _me()
#     if not me:
#         return jsonify(error="unauthorized"), 401

#     rows = (
#         Enrollment.query.filter_by(student_id=me.id)
#         .order_by(Enrollment.created_at.desc())
#         .all()
#     )

#     items = []
#     for e in rows:
#         d = e.to_dict()
#         # nest a lightweight unit object for the UI
#         if e.unit is not None:
#             d["unit"] = {
#                 "id": e.unit.id,
#                 "code": e.unit.code,
#                 "title": e.unit.title,
#                 "credits": e.unit.credits,
#                 # include year/semester if present in your model
#                 getattr(Unit, "year_level", None) and "year_level" or "": getattr(e.unit, "year_level", None),
#                 getattr(Unit, "semester", None) and "semester" or "": getattr(e.unit, "semester", None),
#             }
#             # clean empty keys
#             d["unit"] = {k: v for k, v in d["unit"].items() if k and v is not None}
#         items.append(d)

#     return jsonify(items=items), 200


# @student_bp.post("/enrollments")
# @jwt_required()
# @role_required("student")
# def create_enrollment():
#     me = _me()
#     if not me:
#         return jsonify(error="unauthorized"), 401

#     data = request.get_json(force=True) or {}
#     unit_id = data.get("unit_id")
#     if not unit_id:
#         return jsonify(error="unit_id required"), 400

#     unit = Unit.query.get(unit_id)
#     if not unit:
#         return jsonify(error="unit not found"), 404

#     # Allow enrollment even if student has no department.
#     # If BOTH sides have a department, ensure they match.
#     if me.department_id and unit.department_id and me.department_id != unit.department_id:
#         return jsonify(error="unit not offered by your department"), 400

#     # Idempotent: ignore if already enrolled
#     ex = Enrollment.query.filter_by(student_id=me.id, unit_id=unit.id).first()
#     if ex:
#         d = ex.to_dict()
#         d["unit"] = {"id": unit.id, "code": unit.code, "title": unit.title}
#         return jsonify(message="already enrolled", enrollment=d), 200

#     en = Enrollment(student_id=me.id, unit_id=unit.id)
#     db.session.add(en)
#     db.session.commit()

#     payload = en.to_dict()
#     payload["unit"] = {"id": unit.id, "code": unit.code, "title": unit.title}
#     return jsonify(message="enrolled", enrollment=payload), 201


# @student_bp.delete("/enrollments/<int:enroll_id>")
# @jwt_required()
# @role_required("student")
# def drop_enrollment(enroll_id: int):
#     me = _me()
#     if not me:
#         return jsonify(error="unauthorized"), 401

#     e = Enrollment.query.get_or_404(enroll_id)
#     if e.student_id != me.id:
#         return jsonify(error="not your enrollment"), 403

#     db.session.delete(e)
#     db.session.commit()
#     return ("", 204)


# # Optional: drop by unit id via query param (supports your utility)
# @student_bp.delete("/enrollments")
# @jwt_required()
# @role_required("student")
# def drop_enrollment_by_unit():
#     me = _me()
#     if not me:
#         return jsonify(error="unauthorized"), 401

#     unit_id = request.args.get("unit_id", type=int)
#     if not unit_id:
#         return jsonify(error="unit_id required"), 400

#     e = Enrollment.query.filter_by(student_id=me.id, unit_id=unit_id).first()
#     if not e:
#         return jsonify(error="enrollment not found"), 404

#     db.session.delete(e)
#     db.session.commit()
#     return ("", 204)


# # ---------------------------
# # Available Units (by year + semester)
# # ---------------------------
# @student_bp.get("/units/available")
# @jwt_required()
# @role_required("student")
# def units_available():
#     """
#     Returns units filtered by year_level & semester.
#     This endpoint no longer requires the student to have a department.
#     If you want to scope by department when available, see the commented lines.
#     """
#     me = _me()
#     if not me:
#         return jsonify(error="unauthorized"), 401

#     year_s = (request.args.get("year_level") or "").strip()
#     sem_s = (request.args.get("semester") or "").strip()

#     # Require both filters; UI will send them
#     if not year_s or not sem_s:
#         return jsonify(items=[]), 200

#     try:
#         year_level = int(year_s)
#         semester = int(sem_s)
#     except Exception:
#         return jsonify(error="year_level and semester must be integers"), 400

#     q = Unit.query

#     # OPTIONAL: uncomment to restrict to student's department when known
#     # if me.department_id:
#     #     q = q.filter(Unit.department_id == me.department_id)

#     # These columns must exist in Unit (add/migrate if needed)
#     q = q.filter(
#         getattr(Unit, "year_level") == year_level,
#         getattr(Unit, "semester") == semester,
#     ).order_by(Unit.code.asc())

#     units = q.all()

#     # Exclude units already enrolled
#     enrolled_ids = {
#         e.unit_id for e in Enrollment.query.filter_by(student_id=me.id).all()
#     }

#     items = []
#     for u in units:
#         if u.id in enrolled_ids:
#             continue
#         d = {
#             "id": u.id,
#             "code": u.code,
#             "title": u.title,
#             "credits": u.credits,
#             "year_level": getattr(u, "year_level", None),
#             "semester": getattr(u, "semester", None),
#         }
#         items.append({k: v for k, v in d.items() if v is not None})

#     return jsonify(items=items), 200


# # ---------------------------
# # Published Grades
# # ---------------------------
# @student_bp.get("/grades")
# @jwt_required()
# @role_required("student")
# def my_grades():
#     """
#     Return published assessments and the student's scores grouped by unit.
#     Shape matches the typical frontend expectation:
#       items: [
#         {
#           "unit": { id, code, title },
#           "assessments": [{ id, title, max_score, weight, is_published, score }],
#           "total_weight": <sum of weights>,
#           "total_score": <weighted percentage out of 100>
#         }, ...
#       ]
#     """
#     me = _me()
#     if not me:
#         return jsonify(error="unauthorized"), 401

#     enrollments = Enrollment.query.filter_by(student_id=me.id).all()
#     unit_ids = [e.unit_id for e in enrollments]
#     if not unit_ids:
#         return jsonify(items=[]), 200

#     # Pull assessments for those units that are published
#     assessments = (
#         Assessment.query
#         .filter(Assessment.unit_id.in_(unit_ids), Assessment.is_published == True)
#         .order_by(Assessment.unit_id.asc(), Assessment.created_at.asc())
#         .all()
#     )

#     # Preload grades in bulk
#     grades = (
#         Grade.query
#         .filter(Grade.student_id == me.id, Grade.assessment_id.in_([a.id for a in assessments]))
#         .all()
#     )
#     grade_by_assessment = {g.assessment_id: g for g in grades}

#     # Group by unit
#     by_unit = {}
#     for a in assessments:
#         by_unit.setdefault(a.unit_id, []).append(a)

#     items = []
#     # Fetch units in one go
#     units = {u.id: u for u in Unit.query.filter(Unit.id.in_(list(by_unit.keys()))).all()}

#     for uid, arr in by_unit.items():
#         u = units.get(uid)
#         if not u:
#             continue
#         unit_block = {
#             "unit": {"id": u.id, "code": u.code, "title": u.title},
#             "assessments": [],
#             "total_weight": 0.0,
#             "total_score": 0.0,  # weighted percentage (0..100)
#         }
#         tw = 0.0
#         total_weighted_pct = 0.0

#         for a in arr:
#             g = grade_by_assessment.get(a.id)
#             score = g.score if g is not None else None

#             # accumulate weighted total if score exists
#             if score is not None and a.max_score:
#                 pct = (float(score) / float(a.max_score)) * 100.0
#                 total_weighted_pct += pct * float(a.weight or 0.0)
#             tw += float(a.weight or 0.0)

#             unit_block["assessments"].append({
#                 "id": a.id,
#                 "title": a.title,
#                 "max_score": a.max_score,
#                 "weight": a.weight,
#                 "is_published": a.is_published,
#                 "score": score,
#             })

#         unit_block["total_weight"] = round(tw, 4)
#         unit_block["total_score"] = round(total_weighted_pct, 2)
#         items.append(unit_block)

#     return jsonify(items=items), 200



# app/student.py
from __future__ import annotations

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from .decorators import role_required
from .extensions import db
from .models import User, Unit, Enrollment, Assessment, Grade

student_bp = Blueprint("student", __name__)


# ---------------------------
# Helpers
# ---------------------------
def _me() -> User:
    uid = get_jwt_identity()
    return User.query.get(int(uid)) if uid else None


# ---------------------------
# Enrollments
# ---------------------------
@student_bp.get("/enrollments")
@jwt_required()
@role_required("student")
def list_enrollments():
    me = _me()
    if not me:
        return jsonify(error="unauthorized"), 401

    rows = (
        Enrollment.query.filter_by(student_id=me.id)
        .order_by(Enrollment.created_at.desc())
        .all()
    )

    items = []
    for e in rows:
        d = e.to_dict()
        # nest a lightweight unit object for the UI
        if e.unit is not None:
            d["unit"] = {
                "id": e.unit.id,
                "code": e.unit.code,
                "title": e.unit.title,
                "credits": e.unit.credits,
                # (kept exactly as-is)
                getattr(Unit, "year_level", None) and "year_level" or "": getattr(e.unit, "year_level", None),
                getattr(Unit, "semester", None) and "semester" or "": getattr(e.unit, "semester", None),
            }
            d["unit"] = {k: v for k, v in d["unit"].items() if k and v is not None}
        items.append(d)

    return jsonify(items=items), 200


@student_bp.post("/enrollments")
@jwt_required()
@role_required("student")
def create_enrollment():
    me = _me()
    if not me:
        return jsonify(error="unauthorized"), 401

    data = request.get_json(force=True) or {}
    unit_id = data.get("unit_id")
    if not unit_id:
        return jsonify(error="unit_id required"), 400

    unit = Unit.query.get(unit_id)
    if not unit:
        return jsonify(error="unit not found"), 404

    if me.department_id and unit.department_id and me.department_id != unit.department_id:
        return jsonify(error="unit not offered by your department"), 400

    ex = Enrollment.query.filter_by(student_id=me.id, unit_id=unit.id).first()
    if ex:
        d = ex.to_dict()
        d["unit"] = {"id": unit.id, "code": unit.code, "title": unit.title}
        return jsonify(message="already enrolled", enrollment=d), 200

    en = Enrollment(student_id=me.id, unit_id=unit.id)
    db.session.add(en)
    db.session.commit()

    payload = en.to_dict()
    payload["unit"] = {"id": unit.id, "code": unit.code, "title": unit.title}
    return jsonify(message="enrolled", enrollment=payload), 201


@student_bp.delete("/enrollments/<int:enroll_id>")
@jwt_required()
@role_required("student")
def drop_enrollment(enroll_id: int):
    me = _me()
    if not me:
        return jsonify(error="unauthorized"), 401

    e = Enrollment.query.get_or_404(enroll_id)
    if e.student_id != me.id:
        return jsonify(error="not your enrollment"), 403

    db.session.delete(e)
    db.session.commit()
    return ("", 204)


@student_bp.delete("/enrollments")
@jwt_required()
@role_required("student")
def drop_enrollment_by_unit():
    me = _me()
    if not me:
        return jsonify(error="unauthorized"), 401

    unit_id = request.args.get("unit_id", type=int)
    if not unit_id:
        return jsonify(error="unit_id required"), 400

    e = Enrollment.query.filter_by(student_id=me.id, unit_id=unit_id).first()
    if not e:
        return jsonify(error="enrollment not found"), 404

    db.session.delete(e)
    db.session.commit()
    return ("", 204)


# ---------------------------
# Available Units (by year + semester)
# ---------------------------
@student_bp.get("/units/available")
@jwt_required()
@role_required("student")
def units_available():
    me = _me()
    if not me:
        return jsonify(error="unauthorized"), 401

    year_s = (request.args.get("year_level") or "").strip()
    sem_s = (request.args.get("semester") or "").strip()

    if not year_s or not sem_s:
        return jsonify(items=[]), 200

    try:
        year_level = int(year_s)
        semester = int(sem_s)
    except Exception:
        return jsonify(error="year_level and semester must be integers"), 400

    q = Unit.query
    q = q.filter(
        getattr(Unit, "year_level") == year_level,
        getattr(Unit, "semester") == semester,
    ).order_by(Unit.code.asc())

    units = q.all()

    enrolled_ids = {
        e.unit_id for e in Enrollment.query.filter_by(student_id=me.id).all()
    }

    items = []
    for u in units:
        if u.id in enrolled_ids:
            continue
        d = {
            "id": u.id,
            "code": u.code,
            "title": u.title,
            "credits": u.credits,
            "year_level": getattr(u, "year_level", None),
            "semester": getattr(u, "semester", None),
        }
        items.append({k: v for k, v in d.items() if v is not None})

    return jsonify(items=items), 200


# ---------------------------
# Published Grades (existing)
# ---------------------------
@student_bp.get("/grades")
@jwt_required()
@role_required("student")
def my_grades():
    me = _me()
    if not me:
        return jsonify(error="unauthorized"), 401

    enrollments = Enrollment.query.filter_by(student_id=me.id).all()
    unit_ids = [e.unit_id for e in enrollments]
    if not unit_ids:
        return jsonify(items=[]), 200

    assessments = (
        Assessment.query
        .filter(Assessment.unit_id.in_(unit_ids), Assessment.is_published == True)
        .order_by(Assessment.unit_id.asc(), Assessment.created_at.asc())
        .all()
    )

    grades = (
        Grade.query
        .filter(Grade.student_id == me.id, Grade.assessment_id.in_([a.id for a in assessments]))
        .all()
    )
    grade_by_assessment = {g.assessment_id: g for g in grades}

    by_unit = {}
    for a in assessments:
        by_unit.setdefault(a.unit_id, []).append(a)

    items = []
    units = {u.id: u for u in Unit.query.filter(Unit.id.in_(list(by_unit.keys()))).all()}

    for uid, arr in by_unit.items():
        u = units.get(uid)
        if not u:
            continue
        unit_block = {
            "unit": {"id": u.id, "code": u.code, "title": u.title},
            "assessments": [],
            "total_weight": 0.0,
            "total_score": 0.0,
        }
        tw = 0.0
        total_weighted_pct = 0.0

        for a in arr:
            g = grade_by_assessment.get(a.id)
            score = g.score if g is not None else None

            if score is not None and a.max_score:
                pct = (float(score) / float(a.max_score)) * 100.0
                total_weighted_pct += pct * float(a.weight or 0.0)
            tw += float(a.weight or 0.0)

            unit_block["assessments"].append({
                "id": a.id,
                "title": a.title,
                "max_score": a.max_score,
                "weight": a.weight,
                "is_published": a.is_published,
                "score": score,
            })

        unit_block["total_weight"] = round(tw, 4)
        unit_block["total_score"] = round(total_weighted_pct, 2)
        items.append(unit_block)

    return jsonify(items=items), 200


# ---------------------------
# NEW: Published Grades alias (so FE can call /student/grades/published)
# ---------------------------
@student_bp.get("/grades/published")     # ← ADDED
@jwt_required()                          # ← same guards; no behavior changes
@role_required("student")
def my_grades_published():
    # ADDED: delegate to the existing implementation to keep logic in one place
    return my_grades()
