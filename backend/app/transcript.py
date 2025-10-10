# app/transcript.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from .models import db, User, Unit, Grade, Assessment, Enrollment
from .decorators import role_required

transcript_bp = Blueprint("transcript", __name__)

@transcript_bp.route("/api/student/<int:student_id>/transcript")
@jwt_required()
@role_required("hod", "admin")
def get_transcript(student_id):
    student = User.query.get_or_404(student_id)
    
    # Get student's enrollments and their published grades
    enrollments = db.session.query(Enrollment).filter_by(student_id=student_id).all()
    
    transcript = []
    total_credits = 0
    total_grade_points = 0
    
    for enrollment in enrollments:
        unit = enrollment.unit
        if not unit:
            continue
            
        # Get published assessments for this unit
        assessments = Assessment.query.filter_by(
            unit_id=unit.id, 
            is_published=True
        ).all()
        
        if not assessments:
            continue
            
        # Calculate final grade for this unit based on published assessments
        total_score = 0
        total_weight = 0
        
        for assessment in assessments:
            grade = Grade.query.filter_by(
                assessment_id=assessment.id,
                student_id=student_id
            ).first()
            
            if grade and grade.score is not None:
                # Calculate weighted score
                percentage = (grade.score / assessment.max_score) * 100
                weighted_score = percentage * (assessment.weight / 100)
                total_score += weighted_score
                total_weight += assessment.weight
        
        # Only include units with grades
        if total_weight > 0:
            final_percentage = total_score
            letter_grade = percentage_to_letter_grade(final_percentage)
            grade_points = letter_to_grade_points(letter_grade)
            
            transcript.append({
                "code": unit.code,
                "title": unit.title,
                "credits": unit.credits or 3,  # Default to 3 if not set
                "grade": letter_grade,
                "percentage": round(final_percentage, 1),
                "grade_points": grade_points
            })
            
            # Add to GPA calculation
            unit_credits = unit.credits or 3
            total_credits += unit_credits
            total_grade_points += grade_points * unit_credits
    
    # Calculate GPA
    gpa = round(total_grade_points / total_credits, 2) if total_credits > 0 else 0
    mean_grade = gpa_to_letter_grade(gpa)
    
    return jsonify({
        "student": {
            "name": student.name,
            "reg_number": student.reg_number,
            "programme": getattr(student, 'programme', 'Not specified'),
            "academic_year": "2024/2025",
            "year": getattr(student, 'year_level', 'N/A'),
            "semester": "1st & 2nd"
        },
        "transcript": transcript,
        "summary": {
            "total_courses": len(transcript),
            "total_credits": total_credits,
            "gpa": gpa,
            "mean_grade": mean_grade
        }
    })

def percentage_to_letter_grade(percentage):
    """Convert percentage to letter grade"""
    if percentage >= 80:
        return "A"
    elif percentage >= 75:
        return "A-"
    elif percentage >= 70:
        return "B+"
    elif percentage >= 65:
        return "B"
    elif percentage >= 60:
        return "B-"
    elif percentage >= 55:
        return "C+"
    elif percentage >= 50:
        return "C"
    elif percentage >= 45:
        return "C-"
    elif percentage >= 40:
        return "D+"
    elif percentage >= 35:
        return "D"
    else:
        return "F"

def letter_to_grade_points(letter):
    """Convert letter grade to grade points (4.0 scale)"""
    grade_points = {
        "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
        "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0
    }
    return grade_points.get(letter, 0.0)

def gpa_to_letter_grade(gpa):
    """Convert GPA to overall letter grade"""
    if gpa >= 3.7:
        return "A"
    elif gpa >= 3.3:
        return "B+"
    elif gpa >= 3.0:
        return "B"
    elif gpa >= 2.7:
        return "B-"
    elif gpa >= 2.3:
        return "C+"
    elif gpa >= 2.0:
        return "C"
    elif gpa >= 1.7:
        return "C-"
    elif gpa >= 1.3:
        return "D+"
    elif gpa >= 1.0:
        return "D"
    else:
        return "F"
