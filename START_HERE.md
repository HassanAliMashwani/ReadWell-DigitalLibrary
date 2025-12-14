# 🚀 START HERE - Quick Setup Guide

## ✅ All Errors Fixed! Project is Ready to Run

---

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 2: Set Up MongoDB Connection

### Choose ONE Option:

### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB:**
   - Download: https://www.mongodb.com/try/download/community
   - Install it (Windows/Mac/Linux)

2. **Start MongoDB:**
   - **Windows:** Open Command Prompt as Admin → `mongod`
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

3. **Create `.env` file in `backend` folder:**
   ```
   MONGODB_URI=mongodb://localhost:27017/readwell
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   ```

### Option B: MongoDB Atlas (Cloud - No Installation)

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (takes 3-5 minutes)
3. **Create database user:**
   - Go to "Database Access" → "Add New Database User"
   - Save username and password
4. **Whitelist IP:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
5. **Get connection string:**
   - Go to "Database" → Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Add `/readwell` at the end

6. **Create `.env` file in `backend` folder:**
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/readwell?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   ```

**📖 Detailed MongoDB setup: See `MONGODB_SETUP.md`**

---

## Step 3: Run the Application

### Terminal 1 - Backend Server:
```bash
cd backend
npm start
```

**Wait for:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Terminal 2 - Frontend Server:
```bash
cd frontend
python -m http.server 8000
```

**Or if you don't have Python:**
```bash
# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

---

## Step 4: Open in Browser

**Go to:** http://localhost:8000

---

## ✅ What's Fixed

- ✅ All code errors fixed
- ✅ MongoDB connection improved with better error handling
- ✅ Server error handling added
- ✅ All linter warnings fixed
- ✅ Complete documentation added

---

## 🧪 Test It Works

1. **Open:** http://localhost:8000
2. **Click:** "Sign Up" → Create account
3. **Click:** "Browse" → Search for books
4. **Try:** Dark theme toggle (moon icon)
5. **Try:** Rate a book (click stars)
6. **Try:** Language filter (English/Urdu)

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- **Local:** Make sure MongoDB is running (`mongod`)
- **Atlas:** Check IP is whitelisted, password is correct

### "Port 5000 already in use"
- Change PORT in `.env` file
- Or stop other service using port 5000

### "Module not found"
- Run `npm install` in `backend` folder

### Frontend not loading
- Make sure backend is running on port 5000
- Check browser console for errors

**More help:** See `MONGODB_SETUP.md` and `SETUP_COMPLETE.md`

---

## 📁 Important Files

- `MONGODB_SETUP.md` - Complete MongoDB guide
- `SETUP_COMPLETE.md` - Full setup documentation
- `README.md` - Project documentation
- `QUICK_START.md` - Quick reference

---

## 🎉 You're Ready!

Follow the 4 steps above and you'll be running in minutes!

**Need help?** Check the troubleshooting section or the detailed guides.

