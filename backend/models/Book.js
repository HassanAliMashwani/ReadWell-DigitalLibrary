const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  cover: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  year: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true,
    enum: ['fiction', 'mystery', 'scifi', 'fantasy', 'romance', 'thriller', 'biography', 'history']
  },
  language: {
    type: String,
    required: true,
    enum: ['english', 'spanish', 'french', 'german', 'portuguese', 'swedish', 'russian', 'japanese', 'chinese']
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);