# 🚀 Quick Deployment Guide - StudyMate.ai

## Step 1: GitHub Pe Push Karne Se Pehle

### 1. Git Repository Initialize Karo (agar pehle se nahi hai)

```bash
git init
```

### 2. .env File Check Karo
- Root me `.env` file **honi chahiye nahi** GitHub pe
- `.env.example` se copy karke `.env` banao locally
- Apne actual values `.env` me daalo (woh GitHub pe nahi jayega - `.gitignore` me hai)

### 3. Git Add & Commit

```bash
git add .
git commit -m "Initial commit - StudyMate.ai project"
```

### 4. GitHub Pe Repository Banao

1. GitHub.com pe jao
2. New Repository banao
3. Repository name: `StudyMate.ai` (ya kuch bhi)
4. Public ya Private - apki marzi
5. **Initialize with README** - mat karo (pehle se README hai)

### 5. Remote Add Karo & Push

```bash
git remote add origin https://github.com/yourusername/StudyMate.ai.git
git branch -M main
git push -u origin main
```

✅ **Done! Ab GitHub pe code hai**

---

## Step 2: Deployment Options

### Option A: Railway (Backend) + Vercel (Frontend) - **RECOMMENDED** 🎯

#### Backend Deployment (Railway)

1. [Railway.app](https://railway.app) pe signup karo (GitHub se login)
2. **New Project** > **Deploy from GitHub repo**
3. Apni repository select karo
4. **Settings** me jao:
   - Root Directory: `.` (root hi)
   - Build Command: (leave empty ya `pip install -r requirements.txt`)
   - Start Command: `python app.py`
5. **Variables** tab me jao - sab environment variables add karo:
   ```
   JWT_SECRET_KEY=your-key
   MONGO_URI=your-mongo-uri
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   GEMINI_API_KEY=your-gemini-key
   PORT=5000
   ```
6. **Generate Domain** - Railway automatically backend URL dega
   - Example: `https://your-app.railway.app`
7. **Important**: `app.py` me CORS update karo - frontend URL add karo

#### Frontend Deployment (Vercel)

1. [Vercel.com](https://vercel.com) pe signup (GitHub se)
2. **Import Project** - apni repository select karo
3. **Configure Project**:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build` (auto-detect hoga)
   - Output Directory: `dist`
4. **Environment Variables**:
   - `VITE_API_URL` = Railway backend URL (e.g., `https://your-app.railway.app`)
5. **Deploy**!

✅ **Done! Dono deploy ho gaye**

---

### Option B: Render (Donos) - **EASY** ⚡

#### Backend on Render

1. [Render.com](https://render.com) pe signup
2. **New** > **Web Service**
3. GitHub repo connect karo
4. Settings:
   - **Name**: `studymate-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
5. **Environment Variables** - sab add karo (same as Railway)
6. Deploy!

#### Frontend on Render

1. **New** > **Static Site**
2. GitHub repo connect karo
3. Settings:
   - **Name**: `studymate-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. **Environment Variable**: `VITE_API_URL` = backend URL
5. Deploy!

---

### Option C: Netlify (Frontend) + Heroku (Backend)

#### Backend on Heroku

```bash
# Heroku CLI install karo pehle
heroku login
heroku create your-app-name
git push heroku main

# Environment variables
heroku config:set JWT_SECRET_KEY=your-key
heroku config:set MONGO_URI=your-uri
# ... baaki sab
```

#### Frontend on Netlify

1. [Netlify.com](https://netlify.com) pe signup
2. **Add new site** > **Import from Git**
3. Repository select karo
4. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Environment variable: `VITE_API_URL`
6. Deploy!

---

## Step 3: Important Settings After Deployment

### 1. CORS Update (`app.py` me)

```python
# Production ke liye
CORS(
    app,
    origins=[
        "http://localhost:5173",  # Local dev
        "http://localhost:3000",
        "https://your-frontend.vercel.app",  # Production frontend URL
    ],
    # ... rest of config
)
```

### 2. MongoDB Atlas IP Whitelist

- MongoDB Atlas dashboard me jao
- **Network Access** > **Add IP Address**
- `0.0.0.0/0` add karo (ya specific server IP)

### 3. Cloudinary Settings

- Cloudinary dashboard me settings check karo
- Upload presets sahi hai ya nahi

---

## Step 4: Testing

### Local Testing
```bash
# Terminal 1 - Backend
cd .
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production Testing
1. Frontend URL open karo
2. Login/Register test karo
3. PDF upload test karo
4. Explanation test karo
5. Chat test karo

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Solution**: `app.py` me frontend URL add karo CORS origins me

### Issue 2: MongoDB Connection Failed
**Solution**: MongoDB Atlas me IP whitelist check karo (`0.0.0.0/0` add karo)

### Issue 3: Environment Variables Not Found
**Solution**: Deployment platform me sab environment variables add karo

### Issue 4: Build Fails
**Solution**: `package.json` aur `requirements.txt` check karo - sab dependencies honi chahiye

### Issue 5: Frontend API Calls Failing
**Solution**: `VITE_API_URL` environment variable sahi backend URL se set karo

---

## 📝 Checklist Before Deployment

- [ ] `.env` file GitHub pe nahi hai (`.gitignore` me hai)
- [ ] `.env.example` file banaya hai
- [ ] All environment variables set hai deployment platform pe
- [ ] CORS origins me production frontend URL add kiya hai
- [ ] MongoDB Atlas IP whitelist me `0.0.0.0/0` hai
- [ ] Frontend `.env` me `VITE_API_URL` production backend URL se set hai
- [ ] Local testing successful hai
- [ ] README.md updated hai

---

## 🎉 Success!

Agar sab sahi se hua, toh:
- ✅ Frontend: `https://your-frontend.vercel.app` (or Netlify/Render URL)
- ✅ Backend: `https://your-backend.railway.app` (or Render/Heroku URL)

**Congratulations! 🚀 Apka project live hai!**

---

## Need Help?

- GitHub Issues me question pucho
- Documentation check karo
- Deployment platform ke documentation dekh lo

**Happy Deploying! 🎊**
