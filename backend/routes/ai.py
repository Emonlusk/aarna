from flask import Blueprint, request, jsonify
import os
import json
from google import genai

ai_bp = Blueprint('ai', __name__)

# Initialize Gemini client
# The client automatically reads from GEMINI_API_KEY or GOOGLE_API_KEY environment variable
def get_genai_client():
    """Get or create the Gemini AI client"""
    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

def call_gemini_api(prompt_text):
    """Helper function to call Gemini API using google-genai SDK"""
    client = get_genai_client()
    if not client:
        raise Exception("Google API Key not configured. Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.")
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt_text
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        raise Exception(f"Gemini API Error: {str(e)}")

@ai_bp.route('/chat', methods=['POST'])
def chat():
    if not get_genai_client():
        return jsonify({'error': 'AI service not configured. Set GEMINI_API_KEY environment variable.'}), 503
        
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
    if not get_genai_client():
        return jsonify({'error': 'AI service not configured. Set GEMINI_API_KEY environment variable.'}), 503
        
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
