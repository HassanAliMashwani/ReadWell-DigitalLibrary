// Browse Page Functionality - Enhanced with HCI Principles
class BrowseManager {
    constructor() {
        this.books = [];
        this.filteredBooks = [];
        this.currentPage = 1;
        this.booksPerPage = 20;
        this.totalPages = 1;
        this.totalBooks = 0;
        this.currentView = 'list'; // Only list view
        this.filters = {
            search: '',
            genre: 'all',
            language: 'english', // Default to English
            sort: 'relevance'
        };

        this.API_BASE = 'http://localhost:5000/api';
        this.token = localStorage.getItem('readwell_token');
        this.user = null;
        this.init();
    }

    async init() {
        this.setupEnhancedStyles();
        this.setupSkeletonLoading();
        this.setupBookmarkSystem();
        this.setupThemeManager();
        await this.checkAuth();
        
        // Check for URL parameters (from profile page)
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            this.filters.search = searchQuery;
            const searchFilter = document.getElementById('searchFilter');
            const globalSearch = document.getElementById('globalSearch');
            if (searchFilter) searchFilter.value = searchQuery;
            if (globalSearch) globalSearch.value = searchQuery;
        }
        const bookId = urlParams.get('book');
        const action = urlParams.get('action');
        
        if (bookId && action === 'progress' && this.user) {
            // Load books first, then show progress
            await this.loadPopularBooks();
            const book = this.books.find(b => b.id === bookId) || this.filteredBooks.find(b => b.id === bookId);
            if (book) {
                setTimeout(() => {
                    this.showReadingProgress(bookId, book.title);
                }, 500);
            }
        } else {
            this.loadPopularBooks();
        }
        
        this.setupEventListeners();
        this.setupSearchSuggestions();
        this.setupKeyboardNavigation();
    }

    async checkAuth() {
        if (this.token) {
            try {
                const response = await fetch(`${this.API_BASE}/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    this.user = data.user;
                    this.updateAuthUI();
                } else {
                    localStorage.removeItem('readwell_token');
                    this.token = null;
                    this.updateAuthUI();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.updateAuthUI();
            }
        } else {
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const profileLink = document.getElementById('profileLink');
        
        if (this.user) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                userMenu.style.alignItems = 'center';
            }
            if (userName) userName.textContent = this.user.username;
            if (profileLink) profileLink.style.display = 'block';
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            if (profileLink) profileLink.style.display = 'none';
        }
    }
    
    // Make toggleUserDropdown available globally
    static toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    }

    setupBookmarkSystem() {
        // Keep localStorage as fallback, but prefer backend
        this.favorites = JSON.parse(localStorage.getItem('readwell_favorites')) || [];
        this.bookmarks = JSON.parse(localStorage.getItem('readwell_bookmarks')) || [];
        this.libraryCache = {}; // Cache for library status
    }

    async isBookFavorited(bookId) {
        if (!this.user) return false;
        
        // Check cache first
        if (this.libraryCache[bookId]) {
            return this.libraryCache[bookId].type === 'favorite';
        }
        
        // Check backend
        try {
            const response = await fetch(`${this.API_BASE}/library/check/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                this.libraryCache[bookId] = data;
                return data.type === 'favorite';
            }
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
        
        return false;
    }

    async isBookBookmarked(bookId) {
        if (!this.user) return false;
        
        // Check cache first
        if (this.libraryCache[bookId]) {
            return this.libraryCache[bookId].type === 'bookmark';
        }
        
        // Check backend
        try {
            const response = await fetch(`${this.API_BASE}/library/check/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                this.libraryCache[bookId] = data;
                return data.type === 'bookmark';
            }
        } catch (error) {
            console.error('Error checking bookmark:', error);
        }
        
        return false;
    }

    async toggleFavorite(bookId, bookTitle, bookAuthor = 'Unknown', bookCover = '') {
        if (!this.user) {
            this.showToast('Please login to save favorites', 'error');
            showLoginModal();
            return;
        }

        const isFavorited = await this.isBookFavorited(bookId);
        
        try {
            if (isFavorited) {
                // Remove from favorites
                const response = await fetch(`${this.API_BASE}/library/${bookId}?type=favorite`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                
                if (response.ok) {
                    this.showToast(`Removed "${bookTitle}" from favorites`, 'info');
                    delete this.libraryCache[bookId];
                } else {
                    this.showToast('Failed to remove from favorites', 'error');
                }
            } else {
                // Add to favorites
                const response = await fetch(`${this.API_BASE}/library`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify({
                        bookId,
                        bookTitle,
                        bookAuthor,
                        bookCover,
                        type: 'favorite'
                    })
                });
                
                if (response.ok) {
                    this.showToast(`Added "${bookTitle}" to favorites!`, 'success');
                    this.libraryCache[bookId] = { type: 'favorite', inLibrary: true };
                    // Reload library if on library page
                    if (typeof loadLibrary === 'function') {
                        setTimeout(() => loadLibrary(), 500);
                    }
                } else {
                    this.showToast('Failed to add to favorites', 'error');
                }
            }
            
            this.updateBookIcons(bookId);
        } catch (error) {
            console.error('Error toggling favorite:', error);
            this.showToast('Failed to update favorites', 'error');
        }
    }

    async toggleBookmark(bookId, bookTitle, bookAuthor = 'Unknown', bookCover = '') {
        if (!this.user) {
            this.showToast('Please login to save bookmarks', 'error');
            showLoginModal();
            return;
        }

        const isBookmarked = await this.isBookBookmarked(bookId);
        
        try {
            if (isBookmarked) {
                // Remove from bookmarks
                const response = await fetch(`${this.API_BASE}/library/${bookId}?type=bookmark`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                
                if (response.ok) {
                    this.showToast(`Removed "${bookTitle}" from bookmarks`, 'info');
                    delete this.libraryCache[bookId];
                } else {
                    this.showToast('Failed to remove bookmark', 'error');
                }
            } else {
                // Add to bookmarks
                const response = await fetch(`${this.API_BASE}/library`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify({
                        bookId,
                        bookTitle,
                        bookAuthor,
                        bookCover,
                        type: 'bookmark'
                    })
                });
                
                if (response.ok) {
                    this.showToast(`Bookmarked "${bookTitle}"!`, 'success');
                    this.libraryCache[bookId] = { type: 'bookmark', inLibrary: true };
                    // Reload library if on library page
                    if (typeof loadLibrary === 'function') {
                        setTimeout(() => loadLibrary(), 500);
                    }
                } else {
                    this.showToast('Failed to bookmark', 'error');
                }
            }
            
            this.updateBookIcons(bookId);
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            this.showToast('Failed to update bookmark', 'error');
        }
    }

    async updateBookIcons(bookId) {
        // Update heart icon
        const heartIcon = document.getElementById(`heart-${bookId}`);
        if (heartIcon) {
            const isFavorited = await this.isBookFavorited(bookId);
            if (isFavorited) {
                heartIcon.classList.add('fas');
                heartIcon.classList.remove('far');
                heartIcon.style.color = '#e74c3c';
                heartIcon.parentElement.setAttribute('aria-label', 'Remove from favorites');
            } else {
                heartIcon.classList.add('far');
                heartIcon.classList.remove('fas');
                heartIcon.style.color = '';
                heartIcon.parentElement.setAttribute('aria-label', 'Add to favorites');
            }
        }
        
        // Update bookmark icon
        const bookmarkIcon = document.getElementById(`bookmark-${bookId}`);
        if (bookmarkIcon) {
            const isBookmarked = await this.isBookBookmarked(bookId);
            if (isBookmarked) {
                bookmarkIcon.classList.add('fas');
                bookmarkIcon.classList.remove('far');
                bookmarkIcon.style.color = '#3498db';
                bookmarkIcon.parentElement.setAttribute('aria-label', 'Remove bookmark');
            } else {
                bookmarkIcon.classList.add('far');
                bookmarkIcon.classList.remove('fas');
                bookmarkIcon.style.color = '';
                bookmarkIcon.parentElement.setAttribute('aria-label', 'Bookmark this book');
            }
        }
    }

    setupSearchSuggestions() {
        const searchInput = document.getElementById('searchFilter');
        const globalSearch = document.getElementById('globalSearch');
        
        [searchInput, globalSearch].forEach(input => {
            if (input) {
                input.addEventListener('input', (e) => {
                    this.showSearchSuggestions(e.target.value);
                });
                
                input.addEventListener('focus', (e) => {
                    if (e.target.value) {
                        this.showSearchSuggestions(e.target.value);
                    }
                });
                
                input.addEventListener('blur', () => {
                    setTimeout(() => this.hideSearchSuggestions(), 200);
                });
            }
        });
    }

    async showSearchSuggestions(query) {
        if (!query || query.length < 2) {
            this.hideSearchSuggestions();
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE}/openlibrary/search?q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            
            this.renderSearchSuggestions(data.books, query);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    renderSearchSuggestions(books, query) {
        this.hideSearchSuggestions();
        
        const searchInput = document.getElementById('searchFilter');
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.innerHTML = `
            <div class="suggestions-list">
                ${books.map(book => `
                    <div class="suggestion-item" onclick="browseManager.selectSuggestion('${book.title}')">
                        <i class="fas fa-search"></i>
                        <span>${book.title}</span>
                        <small>by ${book.author}</small>
                    </div>
                `).join('')}
                <div class="suggestion-item see-all" onclick="browseManager.selectSuggestion('${query}')">
                    <i class="fas fa-arrow-right"></i>
                    <span>See all results for "${query}"</span>
                </div>
            </div>
        `;
        
        searchInput.parentNode.appendChild(suggestionsContainer);
    }

    hideSearchSuggestions() {
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
    }

    selectSuggestion(query) {
        document.getElementById('searchFilter').value = query;
        document.getElementById('globalSearch').value = query;
        this.filters.search = query;
        this.currentPage = 1;
        this.searchBooks();
        this.hideSearchSuggestions();
    }

    setupThemeManager() {
        this.themeManager = new ThemeManager();
    }

    setupEnhancedStyles() {
        // Add enhanced HCI styles if not already present
        if (!document.querySelector('#hci-styles')) {
            const styles = document.createElement('style');
            styles.id = 'hci-styles';
            styles.textContent = `
                /* Dark/Light Mode Variables */
                :root {
                    --bg-primary: #f8f9fa;
                    --bg-secondary: white;
                    --text-primary: #333;
                    --text-secondary: #7f8c8d;
                    --border-color: #ecf0f1;
                    --shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                [data-theme="dark"] {
                    --bg-primary: #1a1a1a;
                    --bg-secondary: #2d2d2d;
                    --text-primary: #ffffff;
                    --text-secondary: #b0b0b0;
                    --border-color: #404040;
                    --shadow: 0 2px 10px rgba(0,0,0,0.3);
                }

                /* Apply theme variables */
                body {
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    transition: background-color 0.3s ease, color 0.3s ease;
                }

                .header {
                    background: linear-gradient(135deg, var(--bg-secondary), var(--border-color));
                }

                .book-card, .filters-sidebar, .browse-controls {
                    background: var(--bg-secondary);
                    box-shadow: var(--shadow);
                    border: 1px solid var(--border-color);
                }

                .main-nav a, .footer-section a {
                    color: var(--text-primary);
                }

                /* Theme Toggle Button */
                .theme-toggle {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background-color 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .theme-toggle:hover {
                    background-color: var(--border-color);
                }

                /* Enhanced HCI Styles */
                .btn:active {
                    transform: scale(0.98);
                    transition: transform 0.1s;
                }

                .btn:focus, .view-btn:focus, .checkbox input:focus + .checkmark {
                    outline: 3px solid #3498db;
                    outline-offset: 2px;
                }

                .skeleton-loading {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }

                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .search-progress {
                    width: 100%;
                    margin-top: 10px;
                }

                .progress-bar {
                    width: 100%;
                    height: 4px;
                    background: #ecf0f1;
                    border-radius: 2px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3498db, #2ecc71);
                    transition: width 0.3s ease;
                    width: 0%;
                }

                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-left: 4px solid #e74c3c;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-radius: 8px;
                    padding: 1rem;
                    max-width: 400px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                }

                .notification.success { border-left-color: #2ecc71; }
                .notification.warning { border-left-color: #f39c12; }
                .notification.info { border-left-color: #3498db; }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: #7f8c8d;
                    cursor: pointer;
                    padding: 0.25rem;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .toast {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #2ecc71;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    animation: slideUp 0.3s ease;
                }

                .toast.error { background: #e74c3c; }
                .toast.info { background: #3498db; }

                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }

                /* Enhanced book card interactions */
                .book-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .book-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
                }

                .book-card:focus-within {
                    outline: 2px solid #3498db;
                    outline-offset: 4px;
                }

                /* Search Suggestions */
                .search-suggestions {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    box-shadow: var(--shadow);
                    z-index: 1000;
                    margin-top: 5px;
                }

                .suggestions-list {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .suggestion-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    cursor: pointer;
                    border-bottom: 1px solid var(--border-color);
                    transition: background-color 0.2s ease;
                }

                .suggestion-item:hover {
                    background-color: var(--border-color);
                }

                .suggestion-item i {
                    margin-right: 12px;
                    color: var(--text-secondary);
                    width: 16px;
                }

                .suggestion-item span {
                    flex: 1;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .suggestion-item small {
                    color: var(--text-secondary);
                    margin-left: 8px;
                }

                .suggestion-item.see-all {
                    background-color: var(--bg-primary);
                    font-weight: 600;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    setupSkeletonLoading() {
        const booksContainer = document.getElementById('booksContainer');
        if (booksContainer) {
            booksContainer.innerHTML = this.getSkeletonHTML(8);
        }
    }

    getSkeletonHTML(count) {
        return Array(count).fill(`
            <div class="book-card skeleton-loading">
                <div class="book-cover" style="height: 200px; background: #f0f0f0; border-radius: 8px;"></div>
                <div class="book-info">
                    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
                    <div style="height: 16px; background: #f0f0f0; margin-bottom: 8px; border-radius: 4px; width: 60%;"></div>
                    <div style="height: 14px; background: #f0f0f0; border-radius: 4px; width: 40%;"></div>
                </div>
            </div>
        `).join('');
    }

    // Load popular books - try ratings API first, then fallback to Open Library
    async loadPopularBooks() {
        this.showLoading();
        
        try {
            // Check if Urdu is selected
            if (this.filters.language === 'urdu') {
                // Use dedicated Urdu API
                const response = await fetch(`${this.API_BASE}/openlibrary/urdu?page=${this.currentPage}&limit=${this.booksPerPage}`);
                const data = await response.json();
                this.books = data.books || [];
                this.filteredBooks = this.books;
                this.updateDisplay();
                this.hideLoading();
                return;
            }
            
            // Try to get popular books from ratings API
            const ratingsResponse = await fetch(`${this.API_BASE}/ratings/popular/week`);
            let books = [];
            
            if (ratingsResponse.ok) {
                const popularBooks = await ratingsResponse.json();
                if (popularBooks.length > 0) {
                    // Fetch book details for popular books
                    books = await Promise.all(
                        popularBooks.slice(0, 20).map(async (book) => {
                            try {
                                const bookResponse = await fetch(`${this.API_BASE}/openlibrary/book${book.bookId}`);
                                if (bookResponse.ok) {
                                    const bookData = await bookResponse.json();
                                    return {
                                        ...bookData,
                                        averageRating: book.averageRating,
                                        totalRatings: book.totalRatings
                                    };
                                }
                            } catch (error) {
                                console.error('Error fetching book details:', error);
                            }
                            // Fallback
                            return {
                                id: book.bookId,
                                title: book.bookTitle,
                                author: 'Unknown',
                                cover: 'https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover',
                                year: 'Unknown',
                                description: 'Popular book this week',
                                averageRating: book.averageRating,
                                totalRatings: book.totalRatings
                            };
                        })
                    );
                }
            }
            
            // Fallback to Open Library if no popular books from ratings
            if (books.length === 0) {
                const response = await fetch(`${this.API_BASE}/openlibrary/popular`);
                books = await response.json();
            }
            
            // Load ratings if user is authenticated
            if (this.user) {
                await this.loadBookRatings(books);
            }
            
            this.books = books;
            this.filteredBooks = this.books;
            this.updateDisplay();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading books:', error);
            this.showError('Failed to load books. Please check your connection and try again.');
            this.hideLoading();
        }
    }

    // Search books in Open Library
    async searchBooks() {
        this.showLoading();
        this.showSearchProgress();
        
        try {
            let url;
            
            // Handle language-specific API calls
            if (this.filters.language === 'urdu') {
                // For Urdu, use dedicated Urdu API endpoint
                if (this.filters.genre && this.filters.genre !== 'all') {
                    url = `${this.API_BASE}/openlibrary/category/${this.filters.genre}?page=${this.currentPage}&limit=${this.booksPerPage}&language=urdu`;
                } else if (this.filters.search) {
                    url = `${this.API_BASE}/openlibrary/search?q=${encodeURIComponent(this.filters.search)}&page=${this.currentPage}&limit=${this.booksPerPage}&language=urdu`;
                } else {
                    url = `${this.API_BASE}/openlibrary/urdu?page=${this.currentPage}&limit=${this.booksPerPage}`;
                }
            } else {
                // For English, use standard endpoints
                const languageParam = this.filters.language === 'english' ? '&language=english' : '';
                
                if (this.filters.genre && this.filters.genre !== 'all') {
                    url = `${this.API_BASE}/openlibrary/category/${this.filters.genre}?page=${this.currentPage}&limit=${this.booksPerPage}${languageParam}`;
                } else if (this.filters.search) {
                    url = `${this.API_BASE}/openlibrary/search?q=${encodeURIComponent(this.filters.search)}&page=${this.currentPage}&limit=${this.booksPerPage}${languageParam}`;
                } else {
                    this.loadPopularBooks();
                    return;
                }
            }
            
            // Add sort parameter if applicable
            if (this.filters.sort && this.filters.sort !== 'relevance') {
                url += `&sort=${this.getOpenLibrarySort(this.filters.sort)}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            this.filteredBooks = this.applyClientSideSorting(data.books || data);
            
            // Store pagination info
            this.totalPages = data.totalPages || Math.ceil((data.total || this.filteredBooks.length) / this.booksPerPage) || 1;
            this.totalBooks = data.total || this.filteredBooks.length;
            
            // Load ratings and library status for books
            if (this.user) {
                await Promise.all([
                    this.loadBookRatings(this.filteredBooks),
                    this.loadLibraryStatus(this.filteredBooks)
                ]);
            }
            
            this.updateResultsCount(this.totalBooks, data.page || this.currentPage, this.totalPages);
            
            this.updateDisplay();
            this.hideLoading();
            this.hideSearchProgress();
        } catch (error) {
            console.error('Error searching books:', error);
            this.showError('Search failed. Please check your connection and try again.');
            this.hideLoading();
            this.hideSearchProgress();
        }
    }

    async loadBookRatings(books) {
        for (let book of books) {
            try {
                const response = await fetch(`${this.API_BASE}/ratings/book/${book.id}/average`);
                const data = await response.json();
                book.averageRating = data.averageRating || 0;
                book.totalRatings = data.totalRatings || 0;
            } catch (error) {
                book.averageRating = 0;
                book.totalRatings = 0;
            }
        }
    }

    async loadLibraryStatus(books) {
        if (!this.user) return;
        
        for (let book of books) {
            try {
                const response = await fetch(`${this.API_BASE}/library/check/${encodeURIComponent(book.id)}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    this.libraryCache[book.id] = data;
                    // Update icons after loading
                    await this.updateBookIcons(book.id);
                }
            } catch (error) {
                console.error('Error loading library status:', error);
                this.libraryCache[book.id] = { inLibrary: false, type: null };
            }
        }
    }

    getOpenLibrarySort(sortType) {
        const sortMap = {
            'newest': 'new',
            'oldest': 'old',
            'popularity': 'editions',
            'rating': 'rating'
        };
        return sortMap[sortType] || 'relevance';
    }

    applyClientSideSorting(books) {
        switch (this.filters.sort) {
            case 'title':
                return [...books].sort((a, b) => a.title.localeCompare(b.title));
            case 'author':
                return [...books].sort((a, b) => (a.author || '').localeCompare(b.author || ''));
            case 'year_newest':
                return [...books].sort((a, b) => (b.year || 0) - (a.year || 0));
            case 'year_oldest':
                return [...books].sort((a, b) => (a.year || 0) - (b.year || 0));
            default:
                return books;
        }
    }

    setupEventListeners() {
        // Search filter with debouncing
        const searchFilter = document.getElementById('searchFilter');
        if (searchFilter) {
            searchFilter.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.currentPage = 1;
                this.debounce(() => this.searchBooks(), 500);
            });
        }

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.currentPage = 1;
                this.debounce(() => this.searchBooks(), 500);
            });
        }

        // Genre checkboxes - Convert to single selection with enhanced feedback
        document.querySelectorAll('.checkbox input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                // Uncheck all other checkboxes
                document.querySelectorAll('.checkbox input[type="checkbox"]').forEach(otherCheckbox => {
                    if (otherCheckbox !== e.target) {
                        otherCheckbox.checked = false;
                    }
                });
                
                this.filters.genre = e.target.checked ? e.target.value : 'all';
                this.currentPage = 1;
                
                if (e.target.checked) {
                    this.showToast(`Filtering by ${e.target.value} genre`, 'info');
                }
                
                this.searchBooks();
            });
        });

        // Language filter - Updated for English/Urdu only
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.filters.language = e.target.value;
                this.currentPage = 1;
                this.showToast(`Filtering ${e.target.value} books`, 'info');
                this.searchBooks();
            });
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.currentPage = 1;
                this.showToast(`Sorted by: ${e.target.options[e.target.selectedIndex].text}`, 'info');
                this.searchBooks();
            });
        }

        // Pagination with enhanced feedback
        const prevPage = document.getElementById('prevPage');
        if (prevPage) {
            prevPage.addEventListener('click', () => {
                this.previousPage();
            });
        }

        const nextPage = document.getElementById('nextPage');
        if (nextPage) {
            nextPage.addEventListener('click', () => {
                this.nextPage();
            });
        }

        // Filter toggle for mobile
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                this.toggleFilters();
            });
        }

        // Enhanced clear filters
        const clearBtn = document.querySelector('.btn-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.showToast('All filters cleared', 'info');
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close notifications
            if (e.key === 'Escape') {
                document.querySelectorAll('.notification, .toast').forEach(element => {
                    element.remove();
                });
            }
            
            // Enter key on book cards
            if (e.key === 'Enter' && e.target.classList.contains('book-card')) {
                const readButton = e.target.querySelector('.btn-read');
                if (readButton) readButton.click();
            }
        });
    }

    // Removed setView - only list view is supported now

    updateDisplay() {
        this.renderBooks();
        this.updatePagination();
    }

    async renderBooks() {
        const booksContainer = document.getElementById('booksContainer');
        const booksToShow = this.filteredBooks;

        if (booksToShow.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        // Load user ratings if authenticated
        const userRatings = {};
        if (this.user) {
            for (let book of booksToShow) {
                try {
                    const response = await fetch(`${this.API_BASE}/ratings/${book.id}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        userRatings[book.id] = data.rating;
                    }
                } catch (error) {
                    console.error('Error loading user rating:', error);
                }
            }
        }

        booksContainer.innerHTML = booksToShow.map(book => {
            const userRating = userRatings[book.id] || null;
            const avgRating = book.averageRating || 0;
            const totalRatings = book.totalRatings || 0;
            
            return `
            <div class="book-card" tabindex="0" role="button" aria-label="${book.title} by ${book.author}" 
                 onkeypress="if(event.key==='Enter') readBook('${book.id}', '${book.title}', '${book.author}')">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title} Cover" 
                         onerror="this.src='https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover'"
                         loading="lazy">
                    <div class="book-overlay">
                        ${this.user ? `
                        <button class="btn-icon" aria-label="Add to favorites" 
                                onclick="browseManager.toggleFavorite('${book.id}', '${book.title.replace(/'/g, "\\'")}', '${(book.author || 'Unknown').replace(/'/g, "\\'")}', '${book.cover || ''}')"
                                data-book-id="${book.id}" data-action="favorite">
                            <i class="far fa-heart" id="heart-${book.id}"></i>
                        </button>
                        <button class="btn-icon" aria-label="Bookmark this book" 
                                onclick="browseManager.toggleBookmark('${book.id}', '${book.title.replace(/'/g, "\\'")}', '${(book.author || 'Unknown').replace(/'/g, "\\'")}', '${book.cover || ''}')"
                                data-book-id="${book.id}" data-action="bookmark">
                            <i class="far fa-bookmark" id="bookmark-${book.id}"></i>
                        </button>
                        ` : ''}
                        <button class="btn-read" 
                                onclick="readBook('${book.id}', '${book.title}', '${book.author}')">
                            Read Now
                        </button>
                    </div>
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">${book.author}</p>
                    <div class="rating">
                        <div class="stars" onclick="event.stopPropagation();">
                            ${this.renderRatingStars(avgRating, book.id, userRating)}
                        </div>
                        <span class="rating-value">${avgRating > 0 ? avgRating.toFixed(1) : 'No ratings'}</span>
                        ${totalRatings > 0 ? `<span class="rating-count">(${totalRatings})</span>` : ''}
                    </div>
                    <p class="book-year">${book.year}</p>
                    <p class="book-description">${book.description}</p>
                    ${this.user ? `
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                        <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); browseManager.showReadingProgress('${book.id}', '${book.title.replace(/'/g, "\\'")}')">
                            <i class="fas fa-book-open"></i> Reading Progress
                        </button>
                    </div>
                    ` : `
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showLoginModal()" style="margin-top: 0.5rem;">
                        <i class="fas fa-sign-in-alt"></i> Login to Track Progress
                    </button>
                    `}
                </div>
            </div>
        `;
        }).join('');
        
        // Icons will be updated after loadLibraryStatus completes
        // No need to call updateBookIcons here as it's async and will be called after library status loads
    }

    renderRatingStars(avgRating, bookId, userRating) {
        let stars = '';
        const rating = userRating || avgRating;
        
        for (let i = 1; i <= 5; i++) {
            if (this.user) {
                stars += `<i class="fas fa-star rating-star ${i <= rating ? 'active' : ''}" 
                             onclick="event.stopPropagation(); browseManager.rateBook('${bookId}', ${i})"
                             data-rating="${i}"></i>`;
            } else {
                if (i <= Math.floor(rating)) {
                    stars += '<i class="fas fa-star"></i>';
                } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
        }
        return stars;
    }

    async rateBook(bookId, rating) {
        if (!this.user) {
            this.showToast('Please login to rate books', 'error');
            showLoginModal();
            return;
        }

        try {
            const book = this.filteredBooks.find(b => b.id === bookId);
            const response = await fetch(`${this.API_BASE}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    bookId,
                    bookTitle: book.title,
                    rating
                })
            });

            if (response.ok) {
                this.showToast(`Rated ${rating} stars!`, 'success');
                // Reload ratings
                await this.loadBookRatings(this.filteredBooks);
                this.renderBooks();
            } else {
                this.showToast('Failed to submit rating', 'error');
            }
        } catch (error) {
            console.error('Error rating book:', error);
            this.showToast('Failed to submit rating', 'error');
        }
    }

    async showReadingProgress(bookId, bookTitle) {
        if (!this.user) {
            this.showToast('Please login to track reading progress', 'error');
            showLoginModal();
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE}/reading-progress/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            let progress = null;
            if (response.ok) {
                progress = await response.json();
            } else if (response.status === 404) {
                // No progress yet, create new
                progress = null;
            }

            // Show reading progress modal
            this.showReadingProgressModal(bookId, bookTitle, progress);
        } catch (error) {
            console.error('Error loading reading progress:', error);
            this.showReadingProgressModal(bookId, bookTitle, null);
        }
    }

    openBook(bookId, bookTitle) {
        this.showToast(`Opening "${bookTitle}"...`, 'info');
        setTimeout(() => {
            const openLibraryUrl = `https://openlibrary.org${bookId}`;
            window.open(openLibraryUrl, '_blank');
        }, 500);
    }

    showReadingProgressModal(bookId, bookTitle, progress) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
        
        const safeTitle = bookTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const encodedBookId = encodeURIComponent(bookId);
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>Reading Progress: ${safeTitle}</h2>
                
                <form id="progressForm" onsubmit="event.preventDefault(); browseManager.saveAllProgress(event, '${encodedBookId}', '${safeTitle}')">
                    <div style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem;"><i class="fas fa-book-open"></i> Progress Details</h3>
                        <div class="form-group">
                            <label>Chapter (optional)</label>
                            <input type="number" id="progressChapter" value="${progress?.chapter || ''}" min="0">
                        </div>
                        <div class="form-group">
                            <label>Page (optional)</label>
                            <input type="number" id="progressPage" value="${progress?.page || ''}" min="0">
                        </div>
                        <div class="form-group">
                            <label>Paragraph (optional)</label>
                            <input type="number" id="progressParagraph" value="${progress?.paragraph || ''}" min="0">
                        </div>
                        <div class="form-group">
                            <label>Line Number (optional)</label>
                            <input type="number" id="progressLine" value="${progress?.lineNumber || ''}" min="0">
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem; margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem;"><i class="fas fa-quote-left"></i> Saved Quotes</h3>
                        <div id="quotesList">
                            ${progress?.quotes && progress.quotes.length > 0 ? 
                                progress.quotes.map((quote, idx) => `
                                    <div class="quote-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem;">
                                        <p style="font-style: italic; color: var(--text-primary); margin-bottom: 0.5rem;">"${quote.text}"</p>
                                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-secondary);">
                                            <span>Chapter ${quote.chapter || 'N/A'}, Page ${quote.page || 'N/A'}</span>
                                            <button type="button" class="btn btn-small" onclick="browseManager.deleteQuote('${encodedBookId}', '${quote._id || idx}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                                <i class="fas fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : 
                                '<p style="color: var(--text-secondary);">No quotes saved yet.</p>'
                            }
                        </div>
                        <div style="margin-top: 1.5rem;">
                            <h4>Add New Quote</h4>
                            <div class="form-group">
                                <label>Quote Text</label>
                                <textarea id="quoteText" style="width: 100%; min-height: 100px; font-family: inherit;"></textarea>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label>Chapter (optional)</label>
                                    <input type="number" id="quoteChapter" min="1" value="${progress?.chapter || ''}">
                                </div>
                                <div class="form-group">
                                    <label>Page (optional)</label>
                                    <input type="number" id="quotePage" min="1" value="${progress?.page || ''}">
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary" onclick="browseManager.addQuoteInline('${encodedBookId}')">
                                <i class="fas fa-plus"></i> Add Quote
                            </button>
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 2px solid var(--border-color);">
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem; font-size: 1rem;">
                            <i class="fas fa-save"></i> Save All Progress & Quotes
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async saveAllProgress(event, bookId, bookTitle) {
        event.preventDefault();
        
        const chapterInput = document.getElementById('progressChapter');
        const pageInput = document.getElementById('progressPage');
        const paragraphInput = document.getElementById('progressParagraph');
        const lineInput = document.getElementById('progressLine');
        
        if (!chapterInput || !pageInput || !paragraphInput || !lineInput) {
            this.showToast('Form fields not found', 'error');
            return;
        }
        
        const progress = {
            bookId: decodeURIComponent(bookId),
            bookTitle,
            chapter: chapterInput.value ? parseInt(chapterInput.value) : null,
            page: pageInput.value ? parseInt(pageInput.value) : null,
            paragraph: paragraphInput.value ? parseInt(paragraphInput.value) : null,
            lineNumber: lineInput.value ? parseInt(lineInput.value) : null
        };

        try {
            const response = await fetch(`${this.API_BASE}/reading-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(progress)
            });

            if (response.ok) {
                this.showToast('Reading progress saved!', 'success');
                // Close modal and refresh
                setTimeout(() => {
                    const modal = document.querySelector('.modal');
                    if (modal) modal.remove();
                    // Reload if on profile page
                    if (window.location.pathname.includes('profile.html')) {
                        window.location.reload();
                    } else {
                        // If on browse page, reload the progress modal to show updated data
                        const book = this.filteredBooks.find(b => b.id === decodeURIComponent(bookId));
                        if (book) {
                            this.showReadingProgress(decodeURIComponent(bookId), book.title);
                        }
                    }
                }, 1000);
            } else {
                const errorData = await response.json();
                this.showToast(errorData.message || 'Failed to save progress', 'error');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
            this.showToast('Failed to save progress', 'error');
        }
    }

    async addQuoteInline(bookId) {
        const quoteText = document.getElementById('quoteText');
        const quoteChapter = document.getElementById('quoteChapter');
        const quotePage = document.getElementById('quotePage');
        
        if (!quoteText || !quoteText.value.trim()) {
            this.showToast('Please enter a quote', 'error');
            return;
        }
        
        const quote = {
            text: quoteText.value.trim(),
            chapter: quoteChapter && quoteChapter.value ? parseInt(quoteChapter.value) : null,
            page: quotePage && quotePage.value ? parseInt(quotePage.value) : null
        };

        try {
            const response = await fetch(`${this.API_BASE}/reading-progress/${bookId}/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(quote)
            });

            if (response.ok) {
                this.showToast('Quote added!', 'success');
                if (quoteText) quoteText.value = '';
                if (quoteChapter) quoteChapter.value = '';
                if (quotePage) quotePage.value = '';
                // Reload the modal to show updated quotes
                const book = this.filteredBooks.find(b => b.id === decodeURIComponent(bookId));
                if (book) {
                    setTimeout(() => {
                        this.showReadingProgress(decodeURIComponent(bookId), book.title);
                    }, 500);
                }
            } else {
                const errorData = await response.json();
                this.showToast(errorData.message || 'Failed to save quote', 'error');
            }
        } catch (error) {
            console.error('Error saving quote:', error);
            this.showToast('Failed to save quote', 'error');
        }
    }

    async addQuote(event, bookId) {
        event.preventDefault();
        
        const quoteText = document.getElementById('quoteText');
        const quoteChapter = document.getElementById('quoteChapter');
        const quotePage = document.getElementById('quotePage');
        
        if (!quoteText || !quoteText.value.trim()) {
            this.showToast('Please enter a quote', 'error');
            return;
        }
        
        const quote = {
            text: quoteText.value.trim(),
            chapter: quoteChapter && quoteChapter.value ? parseInt(quoteChapter.value) : null,
            page: quotePage && quotePage.value ? parseInt(quotePage.value) : null
        };

        try {
            // Encode bookId to handle special characters like /
            const encodedBookId = encodeURIComponent(bookId);
            const response = await fetch(`${this.API_BASE}/reading-progress/${encodedBookId}/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(quote)
            });

            if (response.ok) {
                this.showToast('Quote saved!', 'success');
                if (quoteText) quoteText.value = '';
                if (quoteChapter) quoteChapter.value = '';
                if (quotePage) quotePage.value = '';
                // Reload progress
                const book = this.filteredBooks.find(b => b.id === bookId);
                if (book) {
                    setTimeout(() => {
                        this.showReadingProgress(bookId, book.title);
                    }, 500);
                }
            } else {
                const errorData = await response.json();
                this.showToast(errorData.message || 'Failed to save quote', 'error');
            }
        } catch (error) {
            console.error('Error saving quote:', error);
            this.showToast('Failed to save quote', 'error');
        }
    }

    async deleteQuote(bookId, quoteId) {
        try {
            // Encode bookId to handle special characters like /
            const encodedBookId = encodeURIComponent(bookId);
            const response = await fetch(`${this.API_BASE}/reading-progress/${encodedBookId}/quotes/${quoteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.showToast('Quote deleted!', 'success');
                const book = this.filteredBooks.find(b => b.id === bookId);
                this.showReadingProgress(bookId, book.title);
            } else {
                this.showToast('Failed to delete quote', 'error');
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            this.showToast('Failed to delete quote', 'error');
        }
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }

        return stars;
    }

    updatePagination() {
        const totalPages = this.totalPages || Math.ceil((this.filteredBooks.length || 100) / this.booksPerPage) || 1;
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (!paginationNumbers || !prevBtn || !nextBtn) return;

        prevBtn.classList.toggle('disabled', this.currentPage === 1);
        nextBtn.classList.toggle('disabled', this.currentPage >= totalPages || totalPages === 0);

        let paginationHTML = '';
        // Show current page + 9 more pages (total 10 pages visible)
        // But ensure we show at least 10 pages if totalPages >= 10
        const maxVisiblePages = Math.min(10, totalPages);
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages && totalPages >= maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Ensure we show at least 10 pages if available
        if (totalPages >= 10 && endPage - startPage + 1 < 10) {
            if (this.currentPage <= 5) {
                startPage = 1;
                endPage = Math.min(10, totalPages);
            } else if (this.currentPage >= totalPages - 4) {
                endPage = totalPages;
                startPage = Math.max(1, totalPages - 9);
            } else {
                startPage = this.currentPage - 4;
                endPage = this.currentPage + 5;
            }
        }

        // Show first page if not in range
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-number" onclick="browseManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Show page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="browseManager.goToPage(${i})"
                        aria-label="Go to page ${i}">
                    ${i}
                </button>
            `;
        }

        // Show last page if not in range
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-number" onclick="browseManager.goToPage(${totalPages})">${totalPages}</button>`;
        }

        paginationNumbers.innerHTML = paginationHTML;
    }

    updateResultsCount(total, currentPage, totalPages) {
        const start = Math.min((currentPage - 1) * this.booksPerPage + 1, total);
        const end = Math.min(currentPage * this.booksPerPage, total);
        
        document.getElementById('resultsCount').textContent = 
            total === 0 ? '0' : `${start}-${end} of ${total}`;
    }

    goToPage(page) {
        if (page < 1 || (this.totalPages && page > this.totalPages)) return;
        this.currentPage = page;
        this.searchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    nextPage() {
        const maxPage = this.totalPages || Math.ceil((this.filteredBooks.length || 100) / this.booksPerPage) || 1;
        if (this.currentPage < maxPage) {
            this.currentPage++;
            this.searchBooks();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    showLoading() {
        document.getElementById('loadingState').style.display = 'block';
        const booksContainer = document.getElementById('booksContainer');
        if (booksContainer) {
            booksContainer.style.opacity = '0.5';
        }
    }

    hideLoading() {
        document.getElementById('loadingState').style.display = 'none';
        const booksContainer = document.getElementById('booksContainer');
        if (booksContainer) {
            booksContainer.style.opacity = '1';
        }
    }

    showSearchProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'search-progress';
        progressBar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;
        
        const controls = document.querySelector('.browse-controls');
        if (controls) {
            // Remove existing progress bar if any
            const existingProgress = controls.querySelector('.search-progress');
            if (existingProgress) {
                existingProgress.remove();
            }
            controls.appendChild(progressBar);
        }
        
        // Animate progress bar
        setTimeout(() => {
            const fill = progressBar.querySelector('.progress-fill');
            if (fill) {
                fill.style.width = '100%';
            }
        }, 100);
    }

    hideSearchProgress() {
        const progressBar = document.querySelector('.search-progress');
        if (progressBar) {
            setTimeout(() => {
                progressBar.remove();
            }, 500);
        }
    }

    showNoResults() {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('booksContainer').style.display = 'none';
        document.getElementById('loadingState').style.display = 'none';
    }

    hideNoResults() {
        document.getElementById('noResults').style.display = 'none';
        document.getElementById('booksContainer').style.display = 'block';
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }

    toggleFilters() {
        const sidebar = document.getElementById('filtersSidebar');
        sidebar.classList.toggle('active');
        this.showToast('Filters panel ' + (sidebar.classList.contains('active') ? 'opened' : 'closed'), 'info');
    }

    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }
}

// Theme Manager Class
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('readwell_theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.showThemeNotification();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('readwell_theme', theme);
        
        // Update toggle icon
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    showThemeNotification() {
        const message = this.currentTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled';
        if (typeof browseManager !== 'undefined') {
            browseManager.showToast(message, 'info');
        }
    }
}

// Authentication Functions
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('readwell_token', data.token);
            browseManager.token = data.token;
            browseManager.user = data.user;
            browseManager.showToast('Login successful! Redirecting...', 'success');
            closeModal('loginModal');
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            browseManager.showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        browseManager.showToast('Login failed. Please try again.', 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('readwell_token', data.token);
            browseManager.token = data.token;
            browseManager.user = data.user;
            browseManager.showToast('Account created successfully! Redirecting...', 'success');
            closeModal('signupModal');
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            browseManager.showToast(data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        browseManager.showToast('Signup failed. Please try again.', 'error');
    }
}

function logout() {
    localStorage.removeItem('readwell_token');
    if (browseManager) {
        browseManager.token = null;
        browseManager.user = null;
        browseManager.showToast('Logged out successfully', 'info');
    }
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenuBtn');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function showSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Enhanced global functions with HCI improvements
function performSearch() {
    const searchTerm = document.getElementById('globalSearch').value;
    document.getElementById('searchFilter').value = searchTerm;
    browseManager.filters.search = searchTerm;
    browseManager.currentPage = 1;
    browseManager.searchBooks();
    browseManager.showToast(`Searching for "${searchTerm}"`, 'info');
}

function clearAllFilters() {
    document.getElementById('searchFilter').value = '';
    document.getElementById('globalSearch').value = '';
    
    // Uncheck all genre checkboxes
    document.querySelectorAll('.checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset language and sort
    document.getElementById('languageSelect').value = 'english';
    document.getElementById('sortSelect').value = 'relevance';
    
    browseManager.filters = {
        search: '',
        genre: 'all',
        language: 'english',
        sort: 'relevance'
    };
    
    browseManager.currentPage = 1;
    browseManager.showToast('All filters cleared', 'success');
    browseManager.loadPopularBooks();
}

async function addToFavorites(bookId, bookTitle = 'book') {
    const book = browseManager.filteredBooks.find(b => b.id === bookId) || 
                 browseManager.books.find(b => b.id === bookId);
    if (book) {
        await browseManager.toggleFavorite(bookId, bookTitle, book.author || 'Unknown', book.cover || '');
    } else {
        await browseManager.toggleFavorite(bookId, bookTitle);
    }
}

async function addToBookmark(bookId, bookTitle = 'book') {
    const book = browseManager.filteredBooks.find(b => b.id === bookId) || 
                 browseManager.books.find(b => b.id === bookId);
    if (book) {
        await browseManager.toggleBookmark(bookId, bookTitle, book.author || 'Unknown', book.cover || '');
    } else {
        await browseManager.toggleBookmark(bookId, bookTitle);
    }
}

function readBook(bookId, title, author) {
    browseManager.showToast(`Opening "${title}"...`, 'info');
    
    // Small delay for better UX
    setTimeout(() => {
        const openLibraryUrl = `https://openlibrary.org${bookId}`;
        window.open(openLibraryUrl, '_blank');
    }, 500);
}

// Initialize the browse manager when the page loads
let browseManager;
document.addEventListener('DOMContentLoaded', () => {
    browseManager = new BrowseManager();
});