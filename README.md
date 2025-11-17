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

```bash
cd backend
npm install
```

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
