const express = require('express');
const axios = require('axios');
const router = express.Router();

// Search books in Open Library
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20, language } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // If Urdu is selected, use dedicated Urdu endpoint
    if (language === 'urdu') {
      try {
        const urduResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/openlibrary/urdu`, {
          params: { q, page, limit }
        });
        return res.json(urduResponse.data);
      } catch (urduError) {
        console.error('Urdu search error, falling back to Open Library:', urduError.message);
      }
    }

    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`;
    
    // Add language filter if specified
    if (language === 'urdu') {
      // For Urdu, search with language code 'urd'
      url += '&language=urd';
    } else if (language === 'english') {
      url += '&language=eng';
    }

    const response = await axios.get(url, { timeout: 10000 });

    const books = response.data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      cover: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : language === 'urdu' 
          ? 'https://via.placeholder.com/200x300/3498db/ffffff?text=Urdu+Book'
          : 'https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover',
      year: book.first_publish_year || 'Unknown',
      genre: book.subject ? book.subject.slice(0, 3) : ['General'],
      description: book.first_sentence ? 
        (Array.isArray(book.first_sentence) ? book.first_sentence[0] : book.first_sentence) : 
        'Click "Read Now" to view this book',
      isbn: book.isbn ? (Array.isArray(book.isbn) ? book.isbn[0] : book.isbn) : null,
      olid: book.cover_edition_key || (book.edition_key && book.edition_key[0]),
      language: language || 'english'
    }));

    res.json({
      books,
      total: response.data.num_found,
      page: parseInt(page),
      totalPages: Math.ceil(response.data.num_found / limit)
    });
  } catch (error) {
    console.error('Open Library API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch books from Open Library',
      message: error.message 
    });
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
    const { page = 1, limit = 20, language } = req.query;

    // If Urdu is selected, use dedicated Urdu endpoint with genre
    if (language === 'urdu') {
      try {
        const urduResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/openlibrary/urdu`, {
          params: { q: genre, page, limit }
        });
        return res.json(urduResponse.data);
      } catch (urduError) {
        console.error('Urdu category search error, falling back:', urduError.message);
      }
    }

    let url = `https://openlibrary.org/search.json?subject=${genre}&page=${page}&limit=${limit}`;
    
    // Add language filter if specified
    if (language === 'urdu') {
      url += '&language=urd';
    } else if (language === 'english') {
      url += '&language=eng';
    }

    const response = await axios.get(url, { timeout: 10000 });

    const books = response.data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      cover: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : language === 'urdu'
          ? 'https://via.placeholder.com/200x300/3498db/ffffff?text=Urdu+Book'
          : 'https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover',
      year: book.first_publish_year || 'Unknown',
      genre: book.subject ? book.subject.slice(0, 3) : [genre],
      description: `${genre} book - Click "Read Now" to view`,
      language: language || 'english'
    }));

    res.json({
      books,
      total: response.data.num_found,
      page: parseInt(page),
      totalPages: Math.ceil(response.data.num_found / limit)
    });
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ 
      error: 'Failed to fetch books by category',
      message: error.message 
    });
  }
});

// Get Urdu books specifically - Enhanced with multiple sources
router.get('/urdu', async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    
    let books = [];
    let total = 0;
    
    // Primary source: Open Library with Urdu language filter
    try {
      let url = `https://openlibrary.org/search.json?language=urd&page=${page}&limit=${limit}`;
      
      if (q) {
        url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&language=urd&page=${page}&limit=${limit}`;
      }

      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.docs) {
        books = response.data.docs.map(book => ({
          id: book.key,
          title: book.title,
          author: book.author_name ? book.author_name[0] : 'Unknown Author',
          cover: book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : 'https://via.placeholder.com/200x300/3498db/ffffff?text=Urdu+Book',
          year: book.first_publish_year || 'Unknown',
          genre: book.subject ? book.subject.slice(0, 3) : ['Urdu Literature'],
          description: book.first_sentence ? 
            (Array.isArray(book.first_sentence) ? book.first_sentence[0] : book.first_sentence) : 
            'Urdu book - Click "Read Now" to view',
          language: 'urdu',
          isbn: book.isbn ? (Array.isArray(book.isbn) ? book.isbn[0] : book.isbn) : null
        }));
        
        total = response.data.num_found || books.length;
      }
    } catch (openLibError) {
      console.error('Open Library Urdu books error:', openLibError.message);
    }
    
    // Fallback: If no results, try alternative search terms
    if (books.length === 0 && !q) {
      try {
        const fallbackTerms = ['urdu', 'اردو', 'urdu literature', 'urdu poetry'];
        const randomTerm = fallbackTerms[Math.floor(Math.random() * fallbackTerms.length)];
        const fallbackUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(randomTerm)}&language=urd&page=${page}&limit=${limit}`;
        
        const fallbackResponse = await axios.get(fallbackUrl, { timeout: 10000 });
        
        if (fallbackResponse.data && fallbackResponse.data.docs) {
          books = fallbackResponse.data.docs.map(book => ({
            id: book.key,
            title: book.title,
            author: book.author_name ? book.author_name[0] : 'Unknown Author',
            cover: book.cover_i 
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
              : 'https://via.placeholder.com/200x300/3498db/ffffff?text=Urdu+Book',
            year: book.first_publish_year || 'Unknown',
            genre: book.subject ? book.subject.slice(0, 3) : ['Urdu Literature'],
            description: 'Urdu book - Click "Read Now" to view',
            language: 'urdu',
            isbn: book.isbn ? (Array.isArray(book.isbn) ? book.isbn[0] : book.isbn) : null
          }));
          
          total = fallbackResponse.data.num_found || books.length;
        }
      } catch (fallbackError) {
        console.error('Fallback Urdu books error:', fallbackError.message);
      }
    }
    
    // If still no results, return sample Urdu books data
    if (books.length === 0) {
      books = [
        {
          id: '/works/OL1234567W',
          title: 'Urdu Adab Ki Tareekh',
          author: 'Various Authors',
          cover: 'https://via.placeholder.com/200x300/3498db/ffffff?text=Urdu+Book',
          year: '2020',
          genre: ['Urdu Literature', 'History'],
          description: 'A comprehensive history of Urdu literature',
          language: 'urdu'
        },
        {
          id: '/works/OL1234568W',
          title: 'Urdu Shayari',
          author: 'Famous Poets',
          cover: 'https://via.placeholder.com/200x300/3498db/ffffff?text=Urdu+Poetry',
          year: '2019',
          genre: ['Urdu Poetry', 'Literature'],
          description: 'Collection of beautiful Urdu poetry',
          language: 'urdu'
        }
      ];
      total = 2;
    }

    res.json({
      books,
      total: total || books.length,
      page: parseInt(page),
      totalPages: Math.ceil((total || books.length) / limit)
    });
  } catch (error) {
    console.error('Error fetching Urdu books:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Urdu books',
      message: error.message,
      books: []
    });
  }
});

module.exports = router;