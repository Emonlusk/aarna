@echo off
echo ====================================
echo    Aarna School Hub - Local Dev
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node is installed  
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo Starting Backend Server...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install deps
call venv\Scripts\activate
pip install -r requirements.txt --quiet

REM Check if .env exists
if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo WARNING: Please edit backend\.env and add your GEMINI_API_KEY
    echo.
)

REM Initialize database
echo Initializing database...
flask db upgrade 2>nul || (
    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade
)

REM Seed database with test data
echo Seeding database...
python seed_db.py

REM Start backend in background
echo Starting Flask backend on http://localhost:5000
start "Aarna Backend" cmd /c "venv\Scripts\activate && flask run --port=5000"

cd ..

echo.
echo Starting Frontend Server...
cd frontend

REM Install npm dependencies if needed
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

REM Start frontend
echo Starting Vite frontend on http://localhost:5173
start "Aarna Frontend" cmd /c "npm run dev"

cd ..

echo.
echo ====================================
echo    Servers Starting...
echo ====================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Test accounts (PIN: 1234):
echo   Student: Emma Wilson
echo   Teacher: Mr. Johnson
echo   Admin:   Dr. Anderson
echo.
echo Press any key to open the app...
pause >nul
start http://localhost:5173