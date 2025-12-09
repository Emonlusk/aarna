from app import create_app
from extensions import db
from models import User, Class, Assignment, Resource
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # Create Users
    teacher = User(
        name='Ms. Sarah Johnson',
        email='sarah@school.org',
        password_hash=generate_password_hash('password'),
        role='teacher',
        pin='1234'
    )
    
    student = User(
        name='Alex Kumar',
        email='alex@school.org',
        password_hash=generate_password_hash('password'),
        role='student',
        pin='1234',
        class_name='5A'
    )
    
    admin = User(
        name='Principal Williams',
        email='admin@school.org',
        password_hash=generate_password_hash('password'),
        role='admin',
        pin='1234'
    )

    db.session.add_all([teacher, student, admin])
    db.session.commit()

    # Create Class
    class_5a = Class(name='5A', teacher_id=teacher.id)
    db.session.add(class_5a)
    db.session.commit()

    # Create Assignments
    assignment1 = Assignment(
        title='Fractions Worksheet',
        subject='Mathematics',
        description='Complete the attached worksheet on adding fractions.',
        due_date=datetime.now() + timedelta(days=2),
        class_id=class_5a.id,
        status='pending'
    )
    
    assignment2 = Assignment(
        title='Photosynthesis Essay',
        subject='Science',
        description='Write a short essay explaining the process of photosynthesis.',
        due_date=datetime.now() + timedelta(days=5),
        class_id=class_5a.id,
        status='pending'
    )

    db.session.add_all([assignment1, assignment2])
    db.session.commit()

    # Create Resources
    resource1 = Resource(
        title='Fractions Guide',
        type='worksheet',
        subject='Mathematics',
        grade='Grade 5',
        content='This is a guide on fractions...',
        teacher_id=teacher.id
    )

    db.session.add(resource1)
    db.session.commit()

    print("Database seeded successfully!")
