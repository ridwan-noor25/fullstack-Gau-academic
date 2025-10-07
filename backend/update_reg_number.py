# Script to update a student's reg_number in the database
from app import create_app
from app.models import db, User

app = create_app()

with app.app_context():
    student = User.query.filter_by(name="Ridwan Noor").first()
    if student:
        student.reg_number = "E101/1869/23"
        db.session.commit()
        print(f"Updated reg_number for {student.name} to {student.reg_number}")
    else:
        print("Student not found.")
