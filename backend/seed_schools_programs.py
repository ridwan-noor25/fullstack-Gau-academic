#!/usr/bin/env python3
"""
Seed script to populate schools and programs data based on GAU structure
"""

from app import create_app
from app.extensions import db
from app.models import School, Program

def seed_schools_and_programs():
    """Seed the database with GAU schools and programs"""
    
    # Create application context
    app = create_app()
    with app.app_context():
        
        # Define the schools and their programs
        schools_data = [
            {
                "name": "Education, Arts & Social Sciences",
                "code": "EASS",
                "description": "School of Education, Arts & Social Sciences",
                "programs": [
                    {"name": "Bachelor of Education (Arts)", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Education (Science)", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Education (ECPE)", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Arts in Geography", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Arts in Community Development", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Arts in Political Science & Public Administration", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Master of Education in Curriculum Studies", "degree_type": "Master", "duration_years": 2},
                    {"name": "Master of Education in Educational Administration", "degree_type": "Master", "duration_years": 2},
                    {"name": "Doctor of Philosophy in Curriculum Studies", "degree_type": "PhD", "duration_years": 4},
                    {"name": "Doctor of Philosophy in Educational Management", "degree_type": "PhD", "duration_years": 4},
                    {"name": "Master of Arts in Geography", "degree_type": "Master", "duration_years": 2},
                    {"name": "Master of Arts in Community Development", "degree_type": "Master", "duration_years": 2},
                    {"name": "Master of Arts in Kiswahili", "degree_type": "Master", "duration_years": 2},
                    {"name": "Master of Arts in Literature", "degree_type": "Master", "duration_years": 2},
                    {"name": "Bachelor of Arts in Arabic with Islamic Studies", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Diploma in Community development", "degree_type": "Diploma", "duration_years": 2},
                ]
            },
            {
                "name": "Business & Economics",
                "code": "BE",
                "description": "School of Business & Economics",
                "programs": [
                    {"name": "Bachelor of Business Management", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Science in Human Resource Management", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Arts in Economics", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Master in Business Management", "degree_type": "Master", "duration_years": 2},
                    {"name": "Doctor of Philosophy in Business Management", "degree_type": "PhD", "duration_years": 4},
                    {"name": "Diploma in Business Management", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Diploma In Procurement & Supplies Management", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Certificate in Business Management", "degree_type": "Certificate", "duration_years": 1},
                ]
            },
            {
                "name": "Pure & Applied Sciences",
                "code": "PAS",
                "description": "School of Pure & Applied Sciences",
                "programs": [
                    {"name": "Bachelor of Science", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Science in Mathematics", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Science in Applied Statistics with Computing", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Science in Actuarial Science", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Science in Information Science", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Science in Computer Science", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Master of Science in Dryland Environment and Natural Resources", "degree_type": "Master", "duration_years": 2},
                    {"name": "Diploma in Information Science", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Certificate in Information Science", "degree_type": "Certificate", "duration_years": 1},
                    {"name": "Bachelor of Science in Nursing", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Bachelor of Science in Public Health", "degree_type": "Bachelor", "duration_years": 4},
                    {"name": "Diploma in Medical Laboratory", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Diploma Community Health", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Diploma in Nutrition and Dietetics", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Diploma in Medical Records", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Diploma in Electronics", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Diploma in Public Health", "degree_type": "Diploma", "duration_years": 2},
                ]
            },
            {
                "name": "Institute of Peace & Security Studies",
                "code": "IPSS",
                "description": "Institute of Peace & Security Studies",
                "programs": [
                    {"name": "Diploma in Peace Security and Conflict", "degree_type": "Diploma", "duration_years": 2},
                    {"name": "Certificate in Peace, Security and Conflict", "degree_type": "Certificate", "duration_years": 1},
                    {"name": "Doctor of Philosophy in Refugee and Migration Studies", "degree_type": "PhD", "duration_years": 4},
                    {"name": "Doctor of Philosophy in Peace, Security and Conflict Management", "degree_type": "PhD", "duration_years": 4},
                    {"name": "Master in Refugee and Migration Studies", "degree_type": "Master", "duration_years": 2},
                    {"name": "Master in Peace, Security and Conflict Management", "degree_type": "Master", "duration_years": 2},
                    {"name": "Postgraduate Diploma in Peace, Security and Conflict Management", "degree_type": "Postgraduate Diploma", "duration_years": 1},
                    {"name": "Bachelor in Peace, Security and Conflict Management", "degree_type": "Bachelor", "duration_years": 4},
                ]
            }
        ]
        
        # Clear existing data
        print("Clearing existing schools and programs...")
        Program.query.delete()
        School.query.delete()
        db.session.commit()
        
        # Create schools and programs
        print("Creating schools and programs...")
        
        for school_data in schools_data:
            # Create school
            school = School(
                name=school_data["name"],
                code=school_data["code"],
                description=school_data["description"]
            )
            db.session.add(school)
            db.session.flush()  # Get the school ID
            
            print(f"Created school: {school.name}")
            
            # Create programs for this school
            for program_data in school_data["programs"]:
                program = Program(
                    name=program_data["name"],
                    degree_type=program_data["degree_type"],
                    duration_years=program_data["duration_years"],
                    school_id=school.id,
                    is_active=True
                )
                db.session.add(program)
            
            print(f"  - Added {len(school_data['programs'])} programs")
        
        # Commit all changes
        db.session.commit()
        
        # Print summary
        total_schools = School.query.count()
        total_programs = Program.query.count()
        
        print(f"\n✅ Successfully seeded:")
        print(f"   - {total_schools} schools")
        print(f"   - {total_programs} programs")
        
        # Print breakdown by school
        print(f"\n📊 Programs by school:")
        schools = db.session.execute(db.select(School)).scalars().all()
        for school in schools:
            program_count = Program.query.filter_by(school_id=school.id).count()
            print(f"   - {school.name}: {program_count} programs")

if __name__ == "__main__":
    seed_schools_and_programs()