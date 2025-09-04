# app/lecturer.py
from __future__ import annotations
from datetime import datetime
from typing import Optional

from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import get_jwt_identity

from .decorators import role_required  # includes jwt check
from .extensions import db
from .models import (
    User,
    Unit,
    Enrollment,
    Assessment,
    Grade,
    TeachingAssignment,       # <-- use TA instead of Unit.lecturer_id
    MissingMarkReport,        # <-- correct class name in your merged models
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

    unit = (
        Unit.query.join(TeachingAssignment, TeachingAssignment.unit_id == Unit.id)
        .filter(Unit.id == unit_id, TeachingAssignment.lecturer_id == u.id)
        .first()
    )
    if not unit:
        return jsonify(error="unit not found or not yours"), 404

    enrolls = Enrollment.query.filter_by(unit_id=unit.id).all()
    return jsonify(items=[e.to_dict() for e in enrolls]), 200


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

    if not title:
        return jsonify(error="title required"), 400

    # total weight sanity check (<= 100)
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
        grades = Grade.query.filter_by(assessment_id=a.id).all()
        result.append({"assessment": a.to_dict(), "grades": [g.to_dict() for g in grades]})
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
    rows = data.get("grades")
    if not isinstance(rows, list):
        return jsonify(error="grades must be a list of {student_id, score}"), 400

    created, updated = 0, 0
    for row in rows:
        sid = row.get("student_id")
        score = float(row.get("score") or 0)
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
    return jsonify(message="grades upserted", created=created, updated=updated), 200


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
        new_score = float(data["score"] or 0)
        if new_score < 0 or new_score > g.assessment.max_score:
            return jsonify(error=f"score out of range 0..{g.assessment.max_score}"), 400
        g.score = new_score

    db.session.commit()
    return jsonify(data=g.to_dict()), 200


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

    # unit.assessments is a list (lazy="selectin"), not a Query
    for a in unit.assessments:
        a.is_published = True

    db.session.commit()
    return jsonify(message="unit assessments published"), 200


# ---------- Missing Reports ----------
@lecturer_bp.get("/missing-reports")
@cross_origin(origins=CORS_ORIGINS, supports_credentials=True)
@role_required("lecturer")
def list_missing_reports():
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404

    unit_ids = [
        ta.unit_id
        for ta in TeachingAssignment.query.filter_by(lecturer_id=u.id).all()
    ]
    q = (
        MissingMarkReport.query
        .filter(MissingMarkReport.unit_id.in_(unit_ids))
        .order_by(MissingMarkReport.created_at.desc())
    )
    return jsonify(items=[m.to_dict() for m in q.all()]), 200


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
