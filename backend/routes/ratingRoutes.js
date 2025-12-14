const express = require('express');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/ratings - Add or update a rating
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, bookTitle, rating } = req.body;

    if (!bookId || !bookTitle || !rating) {
      return res.status(400).json({ message: 'Book ID, title, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const userRating = await Rating.findOneAndUpdate(
      { user: req.user._id, bookId },
      {
        bookTitle,
        rating,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(userRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/ratings/:bookId - Get rating for a specific book (for current user)
router.get('/:bookId', auth, async (req, res) => {
  try {
    const rating = await Rating.findOne({
      user: req.user._id,
      bookId: req.params.bookId
    });

    res.json(rating || { rating: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/ratings/book/:bookId/average - Get average rating for a book
router.get('/book/:bookId/average', async (req, res) => {
  try {
    const ratings = await Rating.find({ bookId: req.params.bookId });
    
    if (ratings.length === 0) {
      return res.json({
        averageRating: 0,
        totalRatings: 0
      });
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = sum / ratings.length;

    res.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/ratings/user - Get all ratings by authenticated user
router.get('/user', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/ratings/popular/week - Get popular books this week
router.get('/popular/week', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get ratings from the last week
    const recentRatings = await Rating.find({
      createdAt: { $gte: oneWeekAgo }
    });

    // Group by bookId and calculate stats
    const bookStats = {};
    recentRatings.forEach(rating => {
      if (!bookStats[rating.bookId]) {
        bookStats[rating.bookId] = {
          bookId: rating.bookId,
          bookTitle: rating.bookTitle,
          ratings: [],
          totalRatings: 0,
          averageRating: 0
        };
      }
      bookStats[rating.bookId].ratings.push(rating.rating);
      bookStats[rating.bookId].totalRatings++;
    });

    // Calculate average ratings
    Object.keys(bookStats).forEach(bookId => {
      const stats = bookStats[bookId];
      const sum = stats.ratings.reduce((a, b) => a + b, 0);
      stats.averageRating = sum / stats.totalRatings;
    });

    // Sort by average rating and total ratings
    const popularBooks = Object.values(bookStats)
      .filter(book => book.totalRatings >= 2) // At least 2 ratings
      .sort((a, b) => {
        // Sort by average rating first, then by total ratings
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return b.totalRatings - a.totalRatings;
      })
      .slice(0, 20); // Top 20

    res.json(popularBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

