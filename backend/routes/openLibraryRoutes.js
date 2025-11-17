const express = require('express');
const axios = require('axios');
const router = express.Router();

// Search books in Open Library
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
    );

    const books = response.data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      cover: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : 'https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover',
      year: book.first_publish_year || 'Unknown',
      genre: book.subject ? book.subject.slice(0, 3) : ['General'],
      description: 'Click "Read Now" to view this book',
      isbn: book.isbn ? book.isbn[0] : null,
      olid: book.cover_edition_key || book.edition_key?.[0]
    }));

    res.json({
      books,
      total: response.data.num_found,
      page: parseInt(page),
      totalPages: Math.ceil(response.data.num_found / limit)
    });
  } catch (error) {
    console.error('Open Library API error:', error);
    res.status(500).json({ error: 'Failed to fetch books from Open Library' });
  }
});

// Get book details by Open Library ID
router.get('/book/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`https://openlibrary.org${id}.json`);
    const bookData = response.data;

    // Get author information
    let authorName = 'Unknown Author';
    if (bookData.authors && bookData.authors[0] && bookData.authors[0].author) {
      const authorResponse = await axios.get(
        `https://openlibrary.org${bookData.authors[0].author.key}.json`
      );
      authorName = authorResponse.data.name;
    }

    // Get cover image
    let coverUrl = 'https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover';
    if (bookData.covers && bookData.covers[0]) {
      coverUrl = `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`;
    }

    const book = {
      id: bookData.key,
      title: bookData.title,
      author: authorName,
      cover: coverUrl,
      description: bookData.description 
        ? (typeof bookData.description === 'string' 
            ? bookData.description 
            : bookData.description.value)
        : 'No description available',
      year: bookData.first_publish_date || 'Unknown',
      genres: bookData.subjects || ['General'],
      isbn: bookData.isbn_13 || bookData.isbn_10 || null
    };

    res.json(book);
  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

// Get popular books (trending)
router.get('/popular', async (req, res) => {
  try {
    // Using search with common terms to get popular books
    const popularSearches = ['fiction', 'romance', 'mystery', 'science fiction', 'biography'];
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];
    
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${randomSearch}&limit=12&sort=rating`
    );

    const books = response.data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      cover: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : 'https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover',
      year: book.first_publish_year || 'Unknown',
      genre: book.subject ? book.subject.slice(0, 2) : ['General'],
      description: 'Popular book - Click "Read Now" to view',
      rating: 4.0 + Math.random() // Simulated rating
    }));

    res.json(books);
  } catch (error) {
    console.error('Error fetching popular books:', error);
    res.status(500).json({ error: 'Failed to fetch popular books' });
  }
});

// Get books by genre/category
router.get('/category/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const response = await axios.get(
      `https://openlibrary.org/search.json?subject=${genre}&page=${page}&limit=${limit}`
    );

    const books = response.data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      cover: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : 'https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover',
      year: book.first_publish_year || 'Unknown',
      genre: book.subject ? book.subject.slice(0, 3) : ['General'],
      description: `${genre} book - Click "Read Now" to view`
    }));

    res.json({
      books,
      total: response.data.num_found,
      page: parseInt(page),
      totalPages: Math.ceil(response.data.num_found / limit)
    });
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ error: 'Failed to fetch books by category' });
  }
});

module.exports = router;