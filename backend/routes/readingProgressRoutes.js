const express = require('express');
const ReadingProgress = require('../models/ReadingProgress');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/reading-progress - Get all reading progress for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching reading progress for user:', req.user._id);
    console.log('User ID type:', typeof req.user._id, req.user._id.toString());
    
    const progress = await ReadingProgress.find({ user: req.user._id })
      .sort({ lastReadAt: -1 });
    
    console.log('Found reading progress entries:', progress.length);
    
    if (progress.length > 0) {
      console.log('First progress item user ID:', progress[0].user.toString());
      console.log('Progress data:', JSON.stringify(progress, null, 2));
    } else {
      console.log('No progress found for user:', req.user._id.toString());
      // Check if there are any progress entries at all
      const allProgress = await ReadingProgress.find({});
      console.log('Total progress entries in database:', allProgress.length);
      if (allProgress.length > 0) {
        console.log('Sample progress item user ID:', allProgress[0].user.toString());
      }
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reading-progress - Save or update reading progress
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, bookTitle, chapter, page, paragraph, lineNumber } = req.body;

    if (!bookId || !bookTitle) {
      return res.status(400).json({ message: 'Book ID and title are required' });
    }

    const updateData = {
      bookTitle,
      lastReadAt: new Date()
    };
    
    // Only update fields that are provided
    if (chapter !== null && chapter !== undefined) updateData.chapter = chapter;
    if (page !== null && page !== undefined) updateData.page = page;
    if (paragraph !== null && paragraph !== undefined) updateData.paragraph = paragraph;
    if (lineNumber !== null && lineNumber !== undefined) updateData.lineNumber = lineNumber;
    
    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, bookId },
      updateData,
      { upsert: true, new: true }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reading-progress/:bookId/quotes - Add a quote to a book
// IMPORTANT: This route must come before /:bookId route to avoid route conflicts
router.post('/:bookId/quotes', auth, async (req, res) => {
  try {
    const { text, chapter, page } = req.body;
    const bookId = decodeURIComponent(req.params.bookId);

    if (!text) {
      return res.status(400).json({ message: 'Quote text is required' });
    }

    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, bookId: bookId },
      {
        $push: {
          quotes: {
            text,
            chapter: chapter || null,
            page: page || null
          }
        }
      },
      { upsert: true, new: true }
    );

    res.json(progress);
  } catch (error) {
    console.error('Error adding quote:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/reading-progress/:bookId - Update reading progress (including quotes)
router.put('/:bookId', auth, async (req, res) => {
  try {
    const { chapter, page, paragraph, lineNumber, quotes } = req.body;
    const bookId = decodeURIComponent(req.params.bookId);

    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      bookId: bookId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Reading progress not found' });
    }

    if (chapter !== undefined) progress.chapter = chapter;
    if (page !== undefined) progress.page = page;
    if (paragraph !== undefined) progress.paragraph = paragraph;
    if (lineNumber !== undefined) progress.lineNumber = lineNumber;
    if (quotes !== undefined) progress.quotes = quotes;

    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/reading-progress/:bookId/quotes/:quoteId - Delete a quote
// IMPORTANT: This route must come before /:bookId route to avoid route conflicts
router.delete('/:bookId/quotes/:quoteId', auth, async (req, res) => {
  try {
    const bookId = decodeURIComponent(req.params.bookId);
    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, bookId: bookId },
      {
        $pull: {
          quotes: { _id: req.params.quoteId }
        }
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ message: 'Reading progress not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reading-progress/:bookId - Get reading progress for a specific book
// This route must come AFTER the quotes routes to avoid conflicts
router.get('/:bookId', auth, async (req, res) => {
  try {
    const bookId = decodeURIComponent(req.params.bookId);
    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      bookId: bookId
    });
    
    if (!progress) {
      return res.status(404).json({ message: 'Reading progress not found' });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

