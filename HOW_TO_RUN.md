# 🚀 How to Run ReadWell Project

This guide provides step-by-step commands to run the ReadWell digital library application.

---

## 📋 Prerequisites

Before running, ensure you have installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
   - OR use MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
3. **npm** (comes with Node.js)

---

## 🔧 Step 1: Install Backend Dependencies

Open a terminal/command prompt and navigate to the project directory:

```bash
cd backend
npm install
```

**Expected output:** Dependencies will be installed. Wait for completion.

---

## 🗄️ Step 2: Set Up MongoDB

### Option A: Local MongoDB

**Windows:**
```bash
# Open Command Prompt as Administrator
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# OR
mongod
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Create `backend/.env` file:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

**Note:** If using local MongoDB, you can skip creating `.env` file (defaults will be used).

---

## 🖥️ Step 3: Start Backend Server

Open a **NEW terminal/command prompt**:

```bash
cd backend
npm start
```

**Expected output:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📚 ReadWell Backend API: http://localhost:5000
```

**Keep this terminal open!** The backend server must stay running.

---

## 🌐 Step 4: Start Frontend Server

Open **ANOTHER NEW terminal/command prompt**:

### Option A: Using npm (Recommended - Consistent with Backend)

```bash
cd frontend
npm start
```

**OR for development:**
```bash
cd frontend
npm run dev
```

**Note:** First time only, npm will automatically download `http-server` package.

**Expected output:**
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8000
  http://192.168.x.x:8000
```

**Keep this terminal open too!**

### Option B: Using Python

```bash
cd frontend
python -m http.server 8000
```

**For Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

### Option C: Using PHP

```bash
cd frontend
php -S localhost:8000
```

### Option D: Using VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `frontend/index.html`
3. Select "Open with Live Server"

---

## 🎯 Step 5: Access the Application

Open your web browser and navigate to:

**Frontend:** http://localhost:8000

**Backend API:** http://localhost:5000

---

## 📝 Quick Command Summary

### Terminal 1 - Backend:
```bash
cd backend
npm install          # First time only
npm start
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### Terminal 3 - MongoDB (if using local):
```bash
mongod
```

---

## ✅ Verify Everything is Working

1. **Backend:** Check http://localhost:5000 - Should show API message
2. **Frontend:** Check http://localhost:8000 - Should show ReadWell dashboard
3. **MongoDB:** Backend terminal should show "✅ Connected to MongoDB"

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to MongoDB"

**Solution:**
- Make sure MongoDB is running (`mongod` command)
- Check MongoDB service is started (Windows: Services → MongoDB)
- For MongoDB Atlas: Verify connection string in `.env` file

### ❌ "Port 5000 already in use"

**Solution:**
- Change port in `backend/server.js` (line ~44)
- Or stop the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:5000 | xargs kill
  ```

### ❌ "Module not found"

**Solution:**
```bash
cd backend
npm install
```

### ❌ "CORS errors" in browser console

**Solution:**
- Make sure backend is running on port 5000
- Check frontend API calls point to `http://localhost:5000/api`
- Verify CORS is enabled in `backend/server.js`

### ❌ Frontend not loading

**Solution:**
- Make sure backend server is running
- Check browser console for errors (F12)
- Verify frontend server is running on port 8000
- Try refreshing the page

---

## 🔄 Development Mode (Auto-reload)

### Backend (Auto-reload on file changes):

```bash
cd backend
npm run dev
```

**Note:** Requires `nodemon` to be installed. If not installed:
```bash
npm install -g nodemon
# OR
npm install --save-dev nodemon
```

### Frontend:

The frontend uses static files, so changes are reflected immediately on page refresh. No special dev mode needed - just use:

```bash
cd frontend
npm start
```

---

## 🛑 Stopping the Servers

To stop the servers:

1. **Backend:** Press `Ctrl + C` in the backend terminal
2. **Frontend:** Press `Ctrl + C` in the frontend terminal
3. **MongoDB:** Press `Ctrl + C` in MongoDB terminal (if running locally)

---

## 📚 Project Structure

```
ReadWell-main/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── package.json     # Dependencies
│
├── frontend/
│   ├── index.html       # Entry point
│   ├── dashboard.html   # Dashboard page
│   ├── home.html        # Home page
│   ├── browse.html      # Browse page
│   ├── profile.html     # Profile page
│   ├── library.html     # My Library page
│   └── *.js             # JavaScript files
│
└── HOW_TO_RUN.md        # This file
```

---

## 🎉 You're All Set!

Once both servers are running, you can:

- ✅ Sign up / Login
- ✅ Browse books
- ✅ Search and filter books
- ✅ Rate books
- ✅ Save reading progress
- ✅ Save favorite quotes
- ✅ Add books to My Library
- ✅ View your profile

---

## 📞 Need Help?

If you encounter issues:

1. Check MongoDB is running
2. Verify all dependencies are installed
3. Check browser console for errors (F12)
4. Verify backend server is running on port 5000
5. Check terminal output for error messages

---

**Happy Reading! 📖**

