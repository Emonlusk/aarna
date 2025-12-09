from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import Class, User
from extensions import db

classes_bp = Blueprint('classes', __name__)

@classes_bp.route('/', methods=['GET'])
@login_required
def get_classes():
    if current_user.role == 'teacher':
        classes = Class.query.filter_by(teacher_id=current_user.id).all()
    elif current_user.role == 'student':
        # For now, assuming manual enrollment or simple logic
        # In the new model, we don't have a many-to-many table explicitly defined in models.py 
        # (Wait, I removed the secondary table in the previous step's models.py update? Let me check models.py again)
        # Ah, I see I removed 'student_class' table in the new models.py. 
        # The User model has 'class_name'. So students belong to one class effectively in this simple schema?
        # Or I should have kept the many-to-many.
        # The new models.py has: class_name = db.Column(db.String(50))
        # This implies a student belongs to one class string (e.g. "5A").
        # And Class model has name="5A".
        # So we can link them by name.
        classes = Class.query.filter_by(name=current_user.class_name).all()
    elif current_user.role == 'admin':
        classes = Class.query.all()
    else:
        classes = []
        
    return jsonify([{
        'id': c.id, 
        'name': c.name, 
        'teacher': c.teacher.name
    } for c in classes])

@classes_bp.route('/public', methods=['GET'])
def get_public_classes():
    classes = Class.query.all()
    return jsonify([{
        'id': c.id, 
        'name': c.name, 
        'teacher': c.teacher.name
    } for c in classes])

@classes_bp.route('/', methods=['POST'])
@login_required
def create_class():
    if current_user.role not in ['teacher', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
        
    data = request.json
    new_class = Class(name=data['name'], teacher_id=current_user.id)
    db.session.add(new_class)
    db.session.commit()
    return jsonify({'message': 'Class created', 'id': new_class.id}), 201

@classes_bp.route('/<int:class_id>', methods=['DELETE'])
@login_required
def delete_class(class_id):
    cls = Class.query.get_or_404(class_id)
    if current_user.role != 'admin' and (current_user.role != 'teacher' or cls.teacher_id != current_user.id):
        return jsonify({'error': 'Unauthorized'}), 403
        
    db.session.delete(cls)
    db.session.commit()
    return jsonify({'message': 'Class deleted'}), 200
