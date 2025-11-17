const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// GET /api/books - Get all books with filtering
router.get('/', async (req, res) => {
  try {
    const { search, genre, minRating, language, page = 1, limit = 50 } = req.query;

    
    let filter = {};
    
    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Genre filter
    if (genre) {
      filter.genre = genre;
    }
    
    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    // Language filter
    if (language && language !== 'all') {
      filter.language = language;
    }

    const books = await Book.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Book.countDocuments(filter);
    
    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/books/:id - Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/books - Create new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;