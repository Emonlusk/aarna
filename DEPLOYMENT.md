# 🚀 Aarna Deployment Guide

This guide covers deploying the Aarna School Digital Hub to production. Choose your preferred hosting platform below.

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Gemini API Key** - Get one at [Google AI Studio](https://aistudio.google.com/apikey)
2. **Git repository** - Push your code to GitHub/GitLab
3. **Domain name** (optional but recommended)

---

## 🎯 Option 1: Render (Recommended - Easiest)

Render offers a simple, free-tier deployment with automatic SSL and CI/CD.

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Select the repository containing this code
5. Render will detect `render.yaml` automatically
6. Click **Apply**

### Step 3: Set Environment Variables

After deployment starts, go to your **aarna-backend** service:

1. Navigate to **Environment**
2. Add `GEMINI_API_KEY` with your API key
3. Click **Save Changes**

### Step 4: Seed Initial Data (Optional)

Connect to your backend shell and run:

```bash
python seed_db.py
```

### URLs After Deployment

- **Frontend**: `https://aarna-frontend.onrender.com`
- **Backend API**: `https://aarna-backend.onrender.com`

> ⚠️ **Note**: Free tier services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## 🐳 Option 2: Docker (Hostinger VPS, DigitalOcean, AWS EC2)

For VPS-based hosting with more control.

### Step 1: Prepare Your VPS

SSH into your server and install Docker:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add your user to docker group
sudo usermod -aG docker $USER
```

### Step 2: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/aarna.git
cd aarna
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.docker.example .env

# Edit with your values
nano .env
```

Fill in these values:
```env
DB_PASSWORD=your_secure_database_password
SECRET_KEY=your_very_long_secret_key_at_least_32_characters
GEMINI_API_KEY=your_google_gemini_api_key
CORS_ORIGINS=https://your-domain.com
VITE_API_URL=https://your-domain.com/api
```

### Step 4: Deploy

```bash
docker compose up -d --build
```

### Step 5: Set Up SSL (HTTPS)

Using Certbot for free SSL certificates:

```bash
# Initial certificate
docker compose run --rm certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    -d your-domain.com

# Update nginx-proxy.conf to enable HTTPS (uncomment SSL server block)
# Then restart nginx
docker compose restart nginx
```

### Step 6: Verify Deployment

```bash
# Check all containers are running
docker compose ps

# View logs
docker compose logs -f

# Test API
curl https://your-domain.com/api/auth/public/classes
```

---

## 🌐 Option 3: Hostinger (Shared Hosting - Limited)

> ⚠️ **Important**: Hostinger shared hosting doesn't support Python/Flask natively. You need **Hostinger VPS** for this app. If you only have shared hosting, use **Render** (Option 1) instead.

### For Hostinger VPS:
Follow **Option 2 (Docker)** instructions above.

### For Hostinger Shared Hosting (Frontend Only):
You can host only the static frontend on shared hosting:

1. Build the frontend locally:
   ```bash
   cd frontend
   npm install
   VITE_API_URL=https://your-render-backend.onrender.com npm run build
   ```

2. Upload the `dist/` folder contents to Hostinger's `public_html/`

3. Create `.htaccess` for SPA routing:
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

4. Deploy backend separately on Render

---

## 🔧 Environment Variables Reference

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Flask session encryption (32+ chars) | ✅ Yes |
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ Yes |
| `CORS_ORIGINS` | Allowed frontend URLs (comma-separated) | ✅ Yes |
| `FLASK_ENV` | `production` or `development` | Optional |

### Frontend (.env.production)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | ✅ Yes |

---

## 🧪 Testing Your Deployment

### Health Checks

```bash
# Backend health
curl https://your-backend-url/health

# API test
curl https://your-backend-url/api/auth/public/classes
```

### First Login

After seeding the database, default test accounts:

| Role | Name | PIN |
|------|------|-----|
| Student | Emma Wilson | 1234 |
| Teacher | Mr. Johnson | 1234 |
| Admin | Dr. Anderson | 1234 |

> ⚠️ Change these PINs in production!

---

## 🔄 Updating Your Deployment

### Render
Just push to your main branch - Render auto-deploys.

### Docker
```bash
git pull origin main
docker compose down
docker compose up -d --build
```

---

## 🐛 Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure `CORS_ORIGINS` includes your frontend URL
- Check for trailing slashes

**2. Database Connection Failed**
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:5432/dbname`
- Render uses `postgres://` which is auto-converted

**3. Login Not Working**
- Check browser console for API errors
- Ensure cookies are enabled
- Verify `SESSION_COOKIE_SECURE` matches HTTPS usage

**4. AI Features Not Working**
- Verify `GEMINI_API_KEY` is set correctly
- Check API quota at [Google AI Studio](https://aistudio.google.com/)

### Viewing Logs

**Render:**
Dashboard → Service → Logs

**Docker:**
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

---

## 📞 Support

For deployment issues, check:
- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- Open an issue in this repository

---

## 🔐 Security Checklist

Before going live:

- [ ] Change default PINs for all users
- [ ] Use strong `SECRET_KEY` (32+ characters)
- [ ] Enable HTTPS
- [ ] Set `FLASK_ENV=production`
- [ ] Review CORS origins
- [ ] Set up database backups
- [ ] Monitor error logs
