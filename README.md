# StudyMate.ai - AI-Powered PDF Study Assistant

A comprehensive full-stack web application that transforms traditional PDF reading into an interactive AI-powered learning experience. Upload academic PDFs and receive intelligent, context-aware explanations for each page with real-time doubt resolution.

## 🚀 Features

- 📄 **PDF Upload & Processing**: Upload PDFs and process them page by page
- 🤖 **AI-Powered Explanations**: Get detailed explanations in English, Hindi, or Hinglish
- 💬 **Interactive Chat**: Ask doubts about the content and get instant answers
- 📝 **Quiz Generation**: Generate quizzes from selected pages to test your understanding
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Markdown** for rendering AI-generated content

### Backend
- **Flask** (Python) RESTful API
- **MongoDB Atlas** for database
- **JWT** authentication with bcrypt
- **Cloudinary** for file storage
- **Google Gemini 2.5 Flash** for AI processing

### PDF Processing
- **PyMuPDF** for text extraction and page rendering
- **Tesseract OCR** for image text extraction
- **BLIP Model** for image captioning

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier works)
- **Google Gemini API** key

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/rajbhai129/StudyMate.ai.git
cd StudyMate.ai
```

### 2. Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
   - **Windows**: `venv\Scripts\activate`
   - **macOS/Linux**: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory (copy from `.env.example`):
```bash
# Backend Configuration
PORT=5000
FLASK_ENV=development

# JWT Secret Key (Generate a strong random string)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key
```

5. Run the backend server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory:
```bash
VITE_API_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🌐 Deployment

### Option 1: Deploy on Vercel (Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Set the root directory to `frontend`
4. Add environment variable:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app`)
5. Deploy!

#### Backend Deployment (Railway)

1. Go to [Railway](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Set the root directory to `.` (root)
4. Railway will auto-detect Python
5. Add environment variables from your `.env` file in Railway dashboard
6. Set the start command: `python app.py`
7. Deploy!

**Note**: Update CORS in `app.py` to allow your Vercel frontend URL.

### Option 2: Deploy on Render (Both Frontend & Backend)

#### Backend on Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment**: Python 3
4. Add all environment variables from `.env`
5. Deploy!

#### Frontend on Render

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Settings:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add environment variable: `VITE_API_URL` = your backend URL
5. Deploy!

### Option 3: Deploy on Heroku (Backend) + Netlify (Frontend)

#### Backend on Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
```bash
heroku config:set JWT_SECRET_KEY=your-key
heroku config:set MONGO_URI=your-uri
# ... add all other env vars
```
5. Deploy: `git push heroku main`

#### Frontend on Netlify

1. Push to GitHub
2. Go to [Netlify](https://netlify.com) and import repository
3. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy!

## 🔐 Environment Variables Reference

### Backend (.env)
- `JWT_SECRET_KEY`: Secret key for JWT tokens (generate a strong random string)
- `MONGO_URI`: MongoDB Atlas connection string
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `GEMINI_API_KEY`: Your Google Gemini API key

### Frontend (frontend/.env)
- `VITE_API_URL`: Backend API URL (e.g., `https://your-backend.railway.app`)

## 📝 Important Notes for Deployment

1. **CORS Configuration**: Update CORS origins in `app.py` to include your frontend URL
2. **Environment Variables**: Never commit `.env` files to GitHub
3. **MongoDB Atlas**: Whitelist your deployment server's IP address
4. **API URLs**: Update frontend `.env` with production backend URL
5. **HTTPS**: Ensure your backend supports HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend CORS settings include your frontend URL
2. **MongoDB Connection**: Verify your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (or your server IP)
3. **Environment Variables**: Ensure all environment variables are set in your deployment platform
4. **Build Errors**: Check that all dependencies are correctly listed in `package.json` and `requirements.txt`

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Google Gemini API for AI processing
- MongoDB Atlas for database hosting
- Cloudinary for file storage
- All open-source contributors

---

**Made with ❤️ for students worldwide**
