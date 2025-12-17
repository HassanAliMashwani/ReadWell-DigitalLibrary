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
app.use('/api/openlibrary', require('./routes/openLibraryRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reading-progress', require('./routes/readingProgressRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ReadWell Backend API is running!',
    endpoints: {
      getAllBooks: 'GET /api/books',
      searchBooks: 'GET /api/books?search=query',
      openLibrarySearch: 'GET /api/openlibrary/search?q=query',
      popularBooks: 'GET /api/openlibrary/popular',
      categoryBooks: 'GET /api/openlibrary/category/:genre',
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      verify: 'GET /api/auth/verify',
      readingProgress: 'GET/POST /api/reading-progress',
      ratings: 'GET/POST /api/ratings',
      library: 'GET/POST/DELETE /api/library'
    }
  });
});

// Database connection with improved error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/readwell';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Check your connection string in .env file');
    console.log('   3. For local MongoDB: mongodb://localhost:27017/readwell');
    console.log('   4. For MongoDB Atlas: Use your Atlas connection string');
    console.log('\n   Starting server anyway (some features may not work)...\n');
  });

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 ReadWell Backend API: http://localhost:${PORT}`);
  console.log(`🌐 Open Library Integration: Active`);
  console.log(`\n💡 MongoDB Status: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️  Not Connected'}`);
  console.log(`\n📖 Available Endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/books`);
  console.log(`   - GET  http://localhost:${PORT}/api/openlibrary/search?q=query`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`\n`);
});