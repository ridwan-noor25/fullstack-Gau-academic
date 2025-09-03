# app/lecturer.py
from __future__ import annotations
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .decorators import role_required
from .extensions import db
from .models import User, Unit, Enrollment, Assessment, Grade, MissingReport

lecturer_bp = Blueprint("lecturer", __name__)

def current_user() -> User | None:
    uid = get_jwt_identity()
    if not uid:
        return None
    # identity stored as string in your auth.py
    return User.query.get(int(uid))

# ---------- Me ----------
@lecturer_bp.get("/me")
@jwt_required()
@role_required("lecturer")
def me():
    u = current_user()
    if not u:
        return jsonify(error="user not found"), 404
    return jsonify(user=u.to_dict()), 200

# ---------- My Units ----------
@lecturer_bp.get("/units")
@jwt_required()
@role_required("lecturer")
def my_units():
    u = current_user()
    units = Unit.query.filter_by(lecturer_id=u.id).order_by(Unit.code).all()
    return jsonify(items=[x.to_dict() for x in units]), 200

# ---------- Students of a Unit ----------
@lecturer_bp.get("/units/<int:unit_id>/students")
@jwt_required()
@role_required("lecturer")
def unit_students(unit_id: int):
    u = current_user()
    unit = Unit.query.filter_by(id=unit_id, lecturer_id=u.id).first()
    if not unit:
        return jsonify(error="unit not found or not yours"), 404
    enrolls = Enrollment.query.filter_by(unit_id=unit.id).all()
    return jsonify(items=[e.to_dict() for e in enrolls]), 200

# ---------- Assessments ----------
@lecturer_bp.get("/units/<int:unit_id>/assessments")
@jwt_required()
@role_required("lecturer")
def list_assessments(unit_id: int):
    u = current_user()
    unit = Unit.query.filter_by(id=unit_id, lecturer_id=u.id).first()
    if not unit:
        return jsonify(error="unit not found or not yours"), 404
    ass = Assessment.query.filter_by(unit_id=unit.id).order_by(Assessment.id.asc()).all()
    return jsonify(items=[a.to_dict() for a in ass]), 200

@lecturer_bp.post("/units/<int:unit_id>/assessments")
@jwt_required()
@role_required("lecturer")
def create_assessment(unit_id: int):
    u = current_user()
    unit = Unit.query.filter_by(id=unit_id, lecturer_id=u.id).first()
    if not unit:
        return jsonify(error="unit not found or not yours"), 404

    data = request.get_json(force=True) or {}
    title = (data.get("title") or "").strip()
    weight = float(data.get("weight") or 0)
    max_score = float(data.get("max_score") or 100)
    due_at = data.get("due_at")
    if not title:
        return jsonify(error="title required"), 400

    # weight sanity: total <= 100
    total_weight = (
        db.session.query(db.func.coalesce(db.func.sum(Assessment.weight), 0))
        .filter(Assessment.unit_id == unit.id).scalar()
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
@jwt_required()
@role_required("lecturer")
def update_assessment(ass_id: int):
    u = current_user()
    a = (Assessment.query.join(Unit, Unit.id == Assessment.unit_id)
         .filter(Assessment.id == ass_id, Unit.lecturer_id == u.id).first())
    if not a:
        return jsonify(error="assessment not found or not yours"), 404

    data = request.get_json(force=True) or {}
    if "title" in data:
        a.title = (data["title"] or "").strip() or a.title
    if "weight" in data:
        new_weight = float(data["weight"] or 0)
        # recompute total with replacement
        total = (
            db.session.query(db.func.coalesce(db.func.sum(Assessment.weight), 0))
            .filter(Assessment.unit_id == a.unit_id, Assessment.id != a.id).scalar()
        ) + new_weight
        if total > 100.0 + 1e-6:
            return jsonify(error=f"total weight would exceed 100 (proposed total={total})"), 400
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
@jwt_required()
@role_required("lecturer")
def delete_assessment(ass_id: int):
    u = current_user()
    a = (Assessment.query.join(Unit, Unit.id == Assessment.unit_id)
         .filter(Assessment.id == ass_id, Unit.lecturer_id == u.id).first())
    if not a:
        return jsonify(error="assessment not found or not yours"), 404
    db.session.delete(a)
    db.session.commit()
    return ("", 204)

# ---------- Grades ----------
@lecturer_bp.get("/units/<int:unit_id>/grades")
@jwt_required()
@role_required("lecturer")
def unit_grades(unit_id: int):
    u = current_user()
    unit = Unit.query.filter_by(id=unit_id, lecturer_id=u.id).first()
    if not unit:
        return jsonify(error="unit not found or not yours"), 404

    # return as {assessment: {...}, grades: [...]}
    assessments = Assessment.query.filter_by(unit_id=unit.id).all()
    result = []
    for a in assessments:
        grades = Grade.query.filter_by(assessment_id=a.id).all()
        result.append({
            "assessment": a.to_dict(),
            "grades": [g.to_dict() for g in grades]
        })
    return jsonify(items=result), 200

@lecturer_bp.post("/assessments/<int:ass_id>/grades")
@jwt_required()
@role_required("lecturer")
def upsert_grades_bulk(ass_id: int):
    u = current_user()
    a = (Assessment.query.join(Unit, Unit.id == Assessment.unit_id)
         .filter(Assessment.id == ass_id, Unit.lecturer_id == u.id).first())
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
@jwt_required()
@role_required("lecturer")
def update_grade(grade_id: int):
    u = current_user()
    g = (Grade.query.join(Assessment, Assessment.id == Grade.assessment_id)
         .join(Unit, Unit.id == Assessment.unit_id)
         .filter(Grade.id == grade_id, Unit.lecturer_id == u.id).first())
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

# ---------- Publish (simple toggle) ----------
@lecturer_bp.post("/units/<int:unit_id>/publish")
@jwt_required()
@role_required("lecturer")
def publish_unit(unit_id: int):
    u = current_user()
    unit = Unit.query.filter_by(id=unit_id, lecturer_id=u.id).first()
    if not unit:
        return jsonify(error="unit not found or not yours"), 404
    for a in unit.assessments.all():
        a.is_published = True
    db.session.commit()
    return jsonify(message="unit assessments published"), 200

# ---------- Missing Reports (from students) ----------
@lecturer_bp.get("/missing-reports")
@jwt_required()
@role_required("lecturer")
def list_missing_reports():
    u = current_user()
    # Only for units owned by this lecturer
    unit_ids = [r.id for r in Unit.query.filter_by(lecturer_id=u.id).all()]
    q = MissingReport.query.filter(MissingReport.unit_id.in_(unit_ids)).order_by(MissingReport.created_at.desc())
    return jsonify(items=[m.to_dict() for m in q.all()]), 200

@lecturer_bp.patch("/missing-reports/<int:rid>")
@jwt_required()
@role_required("lecturer")
def update_missing_report(rid: int):
    u = current_user()
    m = (MissingReport.query.join(Unit, Unit.id == MissingReport.unit_id)
         .filter(MissingReport.id == rid, Unit.lecturer_id == u.id).first())
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
