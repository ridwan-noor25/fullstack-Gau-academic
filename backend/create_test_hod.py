#!/usr/bin/env python3
"""
Test script to create a program HOD and demonstrate the new functionality
"""

from app import create_app
from app.extensions import db
from app.models import School, Program, User

def create_test_hod():
    """Create a test HOD for demonstration"""
    
    app = create_app()
    with app.app_context():
        
        # Get the first program from Computer Science school
        cs_school = School.query.filter_by(code="PAS").first()
        if not cs_school:
            print("❌ Pure & Applied Sciences school not found")
            return
        
        cs_program = Program.query.filter_by(
            school_id=cs_school.id,
            name="Bachelor of Science in Computer Science"
        ).first()
        
        if not cs_program:
            print("❌ Computer Science program not found")
            return
        
        # Check if HOD already exists
        if cs_program.hod_user_id:
            existing_hod = User.query.get(cs_program.hod_user_id)
            print(f"✅ Program already has HOD: {existing_hod.name} ({existing_hod.email})")
            return
        
        # Create test HOD
        hod_email = "hod.cs@gau.edu"
        existing_user = User.query.filter_by(email=hod_email).first()
        
        if existing_user:
            print(f"✅ HOD user already exists: {existing_user.name} ({existing_user.email})")
            return
        
        hod = User(
            name="Dr. John Computer",
            email=hod_email,
            role="hod",
            school_id=cs_school.id,
            program_id=cs_program.id
        )
        hod.set_password("password123")
        
        db.session.add(hod)
        db.session.flush()
        
        # Assign HOD to program
        cs_program.hod_user_id = hod.id
        db.session.add(cs_program)
        db.session.commit()
        
        print(f"✅ Created HOD for {cs_program.name}:")
        print(f"   - Name: {hod.name}")
        print(f"   - Email: {hod.email}")
        print(f"   - School: {cs_school.name}")
        print(f"   - Program: {cs_program.name}")
        
        # Show some stats
        students_in_program = User.query.filter_by(
            role="student",
            program_id=cs_program.id
        ).count()
        
        students_in_school = User.query.filter_by(
            role="student", 
            school_id=cs_school.id
        ).count()
        
        print(f"\n📊 Student Statistics:")
        print(f"   - Students in {cs_program.name}: {students_in_program}")
        print(f"   - Total students in {cs_school.name}: {students_in_school}")

if __name__ == "__main__":
    create_test_hod()