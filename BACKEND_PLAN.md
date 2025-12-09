# Backend Implementation Plan

This document outlines the architecture, database schema, and API endpoints for the School Digital Hub backend.

## 1. Technology Stack
- **Framework:** Flask (Python)
- **Database:** SQLite (Development) / PostgreSQL (Production)
- **ORM:** Flask-SQLAlchemy
- **Authentication:** Flask-Login (Session-based)
- **AI Integration:** Google Gemini Pro API (`google-generativeai`)
- **Migrations:** Flask-Migrate

## 2. Database Schema

### Users Table (`users`)
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Unique user ID |
| name | String | Full name |
| email | String | Email address (Unique) |
| password_hash | String | Hashed password |
| role | String | 'teacher', 'student', 'admin' |
| pin | String | 4-digit PIN for quick login (optional) |
| class_name | String | Class name (e.g., "5A") for students |
| created_at | DateTime | Timestamp |

### Classes Table (`classes`)
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Unique class ID |
| name | String | Class name (e.g., "Class 5A") |
| teacher_id | Integer (FK) | ID of the teacher |
| created_at | DateTime | Timestamp |

### Assignments Table (`assignments`)
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Unique assignment ID |
| title | String | Assignment title |
| subject | String | Subject (Math, Science, etc.) |
| description | Text | Detailed instructions |
| due_date | DateTime | Due date |
| class_id | Integer (FK) | ID of the class assigned to |
| status | String | 'pending', 'completed' (for tracking) |
| created_at | DateTime | Timestamp |

### Submissions Table (`submissions`)
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Unique submission ID |
| assignment_id | Integer (FK) | ID of the assignment |
| student_id | Integer (FK) | ID of the student |
| content | Text | Submission text or file URL |
| grade | String | Grade given by teacher |
| feedback | Text | Teacher's feedback |
| status | String | 'submitted', 'graded' |
| submitted_at | DateTime | Timestamp |

### Resources Table (`resources`)
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Unique resource ID |
| title | String | Resource title |
| type | String | 'worksheet', 'visual', 'quiz' |
| content | Text | Markdown content or JSON data |
| subject | String | Subject |
| grade | String | Target grade level |
| teacher_id | Integer (FK) | ID of the creator |
| created_at | DateTime | Timestamp |

### Chat History Table (`chat_history`)
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Unique chat ID |
| user_id | Integer (FK) | ID of the user |
| role | String | 'user' or 'ai' |
| message | Text | The message content |
| timestamp | DateTime | Time of message |

## 3. API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Login with email/password or PIN.
- `POST /logout`: Logout current user.
- `GET /me`: Get current logged-in user details.

### Classes (`/api/classes`)
- `GET /`: List all classes (Teacher sees their own, Admin sees all).
- `POST /`: Create a new class (Teacher/Admin).
- `GET /<id>`: Get class details.
- `DELETE /<id>`: Delete a class.

### Assignments (`/api/assignments`)
- `GET /`: List assignments (Student sees theirs, Teacher sees created ones).
- `POST /`: Create a new assignment.
- `GET /<id>`: Get assignment details.
- `PUT /<id>`: Update assignment.

### Submissions (`/api/submissions`)
- `POST /`: Submit an assignment.
- `GET /assignment/<id>`: Get all submissions for a specific assignment (Teacher).

### Resources (`/api/resources`)
- `GET /`: List resources (filterable by type/subject).
- `POST /`: Save a generated resource.
- `GET /<id>`: Get resource details.
- `DELETE /<id>`: Delete a resource.

### AI Features (`/api/ai`)
- `POST /chat`: Send a message to the AI assistant.
- `POST /generate`: Generate content (worksheet/visual) based on prompt.

### User Management (`/api/users`) - Admin Only
- `GET /`: List all users.
- `POST /`: Add a user manually.
- `DELETE /<id>`: Remove a user.

## 4. Implementation Steps

1.  **Database Setup:**
    *   Update `models.py` with the schema defined above.
    *   Run `flask db init`, `flask db migrate`, and `flask db upgrade`.

2.  **API Development:**
    *   Implement routes in `routes/` directory corresponding to the endpoints.
    *   Ensure proper error handling and status codes.

3.  **AI Integration:**
    *   Enhance `routes/ai.py` to handle different modes (chat, worksheet, visual).
    *   Implement prompt engineering for specific outputs.

4.  **Frontend Integration:**
    *   Create API service functions in frontend (`src/lib/api.ts`).
    *   Replace mock data in pages with `useEffect` calls to fetch real data.
    *   Connect forms (Login, Register, Create Assignment) to API.

5.  **Testing:**
    *   Test all endpoints with Postman/cURL.
    *   Verify frontend-backend data flow.
