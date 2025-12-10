from flask import Blueprint, request, jsonify
import os
import requests
import json

ai_bp = Blueprint('ai', __name__)

# Configure Gemini API Key
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

def call_gemini_api(prompt_text):
    """Helper function to call Gemini API via REST"""
    if not GOOGLE_API_KEY:
        raise Exception("Google API Key not configured")

    headers = {
        "Content-Type": "application/json"
    }
    
    # Gemini REST API payload structure
    payload = {
        "contents": [{
            "parts": [{"text": prompt_text}]
        }]
    }
    
    response = requests.post(
        f"{GEMINI_API_URL}?key={GOOGLE_API_KEY}",
        headers=headers,
        json=payload
    )
    
    if response.status_code != 200:
        print(f"Gemini API Error ({response.status_code}): {response.text}") # Log error for debugging
        raise Exception(f"Gemini API Error: {response.text}")
        
    data = response.json()
    try:
        # Extract text from response
        return data['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError):
        raise Exception("Invalid response format from Gemini API")

@ai_bp.route('/chat', methods=['POST'])
def chat():
    if not GOOGLE_API_KEY:
        return jsonify({'error': 'AI service not configured'}), 503
        
    data = request.json
    message = data.get('message')
    role = data.get('role', 'user') # 'teacher' or 'student' context
    
    try:
        # Contextualize prompt based on role
        system_prompt = ""
        if role == 'teacher':
            system_prompt = "You are a helpful teaching assistant. Help with lesson planning, grading, and creating educational content. "
        elif role == 'student':
            system_prompt = "You are a friendly learning buddy. Help explain concepts simply and encourage learning. Do not give direct answers to homework. "
            
        # Combine system prompt and user message
        full_prompt = f"{system_prompt}\n\nUser: {message}"
        
        response_text = call_gemini_api(full_prompt)
        return jsonify({'response': response_text})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/grade', methods=['POST'])
def grade():
    if not GOOGLE_API_KEY:
        return jsonify({'error': 'AI service not configured'}), 503
        
    data = request.json
    content = data.get('content')
    assignment_title = data.get('assignment_title')
    assignment_description = data.get('assignment_description')
    
    try:
        prompt = f"""
        You are an expert teacher. Please grade the following student submission.
        
        Assignment Title: {assignment_title}
        Description: {assignment_description}
        
        Student Submission:
        {content}
        
        Please provide:
        1. A grade (e.g., A, B, C or 90/100)
        2. Constructive feedback (2-3 sentences)
        
        Format the output as VALID JSON with keys 'grade' and 'feedback'. Do not include markdown formatting like ```json.
        """
        
        response_text = call_gemini_api(prompt)
        
        # Cleanup potential markdown formatting from LLM
        clean_text = response_text.replace('```json', '').replace('```', '').strip()
        
        try:
            result = json.loads(clean_text)
        except json.JSONDecodeError:
            # Fallback if not valid JSON
            result = {'grade': 'Pending', 'feedback': clean_text}
            
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
