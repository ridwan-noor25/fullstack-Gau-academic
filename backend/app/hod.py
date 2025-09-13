# app/hod.py
from __future__ import annotations

from typing import Iterable, List, Set
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from .decorators import role_required
from .extensions import db
from .models import Department, User, Unit, TeachingAssignment, Assessment

hod_bp = Blueprint("hod", __name__, url_prefix="/api/hod")


# ---------------------------
# Helpers
# ---------------------------
def _get_hod_and_dept():
    """Return (hod_user, department) from JWT identity."""
    me_id = get_jwt_identity()
    if not me_id:
        return None, None
    hod = User.query.get(int(me_id))
    if not hod:
        return None, None
    dept = Department.query.filter_by(hod_user_id=hod.id).first()
    return hod, dept


def _ensure_same_dept_or_404(obj_dept_id: int | None, dept_id: int):
    if obj_dept_id != dept_id:
        return jsonify(error="not found in your department"), 404
    return None


def _as_int_list(value) -> List[int]:
    """Accepts [1,2], '1,2', ' 1 , 2 ', or None."""
    if value is None:
        return []
    if isinstance(value, (list, tuple, set)):
        return [int(x) for x in value if str(x).strip()]
    if isinstance(value, str):
        return [int(x) for x in value.split(",") if x.strip()]
    try:
        return [int(value)]
    except Exception:
        return []


def _replace_unit_assignments(unit: Unit, new_lecturer_ids: Iterable[int]) -> dict:
    """Replace all lecturers assigned to a unit with 'new_lecturer_ids'."""
    current = TeachingAssignment.query.filter_by(unit_id=unit.id).all()
    current_set = {ta.lecturer_id for ta in current}
    new_set = {int(x) for x in new_lecturer_ids}

    to_remove = current_set - new_set
    to_add = new_set - current_set

    removed = 0
    if to_remove:
        TeachingAssignment.query.filter(
            TeachingAssignment.unit_id == unit.id,
            TeachingAssignment.lecturer_id.in_(list(to_remove)),
        ).delete(synchronize_session=False)
        removed = len(to_remove)

    added = 0
    for lid in to_add:
        db.session.add(TeachingAssignment(unit_id=unit.id, lecturer_id=lid))
        added += 1

    return {"added": added, "removed": removed}


# ---------------------------
# Dashboard Summary
# ---------------------------
@hod_bp.get("/summary")
@jwt_required()
@role_required("hod")
def summary():
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    lecturers = User.query.filter_by(role="lecturer", department_id=dept.id).count()
    units = Unit.query.filter_by(department_id=dept.id).count()
    assignments = (
        db.session.query(func.count(TeachingAssignment.id))
        .join(Unit, Unit.id == TeachingAssignment.unit_id)
        .filter(Unit.department_id == dept.id)
        .scalar()
        or 0
    )
    return jsonify(lecturers=lecturers, units=units, assignments=assignments), 200


# ---------------------------
# Lecturers (CRUD)
# ---------------------------
@hod_bp.get("/lecturers")
@jwt_required()
@role_required("hod")
def list_lecturers():
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    items = (
        User.query.filter_by(role="lecturer", department_id=dept.id)
        .order_by(User.name.asc())
        .all()
    )

    # include units per lecturer (optional)
    out = []
    for u in items:
        unit_ids = [ta.unit_id for ta in u.teaching_assignments]
        units = Unit.query.filter(Unit.id.in_(unit_ids)).all() if unit_ids else []
        out.append({
            **u.to_dict(),
            "units": [x.to_dict() for x in units]
        })
    return jsonify(items=out), 200


@hod_bp.post("/lecturers")
@jwt_required()
@role_required("hod")
def create_lecturer():
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    unit_ids = _as_int_list(data.get("unit_ids"))

    if not name or not email or not password:
        return jsonify(error="name, email, password required"), 400
    if User.query.filter_by(email=email).first():
        return jsonify(error="email already exists"), 409

    lec = User(name=name, email=email, role="lecturer", department_id=dept.id)
    lec.set_password(password)
    db.session.add(lec)
    db.session.flush()

    if unit_ids:
        valid_units = Unit.query.filter(
            Unit.id.in_(unit_ids), Unit.department_id == dept.id
        ).all()
        for u in valid_units:
            db.session.add(TeachingAssignment(unit_id=u.id, lecturer_id=lec.id))

    db.session.commit()
    return jsonify(message="Lecturer created", user=lec.to_dict()), 201


@hod_bp.patch("/lecturers/<int:user_id>")
@jwt_required()
@role_required("hod")
def update_lecturer(user_id: int):
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    lec = User.query.get_or_404(user_id)
    if lec.department_id != dept.id or lec.role != "lecturer":
        return jsonify(error="not found in your department"), 404

    data = request.get_json(force=True) or {}
    if "name" in data:
        lec.name = (data["name"] or lec.name).strip()
    if "email" in data:
        new_email = (data["email"] or lec.email).strip().lower()
        if new_email != lec.email and User.query.filter_by(email=new_email).first():
            return jsonify(error="email already exists"), 409
        lec.email = new_email
    if "password" in data and data["password"]:
        lec.set_password(data["password"])

    if "unit_ids" in data:
        ids = _as_int_list(data["unit_ids"])
        valid_lec_ids = [
            u.id for u in Unit.query.filter(
                Unit.id.in_(ids), Unit.department_id == dept.id
            ).all()
        ]
        # add only (idempotent add); not removing here
        current = {ta.unit_id for ta in lec.teaching_assignments}
        for uid in set(valid_lec_ids) - current:
            db.session.add(TeachingAssignment(unit_id=uid, lecturer_id=lec.id))

    db.session.commit()
    return jsonify(message="Lecturer updated", user=lec.to_dict()), 200


@hod_bp.delete("/lecturers/<int:user_id>")
@jwt_required()
@role_required("hod")
def delete_lecturer(user_id: int):
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    lec = User.query.get_or_404(user_id)
    if lec.department_id != dept.id or lec.role != "lecturer":
        return jsonify(error="not found in your department"), 404

    db.session.delete(lec)
    db.session.commit()
    return ("", 204)


# ---------------------------
# Units (CRUD + assignments + publish)
# ---------------------------
@hod_bp.get("/units")
@jwt_required()
@role_required("hod")
def list_units():
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    units = Unit.query.filter_by(department_id=dept.id).order_by(Unit.code.asc()).all()

    out = []
    for unit in units:
        d = unit.to_dict()
        tas = TeachingAssignment.query.filter_by(unit_id=unit.id).all()
        d["lecturers"] = [
            {"id": ta.lecturer.id, "name": ta.lecturer.name, "email": ta.lecturer.email}
            for ta in tas if ta.lecturer is not None
        ]
        out.append(d)

    return jsonify(items=out), 200


@hod_bp.post("/units")
@jwt_required()
@role_required("hod")
def create_unit():
    """
    Payload:
    {
      "code": "MAT 101", "title": "Calculus I",
      "credits": 3, "year_level": 1, "semester": 1,
      "lecturer_ids": [5,7]
    }
    """
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    data = request.get_json(force=True) or {}
    code = (data.get("code") or "").strip()
    title = (data.get("title") or "").strip()
    credits = data.get("credits")
    year_level = data.get("year_level")
    semester = data.get("semester")
    lecturer_ids = _as_int_list(data.get("lecturer_ids"))

    if not code or not title:
        return jsonify(error="code and title are required"), 400
    if Unit.query.filter_by(code=code).first():
        return jsonify(error="unit code already exists"), 409

    unit = Unit(
        code=code,
        title=title,
        credits=credits,
        year_level=int(year_level) if year_level is not None else None,
        semester=int(semester) if semester is not None else None,
        department_id=dept.id,
    )
    db.session.add(unit)
    db.session.flush()

    if lecturer_ids:
        valid_lecs = [
            l.id
            for l in User.query.filter(
                User.id.in_(lecturer_ids),
                User.role == "lecturer",
                User.department_id == dept.id,
            ).all()
        ]
        for lid in set(valid_lecs):
            db.session.add(TeachingAssignment(unit_id=unit.id, lecturer_id=lid))

    db.session.commit()

    d = unit.to_dict()
    tas = TeachingAssignment.query.filter_by(unit_id=unit.id).all()
    d["lecturers"] = [
        {"id": ta.lecturer.id, "name": ta.lecturer.name, "email": ta.lecturer.email}
        for ta in tas if ta.lecturer is not None
    ]
    return jsonify(message="Unit created", unit=d), 201


@hod_bp.patch("/units/<int:unit_id>")
@jwt_required()
@role_required("hod")
def update_unit(unit_id: int):
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    unit = Unit.query.get_or_404(unit_id)
    if unit.department_id != dept.id:
        return jsonify(error="not found in your department"), 404

    data = request.get_json(force=True) or {}

    if "code" in data:
        new_code = (data["code"] or unit.code).strip()
        if new_code != unit.code and Unit.query.filter_by(code=new_code).first():
            return jsonify(error="unit code already exists"), 409
        unit.code = new_code
    if "title" in data:
        unit.title = (data["title"] or unit.title).strip()
    if "credits" in data:
        unit.credits = data["credits"]
    if "year_level" in data:
        unit.year_level = int(data["year_level"]) if data["year_level"] is not None else None
    if "semester" in data:
        unit.semester = int(data["semester"]) if data["semester"] is not None else None

    changes = None
    if "lecturer_ids" in data:
        ids = _as_int_list(data["lecturer_ids"])
        valid_lec_ids = [
            l.id
            for l in User.query.filter(
                User.id.in_(ids),
                User.role == "lecturer",
                User.department_id == dept.id,
            ).all()
        ]
        changes = _replace_unit_assignments(unit, valid_lec_ids)

    db.session.commit()

    payload = unit.to_dict()
    tas = TeachingAssignment.query.filter_by(unit_id=unit.id).all()
    payload["lecturers"] = [
        {"id": ta.lecturer.id, "name": ta.lecturer.name, "email": ta.lecturer.email}
        for ta in tas if ta.lecturer is not None
    ]
    if changes is not None:
        payload["assignment_changes"] = changes
    return jsonify(message="Unit updated", unit=payload), 200


@hod_bp.delete("/units/<int:unit_id>")
@jwt_required()
@role_required("hod")
def delete_unit(unit_id: int):
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    unit = Unit.query.get_or_404(unit_id)
    if unit.department_id != dept.id:
        return jsonify(error="not found in your department"), 404

    db.session.delete(unit)
    db.session.commit()
    return ("", 204)


@hod_bp.post("/units/<int:unit_id>/assign")
@jwt_required()
@role_required("hod")
def assign_lecturer_to_unit(unit_id: int):
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    data = request.get_json(force=True) or {}
    lecturer_id = data.get("lecturer_id")
    if not lecturer_id:
        return jsonify(error="lecturer_id required"), 400

    unit = Unit.query.get_or_404(unit_id)
    if unit.department_id != dept.id:
        return jsonify(error="not found in your department"), 404

    lec = User.query.get_or_404(int(lecturer_id))
    if lec.role != "lecturer" or lec.department_id != dept.id:
        return jsonify(error="target user is not a lecturer in your department"), 400

    exists = TeachingAssignment.query.filter_by(unit_id=unit.id, lecturer_id=lec.id).first()
    if exists:
        return jsonify(message="already assigned"), 200

    ta = TeachingAssignment(unit_id=unit.id, lecturer_id=lec.id)
    db.session.add(ta)
    db.session.commit()
    return jsonify(message="assigned", assignment={"id": ta.id, "unit_id": unit.id, "lecturer_id": lec.id}), 201


@hod_bp.delete("/units/<int:unit_id>/assign/<int:lecturer_id>")
@jwt_required()
@role_required("hod")
def remove_assignment(unit_id: int, lecturer_id: int):
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    unit = Unit.query.get_or_404(unit_id)
    if unit.department_id != dept.id:
        return jsonify(error="not found in your department"), 404

    lec = User.query.get_or_404(lecturer_id)
    if lec.role != "lecturer" or lec.department_id != dept.id:
        return jsonify(error="target user is not a lecturer in your department"), 400

    ta = TeachingAssignment.query.filter_by(unit_id=unit.id, lecturer_id=lec.id).first()
    if not ta:
        return jsonify(error="assignment not found"), 404

    db.session.delete(ta)
    db.session.commit()
    return ("", 204)


# ---------- PUBLISH ----------
@hod_bp.post("/assessments/<int:ass_id>/publish")
@jwt_required()
@role_required("hod")
def publish_assessment(ass_id: int):
    """Publish or unpublish a single assessment in HoD's department."""
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    a = (
        Assessment.query
        .join(Unit, Unit.id == Assessment.unit_id)
        .filter(Assessment.id == ass_id, Unit.department_id == dept.id)
        .first()
    )
    if not a:
        return jsonify(error="assessment not found or not in your department"), 404

    data = request.get_json(silent=True) or {}
    publish = True if data.get("publish", True) else False
    a.is_published = publish
    db.session.commit()
    return jsonify(message=("published" if publish else "unpublished"), assessment=a.to_dict()), 200


@hod_bp.post("/units/<int:unit_id>/publish")
@jwt_required()
@role_required("hod")
def publish_unit(unit_id: int):
    """Publish or unpublish ALL assessments in the unit."""
    _, dept = _get_hod_and_dept()
    if not dept:
        return jsonify(error="HoD is not assigned to any department"), 400

    unit = Unit.query.get_or_404(unit_id)
    if unit.department_id != dept.id:
        return jsonify(error="not found in your department"), 404

    data = request.get_json(silent=True) or {}
    publish = True if data.get("publish", True) else False

    q = Assessment.query.filter_by(unit_id=unit.id)
    count = 0
    for a in q.all():
        a.is_published = publish
        count += 1
    db.session.commit()

    return jsonify(
        message=("published" if publish else "unpublished"),
        unit={"id": unit.id, "code": unit.code, "title": unit.title},
        affected=count
    ), 200
