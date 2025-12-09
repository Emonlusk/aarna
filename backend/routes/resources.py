from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import Resource
from extensions import db

resources_bp = Blueprint('resources', __name__)

@resources_bp.route('/', methods=['GET'])
@login_required
def get_resources():
    # Filter by type or subject if provided
    type_filter = request.args.get('type')
    subject_filter = request.args.get('subject')
    
    query = Resource.query
    if type_filter:
        query = query.filter_by(type=type_filter)
    if subject_filter:
        query = query.filter_by(subject=subject_filter)
        
    # If teacher, show their own resources + maybe shared ones?
    # For now, let's show all resources created by this teacher
    if current_user.role == 'teacher':
        query = query.filter_by(teacher_id=current_user.id)
        
    resources = query.all()
    return jsonify([{
        'id': r.id,
        'title': r.title,
        'type': r.type,
        'subject': r.subject,
        'grade': r.grade,
        'created_at': r.created_at.strftime('%Y-%m-%d')
    } for r in resources])

@resources_bp.route('/', methods=['POST'])
@login_required
def create_resource():
    if current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.json
    resource = Resource(
        title=data['title'],
        type=data['type'],
        content=data.get('content'),
        subject=data.get('subject'),
        grade=data.get('grade'),
        teacher_id=current_user.id
    )
    db.session.add(resource)
    db.session.commit()
    return jsonify({'message': 'Resource saved', 'id': resource.id}), 201

@resources_bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_resource(id):
    resource = Resource.query.get_or_404(id)
    if resource.teacher_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    db.session.delete(resource)
    db.session.commit()
    return jsonify({'message': 'Resource deleted'}), 200
