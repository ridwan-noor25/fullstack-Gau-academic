from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from .extensions import db
from .models import Notification, User, Department, Unit, Assessment, Enrollment
from .decorators import role_required
from flask_mailman import EmailMessage
import os
from sqlalchemy import and_, or_

notifications_bp = Blueprint('notification_system', __name__)


def send_email_notification(to_email, subject, body):
    """Send email notification using Flask-Mailman"""
    try:
        msg = EmailMessage(
            subject=subject,
            body=body,
            from_email=current_app.config.get('DEFAULT_FROM_EMAIL'),
            to=[to_email],
        )
        msg.content_subtype = "html"  # Set content type to HTML
        msg.send()
        current_app.logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        current_app.logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False


def create_notification(title, message, notification_type, **kwargs):
    """Helper function to create notifications"""
    notification = Notification(
        title=title,
        message=message,
        type=notification_type,
        user_id=kwargs.get('user_id'),
        role=kwargs.get('role'),
        department_id=kwargs.get('department_id'),
        unit_id=kwargs.get('unit_id'),
        assessment_id=kwargs.get('assessment_id'),
        created_by=kwargs.get('created_by')
    )
    
    db.session.add(notification)
    db.session.commit()
    
    # Send email if user-specific notification
    if notification.user_id:
        user = User.query.get(notification.user_id)
        if user and kwargs.get('send_email', True):
            email_body = f"""
            <html>
                <body>
                    <h2>{title}</h2>
                    <p>{message}</p>
                    <p>Login to your GAU-GradeView portal to view details.</p>
                    <br>
                    <p>Best regards,<br>GAU Academic Team</p>
                </body>
            </html>
            """
            if send_email_notification(user.email, title, email_body):
                notification.sent_via_email = True
                db.session.commit()
    
    return notification


@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get notifications for the current user"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get notifications for this user
        notifications = Notification.query.filter(
            or_(
                Notification.user_id == current_user_id,
                and_(
                    Notification.role == user.role,
                    Notification.user_id.is_(None)
                ),
                and_(
                    Notification.department_id == user.department_id,
                    Notification.user_id.is_(None),
                    Notification.role.is_(None)
                )
            )
        ).order_by(Notification.created_at.desc()).all()
        
        return jsonify({
            "notifications": [notification.to_dict() for notification in notifications],
            "unread_count": len([n for n in notifications if not n.is_read])
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching notifications: {str(e)}")
        return jsonify({"error": "Failed to fetch notifications"}), 500


@notifications_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    try:
        current_user_id = get_jwt_identity()
        
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()
        
        if not notification:
            return jsonify({"error": "Notification not found"}), 404
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({"message": "Notification marked as read"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error marking notification as read: {str(e)}")
        return jsonify({"error": "Failed to update notification"}), 500


@notifications_bp.route('/notifications/transcripts/notify', methods=['POST'])
@jwt_required()
@role_required(['hod'])
def notify_transcript_ready():
    """HOD endpoint to notify all students that transcripts are ready"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.hod_of_department:
            return jsonify({"error": "Only HODs can send transcript notifications"}), 403
        
        data = request.get_json()
        custom_message = data.get('message', '')
        
        # Get all students in the department
        students = User.query.filter_by(
            role='student',
            department_id=user.hod_of_department.id
        ).all()
        
        title = "📜 Transcripts Ready for Collection"
        
        notifications_created = 0
        emails_sent = 0
        
        for student in students:
            # Create in-app notification for the bell icon count
            notification = create_notification(
                title=title,
                message=f"Your academic transcripts are ready for collection. {custom_message}",
                notification_type='transcript_ready',
                user_id=student.id,
                department_id=user.hod_of_department.id,
                created_by=current_user_id,
                send_email=False  # We'll send email separately
            )
            notifications_created += 1
            
            # Send email notification
            email_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="https://gau.ac.ke/wp-content/uploads/2020/03/GAU-Logo.png" alt="GAU Logo" style="height: 80px;">
                            <h1 style="color: #007C2E; margin: 10px 0;">Garissa University</h1>
                        </div>
                        
                        <h2 style="color: #007C2E;">📜 Transcripts Ready for Collection</h2>
                        
                        <p>Dear {student.name},</p>
                        
                        <p>Your academic transcripts are now ready for collection.</p>
                        
                        {f"<p><strong>Additional Information:</strong> {custom_message}</p>" if custom_message else ""}
                        
                        <p>Please visit the academic office during office hours to collect your transcripts.</p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007C2E; margin: 20px 0;">
                            <p><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>
                            <p><strong>Location:</strong> Academic Office, Administration Block</p>
                        </div>
                        
                        <p>Thank you.</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="text-align: center; color: #666; font-size: 12px;">
                            This is an automated message from GAU-GradeView System<br>
                            Please do not reply to this email.
                        </p>
                    </div>
                </body>
            </html>
            """
            
            if send_email_notification(student.email, title, email_body):
                emails_sent += 1
        
        return jsonify({
            "message": f"Transcript notifications sent to {notifications_created} students ({emails_sent} emails sent)",
            "count": notifications_created,
            "emails_sent": emails_sent
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending transcript notifications: {str(e)}")
        return jsonify({"error": "Failed to send notifications"}), 500


def notify_students_grades_published(unit_id, assessment_name):
    """Helper function to notify students when grades are published"""
    try:
        unit = Unit.query.get(unit_id)
        if not unit:
            return False
            
        # Get all students enrolled in this unit
        enrollments = Enrollment.query.filter_by(unit_id=unit_id).all()
        
        title = f"📊 Grades Published: {unit.code}"
        
        for enrollment in enrollments:
            student = enrollment.student
            if not student:
                continue
                
            # Create in-app notification
            create_notification(
                title=title,
                message=f"Your grades for {assessment_name} in {unit.code} - {unit.title} have been published. Check your grades page to view them.",
                notification_type='grade_published',
                user_id=student.id,
                unit_id=unit_id,
                send_email=False  # We'll send email separately
            )
            
            # Send email notification
            email_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="https://gau.ac.ke/wp-content/uploads/2020/03/GAU-Logo.png" alt="GAU Logo" style="height: 80px;">
                            <h1 style="color: #007C2E; margin: 10px 0;">Garissa University</h1>
                        </div>
                        
                        <h2 style="color: #007C2E;">📊 New Grades Available</h2>
                        
                        <p>Dear {student.name},</p>
                        
                        <p>Your grades for <strong>{assessment_name}</strong> in <strong>{unit.code} - {unit.title}</strong> have been published.</p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007C2E; margin: 20px 0;">
                            <p><strong>Unit:</strong> {unit.code} - {unit.title}</p>
                            <p><strong>Assessment:</strong> {assessment_name}</p>
                        </div>
                        
                        <p>You can view your grades by logging into your GAU-GradeView student portal.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:5174/login" style="background-color: #007C2E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                View My Grades
                            </a>
                        </div>
                        
                        <p>Best regards,<br>Academic Team</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="text-align: center; color: #666; font-size: 12px;">
                            This is an automated message from GAU-GradeView System<br>
                            Please do not reply to this email.
                        </p>
                    </div>
                </body>
            </html>
            """
            
            send_email_notification(student.email, title, email_body)
        
        return True
        
    except Exception as e:
        current_app.logger.error(f"Error notifying students about published grades: {str(e)}")
        return False


@notifications_bp.route('/notifications/grades/published', methods=['POST'])
@jwt_required()
@role_required(['lecturer'])
def notify_grades_published():
    """Automatically called when grades are published"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        unit_id = data.get('unit_id')
        assessment_id = data.get('assessment_id')
        
        if not unit_id:
            return jsonify({"error": "Unit ID is required"}), 400
        
        unit = Unit.query.get(unit_id)
        assessment = Assessment.query.get(assessment_id) if assessment_id else None
        
        if not unit:
            return jsonify({"error": "Unit not found"}), 404
        
        # Get enrolled students
        enrollments = Enrollment.query.filter_by(unit_id=unit_id).all()
        student_ids = [e.student_id for e in enrollments]
        
        if assessment:
            title = f"📊 New Grades Published - {unit.code}"
            message = f"""
            Dear Student,
            
            New grades have been published for {unit.code} - {unit.title}.
            
            Assessment: {assessment.title}
            
            Login to your portal to view your grades.
            
            Best regards,
            Academic Team
            """
        else:
            title = f"📊 Unit Grades Published - {unit.code}"
            message = f"""
            Dear Student,
            
            All grades have been published for {unit.code} - {unit.title}.
            
            Login to your portal to view your complete grades.
            
            Best regards,
            Academic Team
            """
        
        notifications_created = 0
        
        for student_id in student_ids:
            create_notification(
                title=title,
                message=message,
                notification_type='grade_published',
                user_id=student_id,
                unit_id=unit_id,
                assessment_id=assessment_id,
                created_by=current_user_id,
                send_email=True
            )
            notifications_created += 1
        
        return jsonify({
            "message": f"Grade notifications sent to {notifications_created} students",
            "count": notifications_created
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending grade notifications: {str(e)}")
        return jsonify({"error": "Failed to send notifications"}), 500


@notifications_bp.route('/notifications/count', methods=['GET'])
@jwt_required()
def get_notification_count():
    """Get unread notification count for dashboard"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Count unread notifications
        unread_count = Notification.query.filter(
            and_(
                or_(
                    Notification.user_id == current_user_id,
                    and_(
                        Notification.role == user.role,
                        Notification.user_id.is_(None)
                    ),
                    and_(
                        Notification.department_id == user.department_id,
                        Notification.user_id.is_(None),
                        Notification.role.is_(None)
                    )
                ),
                Notification.is_read == False
            )
        ).count()
        
        return jsonify({"count": unread_count}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting notification count: {str(e)}")
        return jsonify({"error": "Failed to get notification count"}), 500


@notifications_bp.route('/notifications/all/read', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Update user-specific notifications
        Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).update({"is_read": True})
        
        db.session.commit()
        
        return jsonify({"message": "All notifications marked as read"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error marking all notifications as read: {str(e)}")
        return jsonify({"error": "Failed to update notifications"}), 500