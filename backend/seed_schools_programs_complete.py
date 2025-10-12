#!/usr/bin/env python3

"""
Seed script to populate schools and programs for GAU-GradeView
This script creates the 4 schools and their associated programs as specified.
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from app.models import School, Program

def seed_schools_and_programs():
    """Create schools and programs for Garissa University"""
    
    # School 1: Education, Arts & Social Sciences
    school1 = School(
        name="Education, Arts & Social Sciences",
        code="EASS",
        description="School offering education, arts, and social sciences programs"
    )
    db.session.add(school1)
    db.session.flush()  # Get the ID
    
    # Programs for Education, Arts & Social Sciences
    eass_programs = [
        # Education Programs
        {"name": "Bachelor of Education (Arts)", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Education (Science)", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Education (ECPE)", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Master of Education in Curriculum Studies", "degree_type": "Master", "duration_years": 2},
        {"name": "Master of Education in Educational Administration", "degree_type": "Master", "duration_years": 2},
        {"name": "Doctor of Philosophy in Curriculum Studies", "degree_type": "PhD", "duration_years": 4},
        {"name": "Doctor of Philosophy in Educational Management", "degree_type": "PhD", "duration_years": 4},
        
        # Arts & Social Sciences Programs
        {"name": "Bachelor of Arts in Geography", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Arts in Community Development", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Arts in Political Science & Public Administration", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Arts in Arabic with Islamic Studies", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Master of Arts in Geography", "degree_type": "Master", "duration_years": 2},
        {"name": "Master of Arts in Community Development", "degree_type": "Master", "duration_years": 2},
        {"name": "Master of Arts in Kiswahili", "degree_type": "Master", "duration_years": 2},
        {"name": "Master of Arts in Literature", "degree_type": "Master", "duration_years": 2},
        {"name": "Diploma in Community development", "degree_type": "Diploma", "duration_years": 2},
    ]
    
    for prog_data in eass_programs:
        program = Program(
            name=prog_data["name"],
            degree_type=prog_data["degree_type"],
            duration_years=prog_data["duration_years"],
            school_id=school1.id,
            is_active=True
        )
        db.session.add(program)
    
    # School 2: Business & Economics
    school2 = School(
        name="Business & Economics",
        code="BE",
        description="School offering business and economics programs"
    )
    db.session.add(school2)
    db.session.flush()
    
    # Programs for Business & Economics
    be_programs = [
        {"name": "Bachelor of Business Management", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Science in Human Resource Management", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Arts in Economics", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Master in Business Management", "degree_type": "Master", "duration_years": 2},
        {"name": "Doctor of Philosophy in Business Management", "degree_type": "PhD", "duration_years": 4},
        {"name": "Diploma in Business Management", "degree_type": "Diploma", "duration_years": 2},
        {"name": "Diploma In Procurement & Supplies Management", "degree_type": "Diploma", "duration_years": 2},
        {"name": "Certificate in Business Management", "degree_type": "Certificate", "duration_years": 1},
    ]
    
    for prog_data in be_programs:
        program = Program(
            name=prog_data["name"],
            degree_type=prog_data["degree_type"],
            duration_years=prog_data["duration_years"],
            school_id=school2.id,
            is_active=True
        )
        db.session.add(program)
    
    # School 3: Pure & Applied Sciences
    school3 = School(
        name="Pure & Applied Sciences",
        code="PAS",
        description="School offering pure and applied sciences programs"
    )
    db.session.add(school3)
    db.session.flush()
    
    # Programs for Pure & Applied Sciences
    pas_programs = [
        # Pure Sciences
        {"name": "Bachelor of Science", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Science in Mathematics", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Science in Applied Statistics with Computing", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Science in Actuarial Science", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Science in Information Science", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Science in Computer Science", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Master of Science in Dryland Environment and Natural Resources", "degree_type": "Master", "duration_years": 2},
        {"name": "Diploma in Information Science", "degree_type": "Diploma", "duration_years": 2},
        {"name": "Certificate in Information Science", "degree_type": "Certificate", "duration_years": 1},
        {"name": "Diploma in Electronics", "degree_type": "Diploma", "duration_years": 2},
        
        # Health Sciences
        {"name": "Bachelor of Science in Nursing", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Bachelor of Science in Public Health", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Diploma in Medical Laboratory", "degree_type": "Diploma", "duration_years": 2},
        {"name": "Diploma Community Health", "degree_type": "Diploma", "duration_years": 2},
        {"name": "Diploma in Nutrition and Dietetics", "degree_type": "Diploma", "duration_years": 2},
        {"name": "Diploma in Medical Records", "degree_type": "Diploma", "duration_years": 2},
        {"name": "Diploma in Public Health", "degree_type": "Diploma", "duration_years": 2},
    ]
    
    for prog_data in pas_programs:
        program = Program(
            name=prog_data["name"],
            degree_type=prog_data["degree_type"],
            duration_years=prog_data["duration_years"],
            school_id=school3.id,
            is_active=True
        )
        db.session.add(program)
    
    # School 4: Institute of Peace & Security Studies
    school4 = School(
        name="Institute of Peace & Security Studies",
        code="IPSS",
        description="Institute offering peace and security studies programs"
    )
    db.session.add(school4)
    db.session.flush()
    
    # Programs for Institute of Peace & Security Studies
    ipss_programs = [
        {"name": "Bachelor in Peace, Security and Conflict Management", "degree_type": "Bachelor", "duration_years": 4},
        {"name": "Master in Peace, Security and Conflict Management", "degree_type": "Master", "duration_years": 2},
        {"name": "Master in Refugee and Migration Studies", "degree_type": "Master", "duration_years": 2},
        {"name": "Postgraduate Diploma in Peace, Security and Conflict Management", "degree_type": "Diploma", "duration_years": 1},
        {"name": "Doctor of Philosophy in Peace, Security and Conflict Management", "degree_type": "PhD", "duration_years": 4},
        {"name": "Doctor of Philosophy in Refugee and Migration Studies", "degree_type": "PhD", "duration_years": 4},
        {"name": "Diploma in Peace Security and Conflict", "degree_type": "Diploma", "duration_years": 2},
        {"name": "Certificate in Peace, Security and Conflict", "degree_type": "Certificate", "duration_years": 1},
    ]
    
    for prog_data in ipss_programs:
        program = Program(
            name=prog_data["name"],
            degree_type=prog_data["degree_type"],
            duration_years=prog_data["duration_years"],
            school_id=school4.id,
            is_active=True
        )
        db.session.add(program)
    
    # Commit all changes
    db.session.commit()
    print("✅ Successfully seeded all schools and programs!")
    
    # Print summary
    schools = School.query.all()
    for school in schools:
        program_count = len(school.programs)
        print(f"📚 {school.name} ({school.code}) - {program_count} programs")
        for program in school.programs:
            print(f"   • {program.name} ({program.degree_type})")

def main():
    app = create_app()
    with app.app_context():
        try:
            # Check if schools already exist
            existing_schools = School.query.count()
            if existing_schools > 0:
                print(f"⚠️  Found {existing_schools} existing schools. Do you want to clear and re-seed? (y/N)")
                response = input().lower().strip()
                if response == 'y':
                    print("🗑️  Clearing existing data...")
                    Program.query.delete()
                    School.query.delete()
                    db.session.commit()
                else:
                    print("❌ Aborted. Use --force to override.")
                    return
            
            print("🌱 Seeding schools and programs...")
            seed_schools_and_programs()
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding data: {e}")
            raise

if __name__ == "__main__":
    main()