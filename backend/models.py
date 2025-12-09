from extensions import db
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'teacher', 'student', 'admin'
    pin = db.Column(db.String(4)) # 4-digit PIN
    class_name = db.Column(db.String(50)) # For students, e.g., "5A"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    classes_teaching = db.relationship('Class', backref='teacher', lazy=True)
    submissions = db.relationship('Submission', backref='student', lazy=True)
    resources = db.relationship('Resource', backref='author', lazy=True)
    chat_history = db.relationship('ChatHistory', backref='user', lazy=True)

class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    assignments = db.relationship('Assignment', backref='course', lazy=True)

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(100))
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    status = db.Column(db.String(20), default='pending') # 'pending', 'completed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    submissions = db.relationship('Submission', backref='assignment', lazy=True)

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text) # Text or URL to file
    grade = db.Column(db.String(10))
    feedback = db.Column(db.Text)
    status = db.Column(db.String(20), default='submitted') # 'submitted', 'graded'
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50)) # 'worksheet', 'visual', 'quiz'
    content = db.Column(db.Text) # Markdown content or JSON
    subject = db.Column(db.String(100))
    grade = db.Column(db.String(50))
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    role = db.Column(db.String(20)) # 'user', 'ai'
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
