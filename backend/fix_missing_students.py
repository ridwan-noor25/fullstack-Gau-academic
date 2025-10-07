# Script to fix missing student names and reg numbers for missing mark reports
from app import create_app
from app.models import db, MissingMarkReport, User

app = create_app()

# Map of student_id to (name, reg_number) to fix
# Fill this with the correct info for your students
FIX_MAP = {
    # Example: 1: ("Ridwan Noor", "E101/1869/23"),
}

def fix_missing_students():
    with app.app_context():
        reports = MissingMarkReport.query.all()
        for r in reports:
            student = User.query.get(r.student_id)
            if student:
                name, reg = FIX_MAP.get(student.id, (student.name, student.reg_number))
                updated = False
                if not student.name and name:
                    student.name = name
                    updated = True
                if not student.reg_number and reg:
                    student.reg_number = reg
                    updated = True
                if updated:
                    print(f"Updated student {student.id}: name={student.name}, reg_number={student.reg_number}")
        db.session.commit()

if __name__ == "__main__":
    fix_missing_students()
    print("Done.")
