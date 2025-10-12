#!/usr/bin/env python3
"""
Script to test transcript API data
"""

from app import create_app
from app.models import db, User

def test_transcript_data():
    app = create_app()
    with app.app_context():
        # Get the student
        student = User.query.filter_by(role='student').first()
        if student:
            print(f"Student: {student.name}")
            print(f"program field (old): {student.program}")
            print(f"program_id: {student.program_id}")
            print(f"program_rel: {student.program_rel}")
            if student.program_rel:
                print(f"program_rel.name: {student.program_rel.name}")
            
            # Test the logic from transcript.py
            programme_name = "Not specified"
            if student.program_rel and student.program_rel.name:
                programme_name = student.program_rel.name
                print(f"✅ Using program_rel.name: {programme_name}")
            elif student.program:  # fallback to old string field
                programme_name = student.program
                print(f"✅ Using old program field: {programme_name}")
            else:
                print(f"❌ No program found, using: {programme_name}")

if __name__ == "__main__":
    test_transcript_data()