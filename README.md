# School Digital Hub

A comprehensive web application for an NGO-run school, featuring an AI Teaching Assistant, Digital Classroom, and Student Companion.

## Structure
- `frontend/`: Next.js application (React, TypeScript, Tailwind CSS).
- `backend/`: Flask application (Python, SQLAlchemy, Gemini AI).

## Setup

### Prerequisites
- Node.js
- Python 3.8+
- Google Gemini API Key

### Quick Start (Windows)
Run `start_project.bat` to start both backend and frontend.

### Manual Setup
1. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   # Create .env with GOOGLE_API_KEY
   python app.py
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Features
- **Teacher Dashboard**: AI Chat for creating worksheets, visual aids.
- **Student Dashboard**: AI Learning Companion.
- **Class Management**: Create classes, assignments.
