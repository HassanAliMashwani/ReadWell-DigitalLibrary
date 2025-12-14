const express = require('express');
const ReadingProgress = require('../models/ReadingProgress');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/reading-progress - Get all reading progress for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const progress = await ReadingProgress.find({ user: req.user._id })
      .sort({ lastReadAt: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reading-progress/:bookId - Get reading progress for a specific book
router.get('/:bookId', auth, async (req, res) => {
  try {
    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      bookId: req.params.bookId
    });
    
    if (!progress) {
      return res.status(404).json({ message: 'Reading progress not found' });
    }
    
    res.json(progress);
  } catch (error) {
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

    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, bookId },
      {
        bookTitle,
        chapter: chapter || 1,
        page: page || 1,
        paragraph: paragraph || 1,
        lineNumber: lineNumber || 1,
        lastReadAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reading-progress/:bookId/quotes - Add a quote to a book
router.post('/:bookId/quotes', auth, async (req, res) => {
  try {
    const { text, chapter, page } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Quote text is required' });
    }

    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, bookId: req.params.bookId },
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
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/reading-progress/:bookId - Update reading progress (including quotes)
router.put('/:bookId', auth, async (req, res) => {
  try {
    const { chapter, page, paragraph, lineNumber, quotes } = req.body;

    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      bookId: req.params.bookId
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
router.delete('/:bookId/quotes/:quoteId', auth, async (req, res) => {
  try {
    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, bookId: req.params.bookId },
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
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

