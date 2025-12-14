const express = require('express');
const Library = require('../models/Library');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/library - Get user's library (all saved books)
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query; // Optional filter by type: favorite, bookmark, saved
    
    let filter = { user: req.user._id };
    if (type) {
      filter.type = type;
    }
    
    const library = await Library.find(filter).sort({ addedAt: -1 });
    res.json(library);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/library - Add book to library
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, bookTitle, bookAuthor, bookCover, type = 'saved' } = req.body;

    if (!bookId || !bookTitle) {
      return res.status(400).json({ message: 'Book ID and title are required' });
    }

    const libraryItem = await Library.findOneAndUpdate(
      { user: req.user._id, bookId, type },
      {
        bookTitle,
        bookAuthor: bookAuthor || 'Unknown',
        bookCover: bookCover || '',
        addedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(libraryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/library/:bookId - Remove book from library
router.delete('/:bookId', auth, async (req, res) => {
  try {
    const { type } = req.query; // Optional: specify type to delete
    
    let filter = { user: req.user._id, bookId: req.params.bookId };
    if (type) {
      filter.type = type;
    }
    
    const result = await Library.deleteOne(filter);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found in library' });
    }
    
    res.json({ message: 'Book removed from library' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/library/check/:bookId - Check if book is in library
router.get('/check/:bookId', auth, async (req, res) => {
  try {
    const libraryItem = await Library.findOne({
      user: req.user._id,
      bookId: req.params.bookId
    });
    
    res.json({ 
      inLibrary: !!libraryItem,
      type: libraryItem?.type || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

