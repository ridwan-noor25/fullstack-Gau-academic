# app/lecturer.py
from __future__ import annotations
from datetime import datetime
from typing import Optional

from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import desc

from .decorators import role_required  # includes jwt check
from .extensions import db
from .models import (
    User,
    Unit,
    Enrollment,
    Assessment,
    Grade,
    TeachingAssignment,
    MissingMarkReport,
)

lecturer_bp = Blueprint("lecturer", __name__)

# Allow local Vite dev origins
CORS_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173"]


def current_user() -> Optional[User]:
    uid = get_jwt_identity()
    try:
        return User.query.get(int(uid)) if uid is not None else None
    except Exception:
        return None


# ---------- Me ----------
@lecturer_bp.get("/me")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def me():
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404
    return jsonify(user=u.to_dict()), 200


# ---------- My Units ----------
@lecturer_bp.get("/units")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def my_units():
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    units = (
        Unit.query.join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(TeachingAssignment.lecturer_id == u.id)
        .order_by(Unit.code)
        .all()
    )
    return jsonify(items=[x.to_dict() for x in units]), 200


# ---------- Students of a Unit ----------
@lecturer_bp.get("/units/<int:unit_id>/students")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def unit_students(unit_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    # Get study mode filter from query parameters
    study_mode = request.args.get("study_mode", "").strip().lower()
    
    # ensure this unit is taught by the current lecturer
    unit = (
        Unit.query.join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Unit.id == unit_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not unit:
        return jsonify(error="unit not found or not yours"), 404

    # JOIN Enrollment -> User to fetch student fields used by the UI
    query = (
        db.session.query(
            Enrollment.id.label("enroll_id"),
            User.id.label("student_id"),
            User.name.label("student_name"),
            User.reg_number.label("reg_number"),
            User.email.label("email"),
            User.program.label("program"),
            User.study_mode.label("study_mode"),
            User.academic_year.label("academic_year"),
        )
        .join(User, User.id == Enrollment.student_id)
        .filter(Enrollment.unit_id == unit.id)
    )
    
    # Apply study mode filter if provided
    if study_mode and study_mode in ["full-time", "part-time", "weekend"]:
        query = query.filter(User.study_mode.ilike(f"%{study_mode}%"))
    
    rows = query.order_by(User.name.asc()).all()

    def map_row(r):
        name = (r.student_name or "").strip()
        email = (r.email or "").strip()
        if not name and email:
            name = email.split("@", 1)[0]

        reg_val = (r.reg_number or "").strip()

        return {
            "id": r.enroll_id,
            "student_id": r.student_id,
            "student": {
                "id": r.student_id,
                "name": name,
                "reg_number": reg_val,
                "email": email,
                "program": r.program or "",
                "study_mode": r.study_mode or "",
                "academic_year": r.academic_year,
            },
            "name": name,
            "student_name": name,
            "reg_number": reg_val,
            "regNo": reg_val,
            "reg_no": reg_val,
            "email": email,
            "program": r.program or "",
            "study_mode": r.study_mode or "",
            "academic_year": r.academic_year,
        }

    items = [map_row(r) for r in rows]
    
    # Add summary statistics for study modes
    study_mode_stats = {}
    for item in items:
        mode = item.get("study_mode", "unknown").lower()
        study_mode_stats[mode] = study_mode_stats.get(mode, 0) + 1
    
    response_data = {
        "items": items, 
        "count": len(items),
        "study_mode_filter": study_mode if study_mode else "all",
        "study_mode_stats": study_mode_stats,
        "available_study_modes": ["full-time", "part-time", "weekend"]
    }
    
    return jsonify(response_data), 200


# ---------- Assessments ----------
@lecturer_bp.get("/units/<int:unit_id>/assessments")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def list_assessments(unit_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    unit = (
        Unit.query.join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Unit.id == unit_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not unit:
        return jsonify(error="unit not found or not yours"), 404

    ass = (
        Assessment.query.filter_by(unit_id=unit.id)
        .order_by(Assessment.id.asc())
        .all()
    )
    return jsonify(items=[a.to_dict() for a in ass]), 200


@lecturer_bp.post("/units/<int:unit_id>/assessments")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def create_assessment(unit_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    unit = (
        Unit.query.join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Unit.id == unit_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not unit:
        return jsonify(error="unit not found or not yours"), 404

    data = request.get_json(force=True) or {}
    title = (data.get("title") or "").strip()
    weight = float(data.get("weight") or 0)
    max_score = float(data.get("max_score") or 100)
    due_at = data.get("due_at")
    study_mode = (data.get("study_mode") or "").strip() or None

    if not title:
        return jsonify(error="title required"), 400

    # Validate study_mode if provided
    valid_study_modes = ['full-time', 'part-time', 'weekend']
    if study_mode and study_mode not in valid_study_modes:
        return jsonify(error=f"invalid study_mode, must be one of: {valid_study_modes}"), 400

    total_weight = (
        db.session.query(db.func.coalesce(db.func.sum(Assessment.weight), 0))
        .filter(Assessment.unit_id == unit.id)
        .scalar()
    )
    if total_weight + weight > 100.0 + 1e-6:
        return jsonify(error=f"total weight would exceed 100 (current={total_weight})"), 400

    a = Assessment(
        unit_id=unit.id,
        title=title,
        weight=weight,
        max_score=max_score,
        due_at=datetime.fromisoformat(due_at) if due_at else None,
        study_mode=study_mode,
    )
    db.session.add(a)
    db.session.commit()
    return jsonify(data=a.to_dict()), 201


@lecturer_bp.patch("/assessments/<int:ass_id>")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def update_assessment(ass_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    a = (
        Assessment.query.join(Unit, Unit.id == Assessment.unit_id)
        .join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Assessment.id == ass_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not a:
        return jsonify(error="assessment not found or not yours"), 404

    data = request.get_json(force=True) or {}

    if "title" in data:
        new_title = (data["title"] or "").strip()
        if new_title:
            a.title = new_title

    if "weight" in data:
        new_weight = float(data["weight"] or 0)
        total_other = (
            db.session.query(db.func.coalesce(db.func.sum(Assessment.weight), 0))
            .filter(Assessment.unit_id == a.unit_id, Assessment.id != a.id)
            .scalar()
        )
        if total_other + new_weight > 100.0 + 1e-6:
            return jsonify(error=f"total weight would exceed 100 (proposed total={total_other + new_weight})"), 400
        a.weight = new_weight

    if "max_score" in data:
        a.max_score = float(data["max_score"] or 100)

    if "due_at" in data:
        val = data["due_at"]
        a.due_at = datetime.fromisoformat(val) if val else None

    if "is_published" in data:
        a.is_published = bool(data["is_published"])

    db.session.commit()
    return jsonify(data=a.to_dict()), 200


@lecturer_bp.delete("/assessments/<int:ass_id>")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def delete_assessment(ass_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    a = (
        Assessment.query.join(Unit, Unit.id == Assessment.unit_id)
        .join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Assessment.id == ass_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not a:
        return jsonify(error="assessment not found or not yours"), 404

    db.session.delete(a)
    db.session.commit()
    return ("", 204)


# ---------- Grades ----------
@lecturer_bp.get("/units/<int:unit_id>/grades")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def unit_grades(unit_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    unit = (
        Unit.query.join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Unit.id == unit_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not unit:
        return jsonify(error="unit not found or not yours"), 404

    assessments = Assessment.query.filter_by(unit_id=unit.id).all()
    result = []
    for a in assessments:
        rows = []
        for g in Grade.query.filter_by(assessment_id=a.id).all():
            student = getattr(g, "student", None)
            name = (student.name or "").strip() if student and getattr(student, "name", None) else "Unknown"
            reg_val = (student.reg_number or "").strip() if student and getattr(student, "reg_number", None) else ""

            rows.append({
                "id": g.id,
                "student_id": g.student_id,
                "student_name": name,
                "name": name,
                "student": {
                    "id": g.student_id,
                    "name": name,
                    "reg_number": reg_val,
                    "email": student.email if student and getattr(student, "email", None) else "",
                },
                "reg_number": reg_val,
                "regNo": reg_val,
                "reg_no": reg_val,
                "score": g.score,
            })
        result.append({"assessment": a.to_dict(), "grades": rows})
    return jsonify(items=result), 200


@lecturer_bp.post("/assessments/<int:ass_id>/grades")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def upsert_grades_bulk(ass_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    a = (
        Assessment.query.join(Unit, Unit.id == Assessment.unit_id)
        .join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Assessment.id == ass_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not a:
        return jsonify(error="assessment not found or not yours"), 404

    data = request.get_json(force=True) or {}

    # Accept either { "grades": [...] } or a raw list [...]
    if isinstance(data, list):
        rows = data
    elif isinstance(data, dict):
        rows = data.get("grades")
    else:
        rows = None

    if not isinstance(rows, list):
        return jsonify(error="grades must be a list of {student_id, score}"), 400

    created, updated = 0, 0
    for row in rows:
        sid_raw = row.get("student_id")
        try:
            sid = int(sid_raw) if sid_raw is not None else None
        except Exception:
            return jsonify(error=f"invalid student_id: {sid_raw}"), 400

        try:
            score = float(row.get("score") or 0)
        except Exception:
            return jsonify(error=f"invalid score for student_id={sid}"), 400

        if sid is None:
            return jsonify(error="student_id required for each grade row"), 400

        if score < 0 or score > a.max_score:
            return jsonify(error=f"score out of range 0..{a.max_score} for student_id={sid}"), 400

        g = Grade.query.filter_by(assessment_id=a.id, student_id=sid).first()
        if g:
            g.score = score
            updated += 1
        else:
            g = Grade(assessment_id=a.id, student_id=sid, score=score)
            db.session.add(g)
            created += 1

    db.session.commit()

    # return enriched grades
    enriched = []
    for g in Grade.query.filter_by(assessment_id=a.id).all():
        student = getattr(g, "student", None)
        name = (student.name or "").strip() if student and getattr(student, "name", None) else "Unknown"
        reg_val = (student.reg_number or "").strip() if student and getattr(student, "reg_number", None) else ""
        enriched.append({
            "id": g.id,
            "student_id": g.student_id,
            "student_name": name,
            "name": name,
            "student": {
                "id": g.student_id,
                "name": name,
                "reg_number": reg_val,
                "email": student.email if student and getattr(student, "email", None) else "",
            },
            "reg_number": reg_val,
            "regNo": reg_val,
            "reg_no": reg_val,
            "score": g.score,
        })

    return jsonify(
        message="grades upserted",
        created=created,
        updated=updated,
        grades=enriched,
    ), 200


@lecturer_bp.patch("/grades/<int:grade_id>")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def update_grade(grade_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    g = (
        Grade.query.join(Assessment, Assessment.id == Grade.assessment_id)
        .join(Unit, Unit.id == Assessment.unit_id)
        .join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Grade.id == grade_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not g:
        return jsonify(error="grade not found or not yours"), 404

    data = request.get_json(force=True) or {}
    if "score" in data:
        try:
            new_score = float(data["score"] or 0)
        except Exception:
            return jsonify(error="invalid score"), 400
        if new_score < 0 or new_score > g.assessment.max_score:
            return jsonify(error=f"score out of range 0..{g.assessment.max_score}"), 400
        g.score = new_score

    db.session.commit()

    student = getattr(g, "student", None)
    name = (student.name or "").strip() if student and getattr(student, "name", None) else "Unknown"
    reg_val = (student.reg_number or "").strip() if student and getattr(student, "reg_number", None) else ""

    return jsonify(data={
        "id": g.id,
        "student_id": g.student_id,
        "student_name": name,
        "name": name,
        "student": {
            "id": g.student_id,
            "name": name,
            "reg_number": reg_val,
            "email": student.email if student and getattr(student, "email", None) else "",
        },
        "reg_number": reg_val,
        "regNo": reg_val,
        "reg_no": reg_val,
        "score": g.score,
    }), 200


# ---------- Publish ----------
@lecturer_bp.post("/units/<int:unit_id>/publish")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def publish_unit(unit_id: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    unit = (
        Unit.query.join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Unit.id == unit_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not unit:
        return jsonify(error="unit not found or not yours"), 404

    for a in unit.assessments:
        a.is_published = True

    db.session.commit()
    return jsonify(message="unit assessments published"), 200


# ---------- Missing Reports ----------
@lecturer_bp.get("/missing-reports")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def list_missing_reports():
    """
    Returns enriched rows so the UI can show Student, Reg No, Unit, Message.
    Provides multiple key aliases (student/student_name/name, reg_no/regNo/reg_number).
    """
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    unit_ids = [
        ta.unit_id
        for ta in TeachingAssignment.query.filter_by(lecturer_id=u.id).all()
    ]
    if not unit_ids:
        return jsonify(items=[]), 200

    rows = (
        db.session.query(
            MissingMarkReport.id.label("report_id"),
            MissingMarkReport.status,
            MissingMarkReport.message,
            MissingMarkReport.description,
            MissingMarkReport.created_at,
            User.id.label("student_id"),
            User.name.label("student_name"),
            User.reg_number.label("reg_number"),
            User.email.label("student_email"),
            Unit.id.label("unit_id"),
            Unit.code.label("unit_code"),
            Unit.title.label("unit_title"),
        )
        .join(User, User.id == MissingMarkReport.student_id)
        .join(Unit, Unit.id == MissingMarkReport.unit_id)
        .filter(MissingMarkReport.unit_id.in_(unit_ids))
        .order_by(desc(MissingMarkReport.created_at))
        .all()
    )

    def map_row(r):
        name = (r.student_name or "").strip()
        if not name and r.student_email:
            name = r.student_email.split("@", 1)[0]

        reg_val = (r.reg_number or "").strip()
        unit_label = (r.unit_code or r.unit_title or "").strip()
        msg = (r.message or r.description or "").strip()

        return {
            "id": r.report_id,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "student": name,
            "student_name": name,
            "name": name,
            "reg_number": reg_val,
            "regNo": reg_val,
            "reg_no": reg_val,
            "unit": unit_label,
            "unit_id": r.unit_id,
            "unit_code": r.unit_code or "",
            "unit_title": r.unit_title or "",
            "message": msg,
            "student_id": r.student_id,
            "student_email": r.student_email or "",
            "description": r.description or "",
        }

    return jsonify(items=[map_row(r) for r in rows]), 200


@lecturer_bp.patch("/missing-reports/<int:rid>")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def update_missing_report(rid: int):
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    m = (
        MissingMarkReport.query
        .join(Unit, Unit.id == MissingMarkReport.unit_id)
        .join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(MissingMarkReport.id == rid, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not m:
        return jsonify(error="report not found or not yours"), 404

    data = request.get_json(force=True) or {}
    if "status" in data:
        val = str(data["status"]).strip()
        if val not in ("Pending", "Seen", "Resolved"):
            return jsonify(error="invalid status"), 400
        m.status = val
    if "lecturer_note" in data:
        m.lecturer_note = str(data["lecturer_note"] or "")

    db.session.commit()
    return jsonify(data=m.to_dict()), 200
