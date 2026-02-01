import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from extensions import db, migrate, cors, login_manager
from routes.auth import auth_bp
from routes.ai import ai_bp
from routes.classes import classes_bp
from routes.assignments import assignments_bp
from routes.submissions import submissions_bp
from routes.resources import resources_bp
from routes.users import users_bp
from models import User

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key_change_in_production')
    
    # Database URL - Handle Render's postgres:// vs postgresql://
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Session configuration for production
    app.config['SESSION_COOKIE_SECURE'] = os.environ.get('FLASK_ENV') == 'production'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # CORS configuration - use CORS_ORIGINS env var for production
    cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:8080,http://localhost:5173').split(',')
    cors.init_app(app, resources={r"/api/*": {"origins": [o.strip() for o in cors_origins]}}, supports_credentials=True)
    
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy', 'service': 'aarna-backend'})

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(classes_bp, url_prefix='/api/classes')
    app.register_blueprint(assignments_bp, url_prefix='/api/assignments')
    app.register_blueprint(submissions_bp, url_prefix='/api/submissions')
    app.register_blueprint(resources_bp, url_prefix='/api/resources')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
