# app/transcript.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, Unit, Grade, Assessment, Enrollment
from .decorators import role_required

transcript_bp = Blueprint("transcript", __name__)

@transcript_bp.route("/api/student/transcript")
@jwt_required()
@role_required("student")
def get_my_transcript():
    """Student endpoint to get their own transcript"""
    user_id = get_jwt_identity()
    student = User.query.get_or_404(int(user_id))
    
    return _generate_transcript(student)

@transcript_bp.route("/api/student/<int:student_id>/transcript")
@jwt_required()
@role_required("hod", "admin")
def get_transcript(student_id):
    """HOD/Admin endpoint to get any student's transcript"""
    student = User.query.get_or_404(student_id)
    
    return _generate_transcript(student)

def _generate_transcript(student):
    """Helper function to generate transcript for any student"""
    # Get student's enrollments and their published grades
    enrollments = db.session.query(Enrollment).filter_by(student_id=student.id).all()
    
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
        total_possible_score = 0
        
        for assessment in assessments:
            grade = Grade.query.filter_by(
                assessment_id=assessment.id,
                student_id=student.id
            ).first()
            
            if grade and grade.score is not None:
                # Add actual score and possible score for this assessment
                total_score += grade.score
                total_possible_score += assessment.max_score
        
        # Only include units with grades
        if total_possible_score > 0:
            # Calculate percentage based on published assessments only
            final_percentage = (total_score / total_possible_score) * 100
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
    
    # Get program name - try different sources
    programme_name = "Not specified"
    if student.program_rel and student.program_rel.name:
        programme_name = student.program_rel.name
    elif student.program:  # fallback to old string field
        programme_name = student.program
    
    # Determine year of study
    year_of_study = student.academic_year
    if not year_of_study and student.entry_year:
        # Calculate current year based on entry year
        from datetime import datetime
        current_year = datetime.now().year
        years_since_entry = current_year - student.entry_year
        year_of_study = min(years_since_entry + 1, 4)  # Cap at 4th year
    
    return jsonify({
        "student": {
            "name": student.name,
            "reg_number": student.reg_number,
            "programme": programme_name,
            "academic_year": student.academic_session or "2024/2025",
            "year_of_study": year_of_study or "N/A",
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
    if percentage >= 70:
        return "A"
    elif percentage >= 60:
        return "B"
    elif percentage >= 50:
        return "C"
    elif percentage >= 40:
        return "D"
    else:
        return "E"

def letter_to_grade_points(letter):
    """Convert letter grade to grade points (4.0 scale)"""
    grade_points = {
        "A": 4.0, 
        "B": 3.0, 
        "C": 2.0, 
        "D": 1.0, 
        "E": 0.0
    }
    return grade_points.get(letter, 0.0)

def gpa_to_letter_grade(gpa):
    """Convert GPA to overall letter grade"""
    if gpa >= 3.5:
        return "A"
    elif gpa >= 2.5:
        return "B"
    elif gpa >= 1.5:
        return "C"
    elif gpa >= 1.0:
        return "D"
    else:
        return "E"
