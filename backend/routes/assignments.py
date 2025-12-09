from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import Assignment, Class, Submission
from extensions import db
from datetime import datetime

assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/', methods=['GET'])
@login_required
def get_assignments():
    if current_user.role == 'student':
        # Find class of the student
        # Assuming student.class_name matches Class.name
        student_class = Class.query.filter_by(name=current_user.class_name).first()
        if not student_class:
            return jsonify([])
        assignments = Assignment.query.filter_by(class_id=student_class.id).all()
    elif current_user.role == 'teacher':
        # Get assignments for classes taught by this teacher
        classes = Class.query.filter_by(teacher_id=current_user.id).with_entities(Class.id).all()
        class_ids = [c.id for c in classes]
        assignments = Assignment.query.filter(Assignment.class_id.in_(class_ids)).all()
    else:
        assignments = []

    results = []
    for a in assignments:
        submission_status = 'pending'
        grade = None
        if current_user.role == 'student':
            submission = Submission.query.filter_by(assignment_id=a.id, student_id=current_user.id).first()
            if submission:
                submission_status = submission.status
                grade = submission.grade
        
        results.append({
            'id': a.id,
            'title': a.title,
            'subject': a.subject,
            'description': a.description,
            'due_date': a.due_date.isoformat() if a.due_date else None,
            'status': a.status,
            'class_name': a.course.name,
            'submission_status': submission_status,
            'grade': grade
        })

    return jsonify(results)

@assignments_bp.route('/', methods=['POST'])
@login_required
def create_assignment():
    if current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.json
    class_id = data.get('class_id')
    
    # Verify teacher owns this class
    cls = Class.query.get(class_id)
    if not cls or cls.teacher_id != current_user.id:
        return jsonify({'error': 'Invalid class'}), 400

    assignment = Assignment(
        title=data['title'],
        subject=data.get('subject'),
        description=data.get('description'),
        class_id=class_id,
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify({'message': 'Assignment created', 'id': assignment.id}), 201

@assignments_bp.route('/<int:id>', methods=['GET'])
@login_required
def get_assignment(id):
    assignment = Assignment.query.get_or_404(id)
    # Add authorization check here if needed
    return jsonify({
        'id': assignment.id,
        'title': assignment.title,
        'subject': assignment.subject,
        'description': assignment.description,
        'due_date': assignment.due_date.isoformat() if assignment.due_date else None,
        'class_id': assignment.class_id
    })
