from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Class
from extensions import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/public/classes', methods=['GET'])
def get_public_classes():
    # Return list of unique class names for login dropdown
    # Assuming class_name in User model is what we use for grouping students
    # Or we can use the Class model names. Let's use Class model names.
    classes = Class.query.with_entities(Class.name).distinct().all()
    return jsonify([c.name for c in classes])

@auth_bp.route('/public/users', methods=['GET'])
def get_public_users():
    role = request.args.get('role')
    class_name = request.args.get('class_name')
    
    query = User.query
    
    if role:
        query = query.filter_by(role=role)
    
    if class_name and role == 'student':
        query = query.filter_by(class_name=class_name)
        
    users = query.with_entities(User.id, User.name).all()
    return jsonify([{'id': u.id, 'name': u.name} for u in users])

@auth_bp.route('/register', methods=['POST'])
def register():
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
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Login with User ID and PIN (New Flow)
    if 'user_id' in data and 'pin' in data:
        user = User.query.get(data['user_id'])
        if user and user.pin == data['pin']:
            login_user(user)
            return jsonify({
                'message': 'Logged in successfully',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'role': user.role,
                    'email': user.email,
                    'className': user.class_name
                }
            }), 200
        return jsonify({'error': 'Invalid PIN'}), 401

    # Login with Email/Password (Fallback/Admin)
    if 'email' in data and 'password' in data:
        user = User.query.filter_by(email=data['email']).first()
        if user and check_password_hash(user.password_hash, data['password']):
            login_user(user)
            return jsonify({
                'message': 'Logged in successfully',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'role': user.role,
                    'email': user.email,
                    'className': user.class_name
                }
            }), 200
            
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({
        'id': current_user.id,
        'name': current_user.name,
        'role': current_user.role,
        'email': current_user.email,
        'className': current_user.class_name
    })

@auth_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.json
    current_pin = data.get('currentPin')
    
    if not current_pin or current_user.pin != current_pin:
        return jsonify({'error': 'Invalid current PIN'}), 403
        
    if 'name' in data:
        current_user.name = data['name']
        
    if 'pin' in data and data['pin']:
        # Ensure PIN is 4 digits
        if len(data['pin']) == 4 and data['pin'].isdigit():
            current_user.pin = data['pin']
        else:
            return jsonify({'error': 'PIN must be 4 digits'}), 400
            
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': {
            'id': current_user.id,
            'name': current_user.name,
            'role': current_user.role,
            'email': current_user.email,
            'className': current_user.class_name
        }
    })
