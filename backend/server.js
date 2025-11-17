const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/openlibrary', require('./routes/openLibraryRoutes')); // Add this line

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ReadWell Backend API is running!',
    endpoints: {
      getAllBooks: 'GET /api/books',
      searchBooks: 'GET /api/books?search=query',
      openLibrarySearch: 'GET /api/openlibrary/search?q=query',
      popularBooks: 'GET /api/openlibrary/popular',
      categoryBooks: 'GET /api/openlibrary/category/:genre'
    }
  });
});

// Database connection (keep for user data later)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/readwell')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 ReadWell Backend API: http://localhost:${PORT}`);
  console.log(`🌐 Open Library Integration: Active`);
});