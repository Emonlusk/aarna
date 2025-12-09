from flask import Blueprint, request, jsonify
try:
    import google.generativeai as genai
except ImportError:
    genai = None
import os

ai_bp = Blueprint('ai', __name__)

# Configure Gemini
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
if GOOGLE_API_KEY and genai:
    genai.configure(api_key=GOOGLE_API_KEY)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    if not GOOGLE_API_KEY or not genai:
        return jsonify({'error': 'AI service not configured or library missing'}), 503
        
    data = request.json
    message = data.get('message')
    role = data.get('role', 'user') # 'teacher' or 'student' context
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        # Contextualize prompt based on role
        system_prompt = ""
        if role == 'teacher':
            system_prompt = "You are a helpful teaching assistant. Help with lesson planning, grading, and creating educational content. "
        elif role == 'student':
            system_prompt = "You are a friendly learning buddy. Help explain concepts simply and encourage learning. Do not give direct answers to homework. "
            
        response = model.generate_content(system_prompt + message)
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/grade', methods=['POST'])
def grade():
    if not GOOGLE_API_KEY or not genai:
        return jsonify({'error': 'AI service not configured or library missing'}), 503
        
    data = request.json
    content = data.get('content')
    assignment_title = data.get('assignment_title')
    assignment_description = data.get('assignment_description')
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""
        You are an expert teacher. Please grade the following student submission.
        
        Assignment Title: {assignment_title}
        Description: {assignment_description}
        
        Student Submission:
        {content}
        
        Please provide:
        1. A grade (e.g., A, B, C or 90/100)
        2. Constructive feedback (2-3 sentences)
        
        Format the output as JSON with keys 'grade' and 'feedback'.
        """
        
        response = model.generate_content(prompt)
        # Simple parsing (in production, use structured output or regex)
        text = response.text
        # Clean up code blocks if present
        text = text.replace('```json', '').replace('```', '').strip()
        
        import json
        try:
            result = json.loads(text)
        except:
            # Fallback if not valid JSON
            result = {'grade': 'Pending', 'feedback': text}
            
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
