# ReadWell - Digital Library Application

A MERN stack digital library application with book browsing, user authentication, reading progress tracking, and rating system.

## Prerequisites

Before running the application, make sure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)

## Installation & Setup

### 1. Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables (Optional)

Create a `.env` file in the `backend` directory (optional - defaults are provided):

```env
MONGODB_URI=mongodb://localhost:27017/readwell
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

**Note:** If you don't create a `.env` file, the application will use default values:
- MongoDB: `mongodb://localhost:27017/readwell`
- Port: `5000`
- JWT Secret: `your-secret-key-change-in-production`

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `.env` file

### 4. Start the Backend Server

```bash
# From the backend directory
npm start

# Or for development with auto-reload
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📚 ReadWell Backend API: http://localhost:5000
🌐 Open Library Integration: Active
```

### 5. Start the Frontend

The frontend is static HTML/CSS/JavaScript. You have several options:

**Option A: Using a Simple HTTP Server (Recommended)**

```bash
# From the project root directory
cd frontend

# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server (install globally: npm install -g http-server)
http-server -p 8000

# Using PHP
php -S localhost:8000
```

**Option B: Open Directly in Browser**
- Simply open `frontend/index.html` in your browser
- Note: Some features may not work due to CORS restrictions

**Option C: Using VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click on `index.html` → "Open with Live Server"

## Access the Application

Once both servers are running:

- **Frontend:** http://localhost:8000 (or the port you chose)
- **Backend API:** http://localhost:5000

## Quick Start Commands

### Terminal 1 - Backend Server
```bash
cd backend
npm install  # First time only
npm start
```

### Terminal 2 - Frontend Server
```bash
cd frontend
python -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

## Features

✅ **List View Only** - Clean list view for browsing books  
✅ **Language Filter** - English and Urdu book support  
✅ **Dark Theme** - Persistent dark/light mode toggle  
✅ **User Authentication** - Signup, login, logout  
✅ **Reading Progress** - Track chapter, page, paragraph, line number  
✅ **Quotes System** - Save favorite quotes from books  
✅ **Rating System** - Rate books (1-5 stars)  
✅ **Popular Books** - Weekly popular books based on ratings  

## API Endpoints

- `GET /api/books` - Get all books
- `GET /api/openlibrary/search?q=query` - Search books
- `GET /api/openlibrary/popular` - Get popular books
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token
- `GET /api/reading-progress` - Get user's reading progress
- `POST /api/reading-progress` - Save reading progress
- `POST /api/ratings` - Rate a book
- `GET /api/ratings/popular/week` - Get popular books this week

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod` or check MongoDB service
- Check if MongoDB is installed: `mongod --version`
- For MongoDB Atlas, verify your connection string in `.env`

### Port Already in Use
- Change the port in `backend/server.js` or `.env` file
- Or stop the process using that port

### CORS Errors
- Make sure backend is running on port 5000
- Check that frontend API calls point to `http://localhost:5000/api`

### Module Not Found
- Run `npm install` in the `backend` directory
- Make sure you're in the correct directory

## Project Structure

```
sii/
├── backend/
│   ├── models/          # MongoDB models (User, Rating, ReadingProgress)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── index.html       # Home page
│   ├── browse.html      # Browse page
│   ├── browse.js        # Browse functionality
│   ├── home-enhanced.js # Home page functionality
│   ├── auth.js          # Authentication functions
│   └── styles.css       # Main styles
└── README.md
```

## Development

For development with auto-reload:

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

## Production

For production deployment:

1. Set proper environment variables in `.env`
2. Use a production MongoDB instance
3. Set a strong `JWT_SECRET`
4. Use a proper web server (nginx, Apache) for frontend
5. Use PM2 or similar for backend process management

## Support

If you encounter any issues:
1. Check MongoDB is running
2. Verify all dependencies are installed
3. Check browser console for errors
4. Verify backend server is running on port 5000

