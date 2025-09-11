# app/models.py
from __future__ import annotations

from sqlalchemy import func, UniqueConstraint
from .extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


# ---------- Mixins ----------
class TimestampMixin:
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(
        db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )


# ---------- Core Models ----------
class Department(TimestampMixin, db.Model):
    __tablename__ = "departments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False, unique=True, index=True)
    code = db.Column(db.String(32), nullable=False, unique=True, index=True)

    # Head of Department (HoD) -> users.id
    hod_user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    # Relationships
    users = db.relationship(
        "User",
        back_populates="department",
        foreign_keys="User.department_id",
        lazy="selectin",
        cascade="all, delete-orphan",
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
        }

    def __repr__(self) -> str:
        return f"<Department id={self.id} code={self.code!r} name={self.name!r}>"


class User(TimestampMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    _password_hash = db.Column("password_hash", db.String(256), nullable=False)

    # Optional student details
    reg_number = db.Column(db.String(64), unique=True, nullable=True, index=True)
    program = db.Column(db.String(160), nullable=True)  # course/degree name

    # Roles: admin | hod | lecturer | student
    role = db.Column(db.String(32), nullable=False, default="student", index=True)

    # Home department
    department_id = db.Column(
        db.Integer, db.ForeignKey("departments.id", ondelete="SET NULL"), nullable=True
    )

    department = db.relationship(
        "Department",
        back_populates="users",
        foreign_keys=[department_id],
        lazy="selectin",
    )

    # HoD link (single department)
    hod_of_department = db.relationship(
        "Department",
        back_populates="hod",
        foreign_keys="Department.hod_user_id",
        uselist=False,
        lazy="selectin",
    )

    # Teaching assignments (if lecturer)
    teaching_assignments = db.relationship(
        "TeachingAssignment",
        back_populates="lecturer",
        foreign_keys="TeachingAssignment.lecturer_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Enrollments (if student)
    enrollments = db.relationship(
        "Enrollment",
        back_populates="student",
        foreign_keys="Enrollment.student_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Grades entered/approved by this user
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

    # Auth helpers
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

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "department_id": self.department_id,
            "reg_number": self.reg_number,
            "program": self.program,
        }

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"


class Unit(TimestampMixin, db.Model):
    __tablename__ = "units"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), unique=True, nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    credits = db.Column(db.Integer, nullable=True)

    # NEW: term awareness
    year_level = db.Column(db.Integer, nullable=True)  # e.g., 1..6
    semester = db.Column(db.Integer, nullable=True)    # e.g., 1..3

    department_id = db.Column(
        db.Integer, db.ForeignKey("departments.id", ondelete="SET NULL"), nullable=True
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

    def __repr__(self) -> str:
        return f"<Unit id={self.id} code={self.code!r} title={self.title!r}>"

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
    )

    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(
        db.Integer, db.ForeignKey("units.id", ondelete="CASCADE"), nullable=False
    )
    lecturer_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
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

    def to_dict(self) -> dict:
        return {"id": self.id, "unit_id": self.unit_id, "lecturer_id": self.lecturer_id}


class Enrollment(TimestampMixin, db.Model):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("student_id", "unit_id", name="uq_enroll_student_unit"),
    )

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    unit_id = db.Column(
        db.Integer, db.ForeignKey("units.id", ondelete="CASCADE"), nullable=False
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

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "student_id": self.student_id,
            "unit_id": self.unit_id,
        }


class Assessment(TimestampMixin, db.Model):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(
        db.Integer, db.ForeignKey("units.id", ondelete="CASCADE"), nullable=False
    )
    title = db.Column(db.String(200), nullable=False)
    max_score = db.Column(db.Float, nullable=False, default=100.0)
    weight = db.Column(db.Float, nullable=False, default=1.0)  # 0..1
    created_by = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    # Optional fields
    due_at = db.Column(db.DateTime, nullable=True)
    is_published = db.Column(db.Boolean, nullable=False, default=False)

    unit = db.relationship(
        "Unit", back_populates="assessments", foreign_keys=[unit_id], lazy="selectin"
    )
    creator = db.relationship(
        "User", foreign_keys=[created_by], lazy="selectin"
    )

    grades = db.relationship(
        "Grade",
        back_populates="assessment",
        foreign_keys="Grade.assessment_id",
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "unit_id": self.unit_id,
            "title": self.title,
            "max_score": self.max_score,
            "weight": self.weight,
            "created_by": self.created_by,
            "due_at": self.due_at.isoformat() if self.due_at else None,
            "is_published": self.is_published,
        }


class Grade(TimestampMixin, db.Model):
    __tablename__ = "grades"
    __table_args__ = (
        UniqueConstraint("assessment_id", "student_id", name="uq_grade_assessment_student"),
    )

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(
        db.Integer, db.ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False
    )
    student_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    score = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="draft")  # draft/submitted/approved/published
    entered_by = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    approved_by = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    assessment = db.relationship(
        "Assessment", back_populates="grades", foreign_keys=[assessment_id], lazy="selectin"
    )
    student = db.relationship(
        "User", foreign_keys=[student_id], lazy="selectin"
    )
    entered_by_user = db.relationship(
        "User", foreign_keys=[entered_by], lazy="selectin"
    )
    approved_by_user = db.relationship(
        "User", foreign_keys=[approved_by], lazy="selectin"
    )

    def to_dict(self) -> dict:
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
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    unit_id = db.Column(
        db.Integer, db.ForeignKey("units.id", ondelete="CASCADE"), nullable=False
    )

    # Legacy
    description = db.Column(db.Text, nullable=True)

    # Richer fields
    assessment_id = db.Column(
        db.Integer, db.ForeignKey("assessments.id", ondelete="SET NULL"), nullable=True
    )
    message = db.Column(db.Text, nullable=True)
    proof_url = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(32), nullable=False, default="Pending")  # Pending/Seen/Resolved
    lecturer_note = db.Column(db.Text, nullable=True)

    student = db.relationship("User", foreign_keys=[student_id], lazy="selectin")
    unit = db.relationship("Unit", foreign_keys=[unit_id], lazy="selectin")
    assessment = db.relationship("Assessment", foreign_keys=[assessment_id], lazy="selectin")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "student_id": self.student_id,
            "unit_id": self.unit_id,
            "description": self.description,
            "assessment_id": self.assessment_id,
            "message": self.message,
            "proof_url": self.proof_url,
            "status": self.status,
            "lecturer_note": self.lecturer_note,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


__all__ = [
    "db",
    "User",
    "Department",
    "Unit",
    "TeachingAssignment",
    "Enrollment",
    "Assessment",
    "Grade",
    "MissingMarkReport",
]
