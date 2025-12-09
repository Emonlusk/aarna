from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import User
from extensions import db
from werkzeug.security import generate_password_hash

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@login_required
def get_users():
    if current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
        
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'name': u.name,
        'email': u.email,
        'role': u.role,
        'status': 'active' # Placeholder
    } for u in users])

@users_bp.route('/public', methods=['GET'])
def get_public_users():
    role = request.args.get('role')
    class_name = request.args.get('class_name')
    
    query = User.query
    if role:
        query = query.filter_by(role=role)
    if class_name:
        query = query.filter_by(class_name=class_name)
        
    users = query.all()
    return jsonify([{
        'id': u.id,
        'name': u.name,
        'role': u.role,
        'class_name': u.class_name
    } for u in users])

@users_bp.route('/', methods=['POST'])
@login_required
def create_user():
    if current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
        
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
        
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data['role'],
        pin=data.get('pin'),
        class_name=data.get('class_name')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created', 'id': user.id}), 201

@users_bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    if current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
        
    user = User.query.get_or_404(id)
    if user.id == current_user.id:
        return jsonify({'error': 'Cannot delete yourself'}), 400
        
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200
