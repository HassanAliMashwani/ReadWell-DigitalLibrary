const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  chapter: {
    type: Number,
    default: 1
  },
  page: {
    type: Number,
    default: 1
  },
  paragraph: {
    type: Number,
    default: 1
  },
  lineNumber: {
    type: Number,
    default: 1
  },
  quotes: [{
    text: {
      type: String,
      required: true
    },
    chapter: Number,
    page: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastReadAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
readingProgressSchema.index({ user: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);

