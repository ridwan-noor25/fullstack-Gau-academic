from flask import Blueprint, jsonify, request
from sqlalchemy import select, delete
from app.extensions import db
from app.models import User, Department, Enrollment, Unit
from app.decorators import hod_required

bp = Blueprint("hod_students", __name__, url_prefix="/api/hod")


# -------------------------------------------------------------------
# Helper to fetch the current HoD’s department
# -------------------------------------------------------------------
def _my_department(hod_user_id: int) -> Department | None:
    return db.session.scalar(
        select(Department).where(Department.hod_user_id == hod_user_id)
    )


# -------------------------------------------------------------------
# Get all students in HoD’s department (direct + via enrollments)
# -------------------------------------------------------------------
@bp.get("/students")
@hod_required
def hod_department_students(me: User):
    dept = _my_department(me.id)
    if not dept:
        return jsonify({"error": "No department assigned to this HoD"}), 404

    students = (
        db.session.execute(
            select(User)
            .outerjoin(Enrollment, Enrollment.student_id == User.id)
            .outerjoin(Unit, Unit.id == Enrollment.unit_id)
            .where(User.role == "student")
            .where(
                (User.department_id == dept.id) | (Unit.department_id == dept.id)
            )
            .distinct()
        )
        .scalars()
        .all()
    )

    return jsonify({"items": [s.to_dict() for s in students]})


# -------------------------------------------------------------------
# Get all students enrolled in a specific unit
# -------------------------------------------------------------------
@bp.get("/units/<int:unit_id>/students")
@hod_required
def hod_unit_students(me: User, unit_id: int):
    dept = _my_department(me.id)
    if not dept:
        return jsonify({"error": "No department assigned to this HoD"}), 404

    unit = db.session.get(Unit, unit_id)
    if not unit or unit.department_id != dept.id:
        return jsonify({"error": "Unit not found in your department"}), 404

    enrollments = (
        db.session.execute(
            select(Enrollment).where(Enrollment.unit_id == unit_id)
        )
        .scalars()
        .all()
    )

    data = []
    for e in enrollments:
        if e.student:
            data.append({
                "enrollment_id": e.id,
                "student": e.student.to_dict()
            })

    return jsonify({"items": data})


# -------------------------------------------------------------------
# Unenroll a student from a unit
# -------------------------------------------------------------------
@bp.delete("/units/<int:unit_id>/students/<int:student_id>")
@hod_required
def unenroll_student(me: User, unit_id: int, student_id: int):
    dept = _my_department(me.id)
    if not dept:
        return jsonify({"error": "No department assigned to this HoD"}), 404

    unit = db.session.get(Unit, unit_id)
    if not unit or unit.department_id != dept.id:
        return jsonify({"error": "Unit not found in your department"}), 404

    stmt = (
        delete(Enrollment)
        .where(Enrollment.unit_id == unit_id)
        .where(Enrollment.student_id == student_id)
    )
    result = db.session.execute(stmt)
    if result.rowcount == 0:
        return jsonify({"error": "Enrollment not found"}), 404

    db.session.commit()
    return jsonify({"status": "success", "message": "Student unenrolled"})


# -------------------------------------------------------------------
# Deactivate or hard delete a student
# -------------------------------------------------------------------
@bp.delete("/students/<int:student_id>")
@hod_required
def delete_student(me: User, student_id: int):
    dept = _my_department(me.id)
    if not dept:
        return jsonify({"error": "No department assigned to this HoD"}), 404

    student = db.session.get(User, student_id)
    if not student or student.role != "student":
        return jsonify({"error": "Student not found"}), 404

    if not (
        student.department_id == dept.id
        or any(e.unit.department_id == dept.id for e in student.enrollments)
    ):
        return jsonify({"error": "Student not found in your department"}), 404

    mode = request.args.get("mode", "soft")
    if mode == "hard":
        db.session.delete(student)
    else:
        if not hasattr(student, "is_active"):
            return jsonify({"error": "Soft delete not supported (missing is_active field)"}), 400
        student.is_active = False

    db.session.commit()
    return jsonify({"status": "success", "message": f"Student {mode}-deleted"})


# -------------------------------------------------------------------
# Expose Blueprint for __init__.py
# -------------------------------------------------------------------
hod_students_bp = bp
