#!/usr/bin/env python3
"""
Script to populate missing program and academic year data for existing students
"""

from app import create_app
from app.models import db, User, School, Program
from datetime import datetime

def populate_student_data():
    app = create_app()
    with app.app_context():
        # Get or create a default school
        school = School.query.first()
        if not school:
            school = School(
                name="School of Education, Arts and Social Sciences",
                code="SEASS",
                description="Default school for existing students"
            )
            db.session.add(school)
            db.session.commit()
            print(f"Created school: {school.name}")
        
        # Get or create a default program
        program = Program.query.filter_by(school_id=school.id).first()
        if not program:
            program = Program(
                name="Bachelor of Science in Mathematics",
                degree_type="Bachelor",
                duration_years=4,
                school_id=school.id
            )
            db.session.add(program)
            db.session.commit()
            print(f"Created program: {program.name}")
        
        # Update students without program data
        students = User.query.filter_by(role='student').all()
        updated_count = 0
        
        for student in students:
            updated = False
            
            # Set school and program if missing
            if not student.school_id:
                student.school_id = school.id
                updated = True
            
            if not student.program_id:
                student.program_id = program.id
                updated = True
            
            # Set academic year if missing (estimate based on reg number or default to 3rd year)
            if not student.academic_year:
                student.academic_year = 3  # Default to 3rd year
                updated = True
            
            # Set academic session if missing
            if not student.academic_session:
                student.academic_session = "2024/2025"
                updated = True
            
            # Set entry year if missing (estimate based on current year and academic year)
            if not student.entry_year:
                current_year = datetime.now().year
                estimated_entry_year = current_year - (student.academic_year - 1)
                student.entry_year = estimated_entry_year
                updated = True
            
            # Set study mode if missing
            if not student.study_mode:
                student.study_mode = "full-time"
                updated = True
            
            if updated:
                updated_count += 1
                print(f"Updated student: {student.name} ({student.email})")
        
        if updated_count > 0:
            db.session.commit()
            print(f"\nSuccessfully updated {updated_count} students")
        else:
            print("No students needed updating")

if __name__ == "__main__":
    populate_student_data()