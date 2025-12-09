from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import Submission, Assignment, Class
from extensions import db

submissions_bp = Blueprint('submissions', __name__)

@submissions_bp.route('/', methods=['POST'])
@login_required
def submit_assignment():
    if current_user.role != 'student':
        return jsonify({'error': 'Only students can submit'}), 403

    data = request.json
    assignment_id = data.get('assignment_id')
    
    # Check if assignment exists
    assignment = Assignment.query.get_or_404(assignment_id)
    
    submission = Submission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        content=data.get('content'),
        status='submitted'
    )
    db.session.add(submission)
    db.session.commit()
    return jsonify({'message': 'Assignment submitted', 'id': submission.id}), 201

@submissions_bp.route('/assignment/<int:assignment_id>', methods=['GET'])
@login_required
def get_submissions(assignment_id):
    if current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
        
    # Verify teacher owns the assignment's class
    assignment = Assignment.query.get_or_404(assignment_id)
    if assignment.course.teacher_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
    return jsonify([{
        'id': s.id,
        'student_name': s.student.name,
        'content': s.content,
        'submitted_at': s.submitted_at.isoformat(),
        'grade': s.grade,
        'status': s.status
    } for s in submissions])

@submissions_bp.route('/<int:id>', methods=['GET'])
@login_required
def get_submission(id):
    submission = Submission.query.get_or_404(id)
    
    # Authorization: Teacher of the class OR Student who submitted
    if current_user.role == 'teacher':
        if submission.assignment.course.teacher_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
    elif current_user.role == 'student':
        if submission.student_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
    else:
        return jsonify({'error': 'Unauthorized'}), 403

    return jsonify({
        'id': submission.id,
        'student_name': submission.student.name,
        'content': submission.content,
        'submitted_at': submission.submitted_at.isoformat(),
        'grade': submission.grade,
        'feedback': submission.feedback,
        'status': submission.status,
        'assignment_title': submission.assignment.title,
        'assignment_description': submission.assignment.description
    })

@submissions_bp.route('/<int:id>/grade', methods=['POST'])
@login_required
def grade_submission(id):
    if current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
        
    submission = Submission.query.get_or_404(id)
    if submission.assignment.course.teacher_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    data = request.json
    submission.grade = data.get('grade')
    submission.feedback = data.get('feedback')
    submission.status = 'graded'
    
    db.session.commit()
    return jsonify({'message': 'Grade saved'}), 200

@submissions_bp.route('/pending', methods=['GET'])
@login_required
def get_pending_submissions():
    if current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
        
    # Join Submission with Assignment and Class to filter by teacher
    submissions = Submission.query.join(Assignment).join(Class).filter(
        Class.teacher_id == current_user.id,
        Submission.status != 'graded'
    ).all()
    
    return jsonify([{
        'id': s.id,
        'student_name': s.student.name,
        'assignment_title': s.assignment.title,
        'submitted_at': s.submitted_at.isoformat(),
        'status': s.status
    } for s in submissions])
