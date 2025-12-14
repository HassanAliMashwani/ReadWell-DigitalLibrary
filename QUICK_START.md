# Quick Start Guide

## Step-by-Step Instructions

### 1. Install Dependencies (First Time Only)

```bash
cd backend
npm install
```

### 2. Start MongoDB

**Windows:**
- Open Command Prompt as Administrator
- Run: `mongod`
- Or start MongoDB service from Services

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
mongod
```

**Or use MongoDB Atlas (Cloud - No installation needed):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Create `backend/.env` file with: `MONGODB_URI=your-connection-string`

### 3. Start Backend Server

Open Terminal/Command Prompt:

```bash
cd backend
npm start
```

Wait for: `✅ Connected to MongoDB` and `🚀 Server running on port 5000`

### 4. Start Frontend Server

Open a NEW Terminal/Command Prompt:

```bash
cd frontend
python -m http.server 8000
```

**Don't have Python?** Use one of these:
- Node.js: `npx http-server -p 8000`
- PHP: `php -S localhost:8000`
- Or just open `index.html` directly in browser

### 5. Open in Browser

Go to: **http://localhost:8000**

## That's It! 🎉

You should now see the ReadWell home page.

## Testing Features

1. **Sign Up:** Click "Sign Up" → Create account
2. **Browse Books:** Click "Browse" → Search for books
3. **Rate Books:** Click stars to rate (requires login)
4. **Save Progress:** Click "Reading Progress" button (requires login)
5. **Dark Theme:** Click moon/sun icon in header
6. **Language Filter:** Select English or Urdu in filters

## Common Issues

**"Cannot connect to MongoDB"**
- Make sure MongoDB is running
- Check `mongod` is running in terminal

**"Port 5000 already in use"**
- Change port in `backend/server.js` line 44
- Or stop other service using port 5000

**"Module not found"**
- Run `npm install` in `backend` folder

**Frontend not loading**
- Make sure backend is running on port 5000
- Check browser console for errors

