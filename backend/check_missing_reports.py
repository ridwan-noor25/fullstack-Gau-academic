# Script to check and print all missing mark reports with student info
from app import create_app
from app.models import db, MissingMarkReport, User

app = create_app()

with app.app_context():
    reports = MissingMarkReport.query.all()
    for r in reports:
        student = User.query.get(r.student_id)
        print(f"Report ID: {r.id}, Student ID: {r.student_id}, Name: {getattr(student, 'name', None)}, Reg No: {getattr(student, 'reg_number', None)}")
