from flask import Blueprint, jsonify, request
from sqlalchemy import select, delete
from app.extensions import db
from app.models import User, Department, Enrollment, Unit, Program, School
from app.decorators import hod_required

bp = Blueprint("hod_students", __name__, url_prefix="/api/hod")


# -------------------------------------------------------------------
# Helper to fetch the current HoD's department and program
# -------------------------------------------------------------------
def _my_department(hod_user_id: int) -> Department | None:
    return db.session.scalar(
        select(Department).where(Department.hod_user_id == hod_user_id)
    )

def _my_program(hod_user_id: int) -> Program | None:
    return db.session.scalar(
        select(Program).where(Program.hod_user_id == hod_user_id)
    )


# -------------------------------------------------------------------
# Get all students under HoD's supervision (department, program, or both)
# -------------------------------------------------------------------
@bp.get("/students")
@hod_required
def hod_department_students(me: User):
    dept = _my_department(me.id)
    program = _my_program(me.id)
    
    if not dept and not program:
        return jsonify({"error": "No department or program assigned to this HoD"}), 404

    # Build query conditions based on what the HOD is responsible for
    conditions = []
    
    if dept:
        # Students directly assigned to this department
        conditions.append(User.department_id == dept.id)
        
        # Students enrolled in units from this department
        unit_condition = (
            select(Unit.id)
            .where(Unit.department_id == dept.id)
        )
        enrollment_condition = (
            select(Enrollment.student_id)
            .where(Enrollment.unit_id.in_(unit_condition))
        )
        conditions.append(User.id.in_(enrollment_condition))
    
    if program:
        # Students enrolled in this specific program
        conditions.append(User.program_id == program.id)
    
    # Combine conditions with OR
    from sqlalchemy import or_
    final_condition = or_(*conditions) if conditions else False
    
    students = (
        db.session.execute(
            select(User)
            .where(User.role == "student")
            .where(final_condition)
            .distinct()
        )
        .scalars()
        .all()
    )

    # Add additional context about HOD supervision scope
    supervision_scope = {
        "department": dept.to_dict() if dept else None,
        "program": program.to_dict() if program else None,
    }

    return jsonify({
        "items": [s.to_dict() for s in students],
        "supervision_scope": supervision_scope,
        "total_students": len(students)
    })


# -------------------------------------------------------------------
# Get students filtered by school and/or program (for HODs with broader access)
# -------------------------------------------------------------------
@bp.get("/students/by-school-program")
@hod_required
def hod_students_by_school_program(me: User):
    school_id = request.args.get("school_id", type=int)
    program_id = request.args.get("program_id", type=int)
    
    # Check if HOD has access to the requested school/program
    dept = _my_department(me.id)
    program = _my_program(me.id)
    
    query = select(User).where(User.role == "student")
    conditions = []
    
    # Apply filters based on request parameters
    if school_id:
        conditions.append(User.school_id == school_id)
    if program_id:
        conditions.append(User.program_id == program_id)
    
    # Add authorization check - HOD can only see students from their scope
    auth_conditions = []
    if dept:
        auth_conditions.append(User.department_id == dept.id)
    if program:
        auth_conditions.append(User.program_id == program.id)
        # If HOD has a program, they can also see students from the same school
        if program.school_id:
            auth_conditions.append(User.school_id == program.school_id)
    
    if auth_conditions:
        from sqlalchemy import or_
        conditions.append(or_(*auth_conditions))
    
    if conditions:
        from sqlalchemy import and_
        query = query.where(and_(*conditions))
    
    students = db.session.execute(query.distinct()).scalars().all()
    
    return jsonify({
        "items": [s.to_dict() for s in students],
        "filters_applied": {
            "school_id": school_id,
            "program_id": program_id
        },
        "total_students": len(students)
    })


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
