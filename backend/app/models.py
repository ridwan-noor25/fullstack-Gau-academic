

# from __future__ import annotations

# from sqlalchemy import func, UniqueConstraint, Index
# from .extensions import db
# from werkzeug.security import generate_password_hash, check_password_hash


# # ---------- Mixins ----------
# class TimestampMixin:
#     created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
#     updated_at = db.Column(
#         db.DateTime,
#         nullable=False,
#         server_default=func.now(),
#         onupdate=func.now(),
#     )


# # ---------- Core Models ----------
# class Department(TimestampMixin, db.Model):
#     __tablename__ = "departments"

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(160), nullable=False, unique=True, index=True)
#     code = db.Column(db.String(32), nullable=False, unique=True, index=True)

#     hod_user_id = db.Column(
#         db.Integer,
#         db.ForeignKey("users.id", ondelete="SET NULL"),
#         nullable=True,
#     )

#     users = db.relationship(
#         "User",
#         back_populates="department",
#         foreign_keys="User.department_id",
#         lazy="selectin",
#         passive_deletes=True,
#     )

#     hod = db.relationship(
#         "User",
#         foreign_keys=[hod_user_id],
#         back_populates="hod_of_department",
#         uselist=False,
#         lazy="selectin",
#     )

#     units = db.relationship(
#         "Unit",
#         back_populates="department",
#         foreign_keys="Unit.department_id",
#         lazy="selectin",
#         cascade="all, delete-orphan",
#         passive_deletes=True,
#     )

#     def to_dict(self) -> dict:
#         return {
#             "id": self.id,
#             "name": self.name,
#             "code": self.code,
#             "hod_user_id": self.hod_user_id,
#         }


# class User(TimestampMixin, db.Model):
#     __tablename__ = "users"

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(120), nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False, index=True)
#     _password_hash = db.Column("password_hash", db.String(256), nullable=False)

#     reg_number = db.Column(db.String(64), unique=True, nullable=True, index=True)
#     program = db.Column(db.String(160), nullable=True)

#     role = db.Column(db.String(32), nullable=False, default="student", index=True)

#     department_id = db.Column(
#         db.Integer,
#         db.ForeignKey("departments.id", ondelete="SET NULL"),
#         nullable=True,
#         index=True,
#     )

#     department = db.relationship(
#         "Department",
#         back_populates="users",
#         foreign_keys=[department_id],
#         lazy="selectin",
#     )

#     hod_of_department = db.relationship(
#         "Department",
#         back_populates="hod",
#         foreign_keys="Department.hod_user_id",
#         uselist=False,
#         lazy="selectin",
#     )

#     teaching_assignments = db.relationship(
#         "TeachingAssignment",
#         back_populates="lecturer",
#         foreign_keys="TeachingAssignment.lecturer_id",
#         lazy="selectin",
#         cascade="all, delete-orphan",
#         passive_deletes=True,
#     )

#     enrollments = db.relationship(
#         "Enrollment",
#         back_populates="student",
#         foreign_keys="Enrollment.student_id",
#         lazy="selectin",
#         cascade="all, delete-orphan",
#         passive_deletes=True,
#     )

#     grades_entered = db.relationship(
#         "Grade",
#         back_populates="entered_by_user",
#         foreign_keys="Grade.entered_by",
#         lazy="selectin",
#     )

#     grades_approved = db.relationship(
#         "Grade",
#         back_populates="approved_by_user",
#         foreign_keys="Grade.approved_by",
#         lazy="selectin",
#     )

#     @property
#     def password(self):
#         raise AttributeError("Password is write-only")

#     @password.setter
#     def password(self, raw: str):
#         self._password_hash = generate_password_hash(raw)

#     def set_password(self, raw: str):
#         self.password = raw

#     def check_password(self, raw: str) -> bool:
#         return check_password_hash(self._password_hash, raw)

#     def to_dict(self) -> dict:
#         return {
#             "id": self.id,
#             "name": self.name,
#             "email": self.email,
#             "role": self.role,
#             "department_id": self.department_id,
#             "department": self.department.to_dict() if self.department else None,
#             "reg_number": self.reg_number,
#             "program": self.program,
#         }


# class Unit(TimestampMixin, db.Model):
#     __tablename__ = "units"

#     id = db.Column(db.Integer, primary_key=True)
#     code = db.Column(db.String(32), unique=True, nullable=False, index=True)
#     title = db.Column(db.String(200), nullable=False, index=True)
#     credits = db.Column(db.Integer, nullable=True)

#     year_level = db.Column(db.Integer, nullable=True, index=True)
#     semester = db.Column(db.Integer, nullable=True, index=True)

#     department_id = db.Column(
#         db.Integer,
#         db.ForeignKey("departments.id", ondelete="SET NULL"),
#         nullable=True,
#         index=True,
#     )

#     department = db.relationship(
#         "Department",
#         back_populates="units",
#         foreign_keys=[department_id],
#         lazy="selectin",
#     )

#     teaching_assignments = db.relationship(
#         "TeachingAssignment",
#         back_populates="unit",
#         foreign_keys="TeachingAssignment.unit_id",
#         lazy="selectin",
#         cascade="all, delete-orphan",
#         passive_deletes=True,
#     )

#     enrollments = db.relationship(
#         "Enrollment",
#         back_populates="unit",
#         foreign_keys="Enrollment.unit_id",
#         lazy="selectin",
#         cascade="all, delete-orphan",
#         passive_deletes=True,
#     )

#     assessments = db.relationship(
#         "Assessment",
#         back_populates="unit",
#         foreign_keys="Assessment.unit_id",
#         lazy="selectin",
#         cascade="all, delete-orphan",
#         passive_deletes=True,
#     )

#     def to_dict(self) -> dict:
#         return {
#             "id": self.id,
#             "code": self.code,
#             "title": self.title,
#             "credits": self.credits,
#             "department_id": self.department_id,
#             "year_level": self.year_level,
#             "semester": self.semester,
#         }


# # ---------- Linking / Domain Models ----------
# class TeachingAssignment(TimestampMixin, db.Model):
#     __tablename__ = "teaching_assignments"
#     __table_args__ = (
#         UniqueConstraint("unit_id", "lecturer_id", name="uq_teach_unit_lecturer"),
#         Index("ix_teach_unit_lecturer", "unit_id", "lecturer_id"),
#     )

#     id = db.Column(db.Integer, primary_key=True)
#     unit_id = db.Column(
#         db.Integer,
#         db.ForeignKey("units.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )
#     lecturer_id = db.Column(
#         db.Integer,
#         db.ForeignKey("users.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )

#     unit = db.relationship(
#         "Unit",
#         back_populates="teaching_assignments",
#         foreign_keys=[unit_id],
#         lazy="selectin",
#     )
#     lecturer = db.relationship(
#         "User",
#         back_populates="teaching_assignments",
#         foreign_keys=[lecturer_id],
#         lazy="selectin",
#     )


# class Enrollment(TimestampMixin, db.Model):
#     __tablename__ = "enrollments"
#     __table_args__ = (
#         UniqueConstraint("student_id", "unit_id", name="uq_enroll_student_unit"),
#         Index("ix_enroll_student_unit", "student_id", "unit_id"),
#     )

#     id = db.Column(db.Integer, primary_key=True)
#     student_id = db.Column(
#         db.Integer,
#         db.ForeignKey("users.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )
#     unit_id = db.Column(
#         db.Integer,
#         db.ForeignKey("units.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )

#     student = db.relationship(
#         "User",
#         back_populates="enrollments",
#         foreign_keys=[student_id],
#         lazy="selectin",
#     )
#     unit = db.relationship(
#         "Unit",
#         back_populates="enrollments",
#         foreign_keys=[unit_id],
#         lazy="selectin",
#     )

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "student_id": self.student_id,
#             "unit_id": self.unit_id,
#             "student": self.student.to_dict() if self.student else None,
#             "unit": self.unit.to_dict() if self.unit else None,
#         }


# class Assessment(TimestampMixin, db.Model):
#     __tablename__ = "assessments"

#     id = db.Column(db.Integer, primary_key=True)
#     unit_id = db.Column(
#         db.Integer,
#         db.ForeignKey("units.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )
#     title = db.Column(db.String(200), nullable=False)
#     max_score = db.Column(db.Float, nullable=False, default=100.0)
#     weight = db.Column(db.Float, nullable=False, default=1.0)
#     created_by = db.Column(
#         db.Integer,
#         db.ForeignKey("users.id", ondelete="SET NULL"),
#         nullable=True,
#         index=True,
#     )

#     due_at = db.Column(db.DateTime, nullable=True)
#     is_published = db.Column(db.Boolean, nullable=False, default=False, index=True)

#     unit = db.relationship(
#         "Unit",
#         back_populates="assessments",
#         foreign_keys=[unit_id],
#         lazy="selectin",
#     )
#     creator = db.relationship("User", foreign_keys=[created_by], lazy="selectin")

#     grades = db.relationship(
#         "Grade",
#         back_populates="assessment",
#         foreign_keys="Grade.assessment_id",
#         lazy="selectin",
#         cascade="all, delete-orphan",
#         passive_deletes=True,
#     )

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "unit_id": self.unit_id,
#             "title": self.title,
#             "max_score": self.max_score,
#             "weight": self.weight,
#             "due_at": self.due_at.isoformat() if self.due_at else None,
#             "is_published": self.is_published,
#             "created_by": self.created_by,
#         }


# class Grade(TimestampMixin, db.Model):
#     __tablename__ = "grades"
#     __table_args__ = (
#         UniqueConstraint("assessment_id", "student_id", name="uq_grade_assessment_student"),
#         Index("ix_grade_status", "status"),
#     )

#     id = db.Column(db.Integer, primary_key=True)
#     assessment_id = db.Column(
#         db.Integer,
#         db.ForeignKey("assessments.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )
#     student_id = db.Column(
#         db.Integer,
#         db.ForeignKey("users.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )
#     score = db.Column(db.Float, nullable=False)
#     status = db.Column(db.String(20), nullable=False, default="draft", index=True)

#     entered_by = db.Column(
#         db.Integer,
#         db.ForeignKey("users.id", ondelete="SET NULL"),
#         nullable=True,
#         index=True,
#     )
#     approved_by = db.Column(
#         db.Integer,
#         db.ForeignKey("users.id", ondelete="SET NULL"),
#         nullable=True,
#         index=True,
#     )

#     assessment = db.relationship(
#         "Assessment",
#         back_populates="grades",
#         foreign_keys=[assessment_id],
#         lazy="selectin",
#     )
#     student = db.relationship("User", foreign_keys=[student_id], lazy="selectin")
#     entered_by_user = db.relationship("User", foreign_keys=[entered_by], lazy="selectin")
#     approved_by_user = db.relationship("User", foreign_keys=[approved_by], lazy="selectin")

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "assessment_id": self.assessment_id,
#             "student_id": self.student_id,
#             "score": self.score,
#             "status": self.status,
#             "entered_by": self.entered_by,
#             "approved_by": self.approved_by,
#         }


# class MissingMarkReport(TimestampMixin, db.Model):
#     __tablename__ = "missing_mark_reports"

#     id = db.Column(db.Integer, primary_key=True)
#     student_id = db.Column(
#         db.Integer,
#         db.ForeignKey("users.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )
#     unit_id = db.Column(
#         db.Integer,
#         db.ForeignKey("units.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )

#     description = db.Column(db.Text, nullable=True)
#     assessment_id = db.Column(
#         db.Integer,
#         db.ForeignKey("assessments.id", ondelete="SET NULL"),
#         nullable=True,
#         index=True,
#     )
#     message = db.Column(db.Text, nullable=True)
#     proof_url = db.Column(db.String(500), nullable=True)
#     status = db.Column(db.String(32), nullable=False, default="Pending", index=True)
#     lecturer_note = db.Column(db.Text, nullable=True)

#     student = db.relationship("User", foreign_keys=[student_id], lazy="selectin")
#     unit = db.relationship("Unit", foreign_keys=[unit_id], lazy="selectin")
#     assessment = db.relationship("Assessment", foreign_keys=[assessment_id], lazy="selectin")

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "student_id": self.student_id,
#             "unit_id": self.unit_id,
#             "assessment_id": self.assessment_id,
#             "message": self.message,
#             "description": self.description,
#             "proof_url": self.proof_url,
#             "status": self.status,
#             "lecturer_note": self.lecturer_note,
#         }


# # ---------- Admin Dashboard Helper ----------
# class Activity(TimestampMixin, db.Model):
#     __tablename__ = "activities"

#     id = db.Column(db.Integer, primary_key=True)
#     kind = db.Column(db.String(20), nullable=False, default="activity", index=True)
#     title = db.Column(db.String(255), nullable=True)
#     action = db.Column(db.String(255), nullable=True)
#     actor = db.Column(db.String(120), nullable=True)
#     meta_json = db.Column(db.JSON, default=dict)

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "kind": self.kind,
#             "title": self.title,
#             "action": self.action,
#             "actor": self.actor,
#             "meta_json": self.meta_json,
#             "created_at": self.created_at.isoformat() if self.created_at else None,
#             "updated_at": self.updated_at.isoformat() if self.updated_at else None,
#         }


# __all__ = [
#     "db",
#     "User",
#     "Department",
#     "Unit",
#     "TeachingAssignment",
#     "Enrollment",
#     "Assessment",
#     "Grade",
#     "MissingMarkReport",
#     "Activity",   # ✅ ensure export
# ]



# app/models.py
from __future__ import annotations

from sqlalchemy import func, UniqueConstraint, Index
from .extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


# ---------- Mixins ----------
class TimestampMixin:
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


# ---------- Core Models ----------
class School(TimestampMixin, db.Model):
    __tablename__ = "schools"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False, unique=True, index=True)
    code = db.Column(db.String(32), nullable=False, unique=True, index=True)
    description = db.Column(db.Text, nullable=True)

    # Relationships
    programs = db.relationship(
        "Program",
        back_populates="school",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # users relationship
    users = db.relationship(
        "User",
        back_populates="school", 
        foreign_keys="User.school_id",
        lazy="selectin",
        passive_deletes=True,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "description": self.description,
        }


class Program(TimestampMixin, db.Model):
    __tablename__ = "programs"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    degree_type = db.Column(db.String(50), nullable=True, index=True)  # Bachelor, Master, Diploma, Certificate, PhD
    duration_years = db.Column(db.Integer, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)

    school_id = db.Column(
        db.Integer,
        db.ForeignKey("schools.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # HOD assignment for the program
    hod_user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Relationships
    school = db.relationship(
        "School",
        back_populates="programs",
        foreign_keys=[school_id],
        lazy="selectin",
    )

    hod = db.relationship(
        "User",
        foreign_keys=[hod_user_id],
        back_populates="hod_of_program",
        uselist=False,
        lazy="selectin",
    )

    # users relationship 
    users = db.relationship(
        "User",
        back_populates="program_rel",
        foreign_keys="User.program_id",
        lazy="selectin",
        passive_deletes=True,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "degree_type": self.degree_type,
            "duration_years": self.duration_years,
            "is_active": self.is_active,
            "school_id": self.school_id,
            "hod_user_id": self.hod_user_id,
            "school": self.school.to_dict() if self.school else None,
        }


class Department(TimestampMixin, db.Model):
    __tablename__ = "departments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False, unique=True, index=True)
    code = db.Column(db.String(32), nullable=False, unique=True, index=True)

    # School and Program associations
    school_id = db.Column(
        db.Integer,
        db.ForeignKey("schools.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    program_id = db.Column(
        db.Integer,
        db.ForeignKey("programs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    # Department type for schools with multiple HODs (like EASS)
    department_type = db.Column(
        db.String(50),
        nullable=True,
        default="overall",
        index=True
    )  # 'overall', 'education_science', 'education_arts'

    parent_id = db.Column(
        db.Integer,
        db.ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Relationships
    school = db.relationship(
        "School",
        foreign_keys=[school_id],
        lazy="selectin",
    )
    
    program = db.relationship(
        "Program",
        foreign_keys=[program_id],
        lazy="selectin",
    )

    parent = db.relationship(
        "Department",
        remote_side="Department.id",
        back_populates="children",
        foreign_keys=[parent_id],
        lazy="selectin",
    )

    children = db.relationship(
        "Department",
        back_populates="parent",
        foreign_keys=[parent_id],
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    hod_user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    users = db.relationship(
        "User",
        back_populates="department",
        foreign_keys="User.department_id",
        lazy="selectin",
        passive_deletes=True,
    )

    hod = db.relationship(
        "User",
        foreign_keys=[hod_user_id],
        back_populates="hod_of_department",
        uselist=False,
        lazy="selectin",
    )

    units = db.relationship(
        "Unit",
        back_populates="department",
        foreign_keys="Unit.department_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "hod_user_id": self.hod_user_id,
            "parent_id": self.parent_id,
            "school_id": self.school_id,
            "program_id": self.program_id,
            "department_type": self.department_type,
            "children": [child.id for child in self.children],
            "school": self.school.to_dict() if self.school else None,
            "program": self.program.to_dict() if self.program else None,
        }


class User(TimestampMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    _password_hash = db.Column("password_hash", db.String(256), nullable=False)

    reg_number = db.Column(db.String(64), unique=True, nullable=True, index=True)
    program = db.Column(db.String(160), nullable=True)  # Keep for backward compatibility
    
    # New school and program relationships
    school_id = db.Column(
        db.Integer,
        db.ForeignKey("schools.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    program_id = db.Column(
        db.Integer,
        db.ForeignKey("programs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    # Academic year tracking fields
    academic_year = db.Column(db.Integer, nullable=True, index=True)  # 1, 2, 3, 4
    academic_session = db.Column(db.String(32), nullable=True, index=True)  # e.g., "2023/2024"
    entry_year = db.Column(db.Integer, nullable=True, index=True)  # Year of first enrollment
    study_mode = db.Column(db.String(32), nullable=True, index=True)  # full-time, part-time, weekend

    role = db.Column(db.String(32), nullable=False, default="student", index=True)

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    department = db.relationship(
        "Department",
        back_populates="users",
        foreign_keys=[department_id],
        lazy="selectin",
    )

    # Temporarily commented out until columns exist
    # Relationships
    school = db.relationship(
        "School",
        back_populates="users",
        foreign_keys=[school_id],
        lazy="selectin",
    )

    program_rel = db.relationship(
        "Program",
        back_populates="users",
        foreign_keys=[program_id],
        lazy="selectin",
    )

    hod_of_department = db.relationship(
        "Department",
        back_populates="hod",
        foreign_keys="Department.hod_user_id",
        uselist=False,
        lazy="selectin",
    )

    hod_of_program = db.relationship(
        "Program",
        back_populates="hod",
        foreign_keys="Program.hod_user_id",
        uselist=False,
        lazy="selectin",
    )

    teaching_assignments = db.relationship(
        "TeachingAssignment",
        back_populates="lecturer",
        foreign_keys="TeachingAssignment.lecturer_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    enrollments = db.relationship(
        "Enrollment",
        back_populates="student",
        foreign_keys="Enrollment.student_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    grades_entered = db.relationship(
        "Grade",
        back_populates="entered_by_user",
        foreign_keys="Grade.entered_by",
        lazy="selectin",
    )

    grades_approved = db.relationship(
        "Grade",
        back_populates="approved_by_user",
        foreign_keys="Grade.approved_by",
        lazy="selectin",
    )

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, raw: str):
        self._password_hash = generate_password_hash(raw)

    def set_password(self, raw: str):
        self.password = raw

    def check_password(self, raw: str) -> bool:
        return check_password_hash(self._password_hash, raw)

    def calculate_current_academic_year(self) -> int:
        """Calculate the current academic year based on entry year."""
        if not self.entry_year:
            return None
        
        import datetime
        current_year = datetime.datetime.now().year
        years_elapsed = current_year - self.entry_year
        
        # Assuming academic year starts in September/October
        # If we're past October, we're in the next academic year
        current_month = datetime.datetime.now().month
        if current_month >= 10:  # October or later
            years_elapsed += 1
            
        return min(years_elapsed, 4)  # Cap at 4 years

    def update_academic_year(self):
        """Update the academic year based on current date and entry year."""
        if self.role == "student" and self.entry_year:
            calculated_year = self.calculate_current_academic_year()
            if calculated_year and calculated_year != self.academic_year:
                self.academic_year = calculated_year
                return True
        return False

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": (self.role or "").lower(),  # ✅ ensure lowercase always
            "department_id": self.department_id,
            "department": self.department.to_dict() if self.department else None,
            "school_id": self.school_id,
            # "school": self.school.to_dict() if self.school else None,  # Temporarily commented
            "program_id": self.program_id,
            # "program_rel": self.program_rel.to_dict() if self.program_rel else None,  # Temporarily commented
            "reg_number": self.reg_number,
            "program": self.program,  # Keep for backward compatibility
            "academic_year": self.academic_year,
            "academic_session": self.academic_session,
            "entry_year": self.entry_year,
            "study_mode": self.study_mode,
            "calculated_year": self.calculate_current_academic_year() if self.role == "student" else None,
        }


class Unit(TimestampMixin, db.Model):
    __tablename__ = "units"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), unique=True, nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    credits = db.Column(db.Integer, nullable=True)

    year_level = db.Column(db.Integer, nullable=True, index=True)
    semester = db.Column(db.Integer, nullable=True, index=True)

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    department = db.relationship(
        "Department",
        back_populates="units",
        foreign_keys=[department_id],
        lazy="selectin",
    )

    teaching_assignments = db.relationship(
        "TeachingAssignment",
        back_populates="unit",
        foreign_keys="TeachingAssignment.unit_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    enrollments = db.relationship(
        "Enrollment",
        back_populates="unit",
        foreign_keys="Enrollment.unit_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    assessments = db.relationship(
        "Assessment",
        back_populates="unit",
        foreign_keys="Assessment.unit_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "code": self.code,
            "title": self.title,
            "credits": self.credits,
            "department_id": self.department_id,
            "year_level": self.year_level,
            "semester": self.semester,
        }


# ---------- Linking / Domain Models ----------
class TeachingAssignment(TimestampMixin, db.Model):
    __tablename__ = "teaching_assignments"
    __table_args__ = (
        UniqueConstraint("unit_id", "lecturer_id", name="uq_teach_unit_lecturer"),
        Index("ix_teach_unit_lecturer", "unit_id", "lecturer_id"),
    )

    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(
        db.Integer,
        db.ForeignKey("units.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    lecturer_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    unit = db.relationship(
        "Unit",
        back_populates="teaching_assignments",
        foreign_keys=[unit_id],
        lazy="selectin",
    )
    lecturer = db.relationship(
        "User",
        back_populates="teaching_assignments",
        foreign_keys=[lecturer_id],
        lazy="selectin",
    )


class Enrollment(TimestampMixin, db.Model):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("student_id", "unit_id", name="uq_enroll_student_unit"),
        Index("ix_enroll_student_unit", "student_id", "unit_id"),
    )

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    unit_id = db.Column(
        db.Integer,
        db.ForeignKey("units.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    student = db.relationship(
        "User",
        back_populates="enrollments",
        foreign_keys=[student_id],
        lazy="selectin",
    )
    unit = db.relationship(
        "Unit",
        back_populates="enrollments",
        foreign_keys=[unit_id],
        lazy="selectin",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "unit_id": self.unit_id,
            "student": self.student.to_dict() if self.student else None,
            "unit": self.unit.to_dict() if self.unit else None,
        }


class Assessment(TimestampMixin, db.Model):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(
        db.Integer,
        db.ForeignKey("units.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = db.Column(db.String(200), nullable=False)
    max_score = db.Column(db.Float, nullable=False, default=100.0)
    weight = db.Column(db.Float, nullable=False, default=1.0)
    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    due_at = db.Column(db.DateTime, nullable=True)
    is_published = db.Column(db.Boolean, nullable=False, default=False, index=True)
    study_mode = db.Column(db.String(20), nullable=True, index=True)  # 'full-time', 'part-time', 'weekend'

    unit = db.relationship(
        "Unit",
        back_populates="assessments",
        foreign_keys=[unit_id],
        lazy="selectin",
    )
    creator = db.relationship("User", foreign_keys=[created_by], lazy="selectin")

    grades = db.relationship(
        "Grade",
        back_populates="assessment",
        foreign_keys="Grade.assessment_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "unit_id": self.unit_id,
            "title": self.title,
            "max_score": self.max_score,
            "weight": self.weight,
            "due_at": self.due_at.isoformat() if self.due_at else None,
            "is_published": self.is_published,
            "created_by": self.created_by,
            "study_mode": self.study_mode,
        }


class Grade(TimestampMixin, db.Model):
    __tablename__ = "grades"
    __table_args__ = (
        UniqueConstraint("assessment_id", "student_id", name="uq_grade_assessment_student"),
        Index("ix_grade_status", "status"),
    )

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    score = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="draft", index=True)

    entered_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    approved_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    assessment = db.relationship(
        "Assessment",
        back_populates="grades",
        foreign_keys=[assessment_id],
        lazy="selectin",
    )
    student = db.relationship("User", foreign_keys=[student_id], lazy="selectin")
    entered_by_user = db.relationship("User", foreign_keys=[entered_by], lazy="selectin")
    approved_by_user = db.relationship("User", foreign_keys=[approved_by], lazy="selectin")

    def to_dict(self):
        return {
            "id": self.id,
            "assessment_id": self.assessment_id,
            "student_id": self.student_id,
            "score": self.score,
            "status": self.status,
            "entered_by": self.entered_by,
            "approved_by": self.approved_by,
        }


class MissingMarkReport(TimestampMixin, db.Model):
    __tablename__ = "missing_mark_reports"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    unit_id = db.Column(
        db.Integer,
        db.ForeignKey("units.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    description = db.Column(db.Text, nullable=True)
    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    message = db.Column(db.Text, nullable=True)
    proof_url = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(32), nullable=False, default="Pending", index=True)
    lecturer_note = db.Column(db.Text, nullable=True)

    student = db.relationship("User", foreign_keys=[student_id], lazy="selectin")
    unit = db.relationship("Unit", foreign_keys=[unit_id], lazy="selectin")
    assessment = db.relationship("Assessment", foreign_keys=[assessment_id], lazy="selectin")

    def to_dict(self):
        student_name = self.student.name if self.student and self.student.name else ""
        reg_number = self.student.reg_number if self.student and self.student.reg_number else ""
        unit_name = self.unit.name if self.unit and hasattr(self.unit, 'name') else ""
        unit_code = self.unit.code if self.unit and hasattr(self.unit, 'code') else ""
        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_name": student_name,
            "reg_number": reg_number,
            "unit_id": self.unit_id,
            "unit_name": unit_name,
            "unit_code": unit_code,
            "assessment_id": self.assessment_id,
            "message": self.message,
            "description": self.description,
            "proof_url": self.proof_url,
            "status": self.status,
            "lecturer_note": self.lecturer_note,
        }


# ---------- Notifications ----------
class Notification(TimestampMixin, db.Model):
    __tablename__ = "notifications"
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False, index=True)  # 'transcript_ready', 'grade_published', 'general'
    
    # Target audience
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )  # For individual notifications
    
    role = db.Column(db.String(32), nullable=True, index=True)  # For role-based notifications
    department_id = db.Column(
        db.Integer,
        db.ForeignKey("departments.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )  # For department-based notifications
    
    # Metadata
    is_read = db.Column(db.Boolean, nullable=False, default=False, index=True)
    sent_via_email = db.Column(db.Boolean, nullable=False, default=False, index=True)
    
    # References
    unit_id = db.Column(
        db.Integer,
        db.ForeignKey("units.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )  # For grade-related notifications
    
    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )  # For assessment-related notifications
    
    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )  # Who created the notification
    
    # Relationships
    user = db.relationship(
        "User",
        foreign_keys=[user_id],
        lazy="selectin",
    )
    
    department = db.relationship(
        "Department",
        foreign_keys=[department_id],
        lazy="selectin",
    )
    
    unit = db.relationship(
        "Unit",
        foreign_keys=[unit_id],
        lazy="selectin",
    )
    
    assessment = db.relationship(
        "Assessment",
        foreign_keys=[assessment_id],
        lazy="selectin",
    )
    
    creator = db.relationship(
        "User",
        foreign_keys=[created_by],
        lazy="selectin",
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "user_id": self.user_id,
            "role": self.role,
            "department_id": self.department_id,
            "is_read": self.is_read,
            "sent_via_email": self.sent_via_email,
            "unit_id": self.unit_id,
            "assessment_id": self.assessment_id,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "unit": self.unit.to_dict() if self.unit else None,
            "assessment": self.assessment.to_dict() if self.assessment else None,
        }


# ---------- Admin Dashboard Helper ----------
class Activity(TimestampMixin, db.Model):
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True)
    kind = db.Column(db.String(20), nullable=False, default="activity", index=True)
    title = db.Column(db.String(255), nullable=True)
    action = db.Column(db.String(255), nullable=True)
    actor = db.Column(db.String(120), nullable=True)
    meta_json = db.Column(db.JSON, default=dict)

    def to_dict(self):
        return {
            "id": self.id,
            "kind": self.kind,
            "title": self.title,
            "action": self.action,
            "actor": self.actor,
            "meta_json": self.meta_json,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


__all__ = [
    "db",
    "School",
    "Program", 
    "User",
    "Department",
    "Unit",
    "TeachingAssignment",
    "Enrollment",
    "Assessment",
    "Grade",
    "MissingMarkReport",
    "Notification",
    "Activity",
]
