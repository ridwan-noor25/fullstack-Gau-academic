# app/routes.py
from flask import Blueprint, request, jsonify
from sqlalchemy import func
from flask_jwt_extended import jwt_required, get_jwt_identity
from .extensions import db
from .decorators import role_required
from .models import (
    User, Department, Unit, TeachingAssignment, Enrollment,
    Assessment, Grade, MissingMarkReport
)

api_bp = Blueprint("api", __name__)

# ---------- Admin & HoD: Departments, Units, Assignments, Enrollment ----------
@api_bp.post("/departments")
@role_required("admin")
def create_department():
    data = request.get_json(force=True)
    
    # Enhanced department creation with school and program support
    d = Department(
        name=data["name"].strip(),
        code=data["code"].strip(),
        hod_user_id=data.get("hod_user_id"),
        school_id=data.get("school_id"),
        program_id=data.get("program_id"),
        department_type=data.get("department_type", "overall"),
    )
    
    db.session.add(d)
    db.session.commit()
    return jsonify(d.to_dict()), 201


@api_bp.get("/departments")
@jwt_required()
def list_departments():
    rows = Department.query.order_by(Department.name).all()
    return jsonify([r.to_dict() for r in rows]), 200


@api_bp.post("/units")
@role_required("admin", "hod")
def create_unit():
    data = request.get_json(force=True)
    u = Unit(
        code=data["code"].strip(),
        title=data["title"].strip(),
        credits=int(data.get("credits", 3)),
        department_id=int(data["department_id"]),
    )
    db.session.add(u)
    db.session.commit()
    return jsonify(u.to_dict()), 201


@api_bp.post("/assignments")
@role_required("hod")
def assign_lecturer_to_unit():
    data = request.get_json(force=True)
    lecturer_id = int(data["lecturer_id"])
    unit_id = int(data["unit_id"])

    lec = User.query.get(lecturer_id)
    if not lec or lec.role != "lecturer":
        return jsonify({"error": "lecturer not found"}), 404
    unit = Unit.query.get(unit_id)
    if not unit:
        return jsonify({"error": "unit not found"}), 404

    ta = TeachingAssignment(unit_id=unit_id, lecturer_id=lecturer_id)
    db.session.add(ta)
    db.session.commit()
    return jsonify(ta.to_dict()), 201


@api_bp.post("/enrollments")
@role_required("admin", "hod")
def enroll_student():
    data = request.get_json(force=True)
    student_id = int(data["student_id"])
    unit_id = int(data["unit_id"])
    student = User.query.get(student_id)
    if not student or student.role != "student":
        return jsonify({"error": "student not found"}), 404
    if not Unit.query.get(unit_id):
        return jsonify({"error": "unit not found"}), 404

    e = Enrollment(student_id=student_id, unit_id=unit_id)
    db.session.add(e)
    db.session.commit()
    return jsonify(e.to_dict()), 201


# ---------- Lecturer: Assessments & Grades ----------
@api_bp.post("/assessments")
@role_required("lecturer")
def create_assessment():
    data = request.get_json(force=True)
    unit_id = int(data["unit_id"])
    title = data["title"].strip()
    max_score = float(data.get("max_score", 100.0))
    weight = float(data.get("weight", 1.0))
    lecturer_id = get_jwt_identity()

    # Optional: ensure lecturer teaches this unit
    teaches = TeachingAssignment.query.filter_by(
        unit_id=unit_id, lecturer_id=lecturer_id
    ).first()
    if not teaches:
        return jsonify({"error": "you are not assigned to this unit"}), 403

    # Enforce total weight ≤ 1.0
    total_weight = (
        db.session.query(func.coalesce(func.sum(Assessment.weight), 0.0))
        .filter_by(unit_id=unit_id)
        .scalar()
    )
    if total_weight + weight > 1.0 + 1e-6:
        return jsonify({"error": "total weight would exceed 1.0 for this unit"}), 400

    a = Assessment(
        unit_id=unit_id,
        title=title,
        max_score=max_score,
        weight=weight,
        created_by=lecturer_id,
    )
    db.session.add(a)
    db.session.commit()
    return jsonify(a.to_dict()), 201


@api_bp.post("/grades")
@role_required("lecturer")
def upsert_grade():
    data = request.get_json(force=True)
    assessment_id = int(data["assessment_id"])
    student_id = int(data["student_id"])
    score = float(data["score"])
    entered_by = get_jwt_identity()

    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "assessment not found"}), 404

    # Ensure student is enrolled in the assessment's unit
    if not Enrollment.query.filter_by(
        student_id=student_id, unit_id=assessment.unit_id
    ).first():
        return jsonify({"error": "student not enrolled in unit"}), 400

    g = Grade.query.filter_by(
        assessment_id=assessment_id, student_id=student_id
    ).first()
    if g:
        g.score = score
        g.entered_by = entered_by
        g.status = "draft"
    else:
        g = Grade(
            assessment_id=assessment_id,
            student_id=student_id,
            score=score,
            entered_by=entered_by,
            status="draft",
        )
        db.session.add(g)

    db.session.commit()
    return jsonify(g.to_dict()), 201


@api_bp.post("/grades/submit")
@role_required("lecturer")
def submit_grades_for_assessment():
    data = request.get_json(force=True)
    assessment_id = int(data["assessment_id"])
    count = Grade.query.filter_by(assessment_id=assessment_id).update(
        {Grade.status: "submitted"}
    )
    db.session.commit()
    return jsonify({"updated": count}), 200


# ---------- HoD/Admin: Review, Approve, Publish ----------
@api_bp.get("/grades/pending")
@role_required("hod")
def list_pending_grades():
    rows = Grade.query.filter_by(status="submitted").all()
    return jsonify([g.to_dict() for g in rows]), 200


@api_bp.post("/grades/<int:grade_id>/approve")
@role_required("hod")
def approve_grade(grade_id):
    g = Grade.query.get(grade_id)
    if not g:
        return jsonify({"error": "grade not found"}), 404
    g.status = "approved"
    g.approved_by = get_jwt_identity()
    db.session.commit()
    return jsonify(g.to_dict()), 200


@api_bp.post("/units/<int:unit_id>/publish")
@role_required("hod", "admin")
def publish_unit(unit_id):
    assessment_ids = [a.id for a in Assessment.query.filter_by(unit_id=unit_id).all()]
    if not assessment_ids:
        return jsonify({"error": "no assessments in unit"}), 400
    q = Grade.query.filter(
        Grade.assessment_id.in_(assessment_ids), Grade.status == "approved"
    )
    count = q.update({Grade.status: "published"}, synchronize_session=False)
    db.session.commit()
    return jsonify({"published": count}), 200


# ---------- Student: Views & Missing Mark Reports ----------
@api_bp.get("/my/grades")
@role_required("student")
def my_grades():
    me = get_jwt_identity()
    rows = (
        db.session.query(Grade, Assessment, Unit)
        .join(Assessment, Grade.assessment_id == Assessment.id)
        .join(Unit, Assessment.unit_id == Unit.id)
        .filter(Grade.student_id == me)
        .all()
    )
    result = []
    for g, a, u in rows:
        result.append(
            {
                "unit": {
                    "id": u.id,
                    "code": u.code,
                    "title": u.title,
                    "credits": u.credits,
                },
                "assessment": {
                    "id": a.id,
                    "title": a.title,
                    "weight": a.weight,
                    "max_score": a.max_score,
                },
                "grade": {"id": g.id, "score": g.score, "status": g.status},
            }
        )
    return jsonify(result), 200


@api_bp.post("/reports/missing")
@role_required("student")
def report_missing_mark():
    me = get_jwt_identity()
    data = request.get_json(force=True)
    unit_id = int(data["unit_id"])
    description = data.get("description", "").strip()

    if not Enrollment.query.filter_by(student_id=me, unit_id=unit_id).first():
        return jsonify({"error": "not enrolled in unit"}), 400

    r = MissingMarkReport(student_id=me, unit_id=unit_id, description=description)
    db.session.add(r)
    db.session.commit()
    return jsonify(r.to_dict()), 201


@api_bp.get("/reports/missing")
@role_required("hod", "admin")
def list_missing_reports():
    rows = MissingMarkReport.query.order_by(MissingMarkReport.created_at.desc()).all()
    return jsonify([r.to_dict() for r in rows]), 200


# ---------- Utilities ----------
@api_bp.get("/units/<int:unit_id>/finals/<int:student_id>")
@jwt_required()
def compute_final_for_student(unit_id, student_id):
    rows = (
        db.session.query(Grade.score, Assessment.weight, Assessment.max_score)
        .join(Assessment, Grade.assessment_id == Assessment.id)
        .filter(Assessment.unit_id == unit_id, Grade.student_id == student_id)
        .all()
    )
    total = 0.0
    for score, weight, max_score in rows:
        pct = (score / max_score) if max_score else 0.0
        total += pct * weight * 100.0

    def letter_and_point(t):
        if t >= 70:
            return "A", 4.0
        if t >= 60:
            return "B", 3.0
        if t >= 50:
            return "C", 2.0
        if t >= 40:
            return "D", 1.0
        return "E", 0.0

    letter, gp = letter_and_point(total)
    return (
        jsonify(
            {
                "unit_id": unit_id,
                "student_id": student_id,
                "total": round(total, 2),
                "letter": letter,
                "grade_point": gp,
            }
        ),
        200,
    )
