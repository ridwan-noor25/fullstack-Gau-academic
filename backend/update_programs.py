#!/usr/bin/env python3
"""
Script to check and update program data
"""

from app import create_app
from app.models import db, User, School, Program

def check_and_update_programs():
    app = create_app()
    with app.app_context():
        # Check current programs
        programs = Program.query.all()
        print("Current programs:")
        for p in programs:
            print(f"  ID: {p.id}, Name: {p.name}, School: {p.school.name if p.school else 'None'}")
        
        # Check students and their program assignments
        students = User.query.filter_by(role='student').all()
        print(f"\nStudents ({len(students)}):")
        for s in students:
            print(f"  {s.name}: program_id={s.program_id}, program_rel={s.program_rel.name if s.program_rel else 'None'}")
        
        # Update or create the Bachelor of Education(Science) program
        education_program = Program.query.filter_by(name="Bachelor of Education(Science)").first()
        if not education_program:
            school = School.query.first()
            if school:
                education_program = Program(
                    name="Bachelor of Education(Science)",
                    degree_type="Bachelor",
                    duration_years=4,
                    school_id=school.id
                )
                db.session.add(education_program)
                db.session.commit()
                print(f"\nCreated new program: {education_program.name}")
            else:
                print("\nNo school found to create program")
                return
        
        # Update all students to use the Education program
        for student in students:
            if student.program_id != education_program.id:
                student.program_id = education_program.id
                print(f"Updated {student.name} to program: {education_program.name}")
        
        db.session.commit()
        print("\nProgram updates completed!")

if __name__ == "__main__":
    check_and_update_programs()