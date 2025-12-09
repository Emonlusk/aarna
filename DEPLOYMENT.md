# Deployment Guide

## Prerequisites
- Docker (optional but recommended)
- Cloud Provider Account (Railway, Render, Heroku, etc.)
- Google Gemini API Key

## Backend Deployment (Flask)
1. **Environment Variables**:
   Set the following in your cloud provider:
   - `GOOGLE_API_KEY`: Your Gemini API Key.
   - `SECRET_KEY`: A strong random string.
   - `DATABASE_URL`: Your PostgreSQL connection string.

2. **Build & Run**:
   - Install dependencies: `pip install -r requirements.txt`
   - Run migrations: `flask db upgrade`
   - Start server: `gunicorn app:app`

## Frontend Deployment (Next.js)
1. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g., `https://your-backend.railway.app`).
   - Note: You need to update the `fetch` calls in the frontend code to use this variable instead of `localhost:5000`.

2. **Build**:
   - `npm install`
   - `npm run build`
   - `npm start`
