# app/transcript.py
from flask import Blueprint, jsonify, request
from .models import db, User, Unit, Grade

transcript_bp = Blueprint("transcript", __name__)

@transcript_bp.route("/api/student/<int:student_id>/transcript")
def get_transcript(student_id):
    year = request.args.get("year", type=int)
    student = User.query.get_or_404(student_id)

    # Fetch units for the requested year
    units = Unit.query.filter_by(year=year).all()
    transcript = []
    for u in units:
        grade = Grade.query.filter_by(student_id=student_id, unit_id=u.id).first()
        transcript.append({
            "code": u.code,
            "title": u.title,
            "units": u.units,
            "grade": grade.grade if grade else None
        })

    return jsonify({
        "student": {
            "name": student.name,
            "reg_number": student.reg_number,
            "programme": student.programme,
            "academic_year": "2023/2024",  # dynamic logic can replace this
            "year": year,
            "semester": "1st & 2nd"
        },
        "transcript": transcript
    })
