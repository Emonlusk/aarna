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

    # Create Teachers
    teacher1 = User(
        name='Mr. Johnson',
        email='johnson@school.org',
        password_hash=generate_password_hash('password'),
        role='teacher',
        pin='1234'
    )
    
    teacher2 = User(
        name='Ms. Garcia',
        email='garcia@school.org',
        password_hash=generate_password_hash('password'),
        role='teacher',
        pin='1234'
    )
    
    teacher3 = User(
        name='Mrs. Thompson',
        email='thompson@school.org',
        password_hash=generate_password_hash('password'),
        role='teacher',
        pin='1234'
    )

    # Create Students
    student1 = User(
        name='Emma Wilson',
        email='emma@school.org',
        password_hash=generate_password_hash('password'),
        role='student',
        pin='1234',
        class_name='Grade 5A'
    )
    
    student2 = User(
        name='James Chen',
        email='james@school.org',
        password_hash=generate_password_hash('password'),
        role='student',
        pin='1234',
        class_name='Grade 5A'
    )
    
    student3 = User(
        name='Sofia Martinez',
        email='sofia@school.org',
        password_hash=generate_password_hash('password'),
        role='student',
        pin='1234',
        class_name='Grade 5B'
    )
    
    # Create Admins
    admin1 = User(
        name='Dr. Anderson',
        email='admin@school.org',
        password_hash=generate_password_hash('password'),
        role='admin',
        pin='1234'
    )
    
    admin2 = User(
        name='Ms. Roberts',
        email='roberts@school.org',
        password_hash=generate_password_hash('password'),
        role='admin',
        pin='1234'
    )

    db.session.add_all([teacher1, teacher2, teacher3, student1, student2, student3, admin1, admin2])
    db.session.commit()

    # Create Classes
    class_5a = Class(name='Grade 5A', teacher_id=teacher1.id)
    class_5b = Class(name='Grade 5B', teacher_id=teacher2.id)
    db.session.add_all([class_5a, class_5b])
    db.session.commit()

    # Create Assignments
    assignment1 = Assignment(
        title='Write a short story about your summer vacation',
        subject='English',
        description='Write a creative short story (200-300 words) about a memorable summer vacation experience.',
        due_date=datetime.now() + timedelta(days=5),
        class_id=class_5a.id,
        status='pending'
    )
    
    assignment2 = Assignment(
        title='Complete math worksheet: Fractions',
        subject='Mathematics',
        description='Complete the attached worksheet on adding and subtracting fractions with unlike denominators.',
        due_date=datetime.now() + timedelta(days=2),
        class_id=class_5a.id,
        status='pending'
    )
    
    assignment3 = Assignment(
        title='Science project: Water cycle diagram',
        subject='Science',
        description='Create a colorful diagram showing the water cycle with labels for evaporation, condensation, and precipitation.',
        due_date=datetime.now() + timedelta(days=7),
        class_id=class_5a.id,
        status='pending'
    )

    db.session.add_all([assignment1, assignment2, assignment3])
    db.session.commit()

    # Create Resources
    resource1 = Resource(
        title='Fractions Guide',
        type='worksheet',
        subject='Mathematics',
        grade='Grade 5',
        content='A comprehensive guide on understanding and working with fractions...',
        teacher_id=teacher1.id
    )
    
    resource2 = Resource(
        title='Water Cycle Explanation',
        type='video',
        subject='Science',
        grade='Grade 5',
        content='Video explaining the water cycle process...',
        teacher_id=teacher2.id
    )

    db.session.add_all([resource1, resource2])
    db.session.commit()

    print("✅ Database seeded successfully!")
    print("\n📋 Test Accounts Created:")
    print("="*50)
    print("\n👨‍🎓 STUDENTS (PIN: 1234):")
    print("   - Emma Wilson (emma@school.org)")
    print("   - James Chen (james@school.org)")
    print("   - Sofia Martinez (sofia@school.org)")
    print("\n👨‍🏫 TEACHERS (PIN: 1234):")
    print("   - Mr. Johnson (johnson@school.org)")
    print("   - Ms. Garcia (garcia@school.org)")
    print("   - Mrs. Thompson (thompson@school.org)")
    print("\n👔 ADMINS (PIN: 1234):")
    print("   - Dr. Anderson (admin@school.org)")
    print("   - Ms. Roberts (roberts@school.org)")
    print("\n⚠️  Remember to change PINs in production!")
