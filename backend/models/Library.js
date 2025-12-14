const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
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
  bookAuthor: {
    type: String,
    default: 'Unknown'
  },
  bookCover: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['favorite', 'bookmark', 'saved'],
    default: 'saved'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries - one entry per user per book per type
librarySchema.index({ user: 1, bookId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Library', librarySchema);

