<<<<<<< HEAD
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
=======
# 📚 ReadWell — Full-Stack MERN Digital Library
**Discover Books. Learn Better. Interact Smarter.**

![ReadWell](https://img.shields.io/badge/ReadWell-Digital%20Library-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

ReadWell is a Human-Computer Interaction (HCI)–optimized full-stack MERN web application that allows users to explore millions of books using the Open Library API, enhanced by a modern UI, intuitive interactions, accessibility features, and structured backend architecture.

---

## ⭐ Table of Contents

- ✨ Overview
- 🚀 Features
- 🧠 HCI Principles
- 🏛️ Project Architecture
- 📁 Project Structure
- 🛠️ Tech Stack
- 🔌 API Endpoints
- 🧩 Installation Guide
- 🎨 UI & UX Features
- 🌙 Dark/Light Mode
- 🔮 Future Enhancements
- 👨‍💻 Authors

---

## ✨ Overview

ReadWell is a digital library system built with the MERN stack. Users can browse books, view details, search through millions of titles, filter by categories, sort results, and bookmark favorites.

The project demonstrates excellent Human–Computer Interaction (HCI) concepts including visibility, feedback, accessibility, error prevention, and consistency.

---

## 🚀 Features

### 🔍 Core Functionality
- Real-time Search (Open Library API)
- Genre-based filtering (Sci-Fi, Fantasy, Mystery, Romance, etc.)
- Sort by popularity, year, title, author
- Pagination (client + API-based)
- Grid and List view toggle
- Real book data with cover images

### ⭐ Advanced User Features
- Bookmarks saved in LocalStorage
- Search suggestions dropdown
- Keyboard-accessible navigation
- Loading skeletons and shimmer effects

### 🧱 Backend Features
- Express REST API
- MongoDB book collection
- Local CRUD operations (Add/Get books)
- Open Library API middleware
- Environment variables via dotenv

---

## 🧠 HCI Principles

ReadWell fully implements Nielsen’s 10 usability heuristics, including:

- ✔ **Visibility of System Status**  
  Loading skeletons, progress indicators, toast notifications.

- ✔ **User Control & Freedom**  
  View toggle, undo bookmark, clean navigation.

- ✔ **Error Prevention & Recovery**  
  Helpful error messages, API fallback behavior.

- ✔ **Consistency & Standards**  
  Consistent icons, colors, layout, component behavior.

- ✔ **Flexibility & Efficiency**  
  Search suggestions, keyboard shortcuts, filters.

- ✔ **Aesthetic & Minimalist Design**  
  Modern, clean UI with balanced spacing and contrast.

- ✔ **Accessibility Support**  
  - ARIA labels  
  - Focus outlines  
  - Keyboard navigation  
  - Semantic HTML

---

## 🏛️ Project Architecture

```

User → Frontend (HTML/CSS/JS)
↓
Express Backend (Node.js)
↓
MongoDB ←→ Open Library API (External)

```

---

## 📁 Project Structure

```

ReadWell-main/
├── backend/
│   ├── models/
│   │   └── Book.js
│   ├── routes/
│   │   ├── bookRoutes.js
│   │   └── openLibraryRoutes.js
│   ├── controllers/       # (Future use)
│   ├── middleware/        # (Future use)
│   ├── config/            # (Future use)
│   ├── server.js
│   ├── seedBooks.js
│   ├── seedBooksFinal.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── browse.html
│   ├── home-enhanced.js
│   ├── browse.js
│   ├── styles.css
│   ├── browse.css
│   └── assets/
│
└── README.md

```

---

## 🛠️ Tech Stack

### Frontend
- HTML5 (Semantic)
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+
- Font Awesome icons
- Open Library Covers API

### Backend
- Node.js
- Express.js
- MongoDB / Mongoose
- Axios
- dotenv
- CORS

---

## 🔌 API Endpoints

### 📘 Open Library API Integration
```

GET /api/openlibrary/search?q=harry&page=1&limit=20
GET /api/openlibrary/popular
GET /api/openlibrary/category/:genre
GET /api/openlibrary/book/:id

```

### 📗 Local MongoDB API
```

GET /api/books
POST /api/books
GET /api/books/:id

```

Supports filters:
```

/api/books?search=magic&genre=fantasy&minRating=4&page=1

````

---

## 🧩 Installation Guide

### 1️⃣ Clone Repo
```bash
git clone https://github.com/HassanAliMashwani/ReadWell
cd ReadWell-main
````

### 2️⃣ Install Backend Dependencies
>>>>>>> 136d64c940937d85cabf3bcb81a232779f84ce1d

```bash
cd backend
npm install
```

<<<<<<< HEAD
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

=======
### 3️⃣ Create .env file

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/readwell
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 4️⃣ Run Backend

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

### 5️⃣ Run Frontend

Just open:

```
frontend/index.html
frontend/browse.html
```

Or use:

* Live Server extension (VS Code) or any static server.

---

## 🎨 UI & UX Features

### 📱 Responsive Design

Mobile → Tablet → Desktop using fluid grid/flex.

### 🧭 Smooth Interactions

* Hover effects
* Animated buttons
* Loading shimmer
* Toast messages

### 🔄 Search Enhancements

* Debounced real-time search
* Suggestions dropdown
* Error handling
* Auto-scroll to results

## 🔮 Future Enhancements

### 🔥 High Priority

* User authentication (JWT)
* User reading history
* AI-based recommendations
* Review & rating system

### 🟡 Medium

* Social book sharing
* Friends activity
* Reading lists

### 🔵 Low

* Audiobook integration
* PWA offline support
* Multi-language UI

---

## 👨‍💻 Authors

**Hassan Ali Mashwani**
Developer, UI/UX Designer
GitHub: [https://github.com/HassanAliMashwani](https://github.com/HassanAliMashwani)


**Aalyan Mughal**
Developer
GitHub: [(https://github.com/allayanmughal)]

---

<div align="center">
⭐ If you like this project, don’t forget to star the repo!
</div>
>>>>>>> 136d64c940937d85cabf3bcb81a232779f84ce1d
