// Browse Page Functionality - Enhanced with HCI Principles
class BrowseManager {
    constructor() {
        this.books = [];
        this.filteredBooks = [];
        this.currentPage = 1;
        this.booksPerPage = 20;
        this.currentView = 'grid';
        this.filters = {
            search: '',
            genre: 'all',
            language: 'all',
            sort: 'relevance' // Add sort filter
        };

        this.API_BASE = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        this.setupEnhancedStyles();
        this.setupSkeletonLoading();
        this.setupBookmarkSystem();
        this.setupThemeManager();
        this.loadPopularBooks();
        this.setupEventListeners();
        this.setupSearchSuggestions();
        this.setupKeyboardNavigation();
    }

    setupBookmarkSystem() {
        this.favorites = JSON.parse(localStorage.getItem('readwell_favorites')) || [];
        this.bookmarks = JSON.parse(localStorage.getItem('readwell_bookmarks')) || [];
    }

    isBookFavorited(bookId) {
        return this.favorites.includes(bookId);
    }

    isBookBookmarked(bookId) {
        return this.bookmarks.includes(bookId);
    }

    toggleFavorite(bookId, bookTitle) {
        const index = this.favorites.indexOf(bookId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast(`Removed "${bookTitle}" from favorites`, 'info');
        } else {
            this.favorites.push(bookId);
            this.showToast(`Added "${bookTitle}" to favorites!`, 'success');
        }
        
        localStorage.setItem('readwell_favorites', JSON.stringify(this.favorites));
        this.updateBookIcons(bookId);
    }

    toggleBookmark(bookId, bookTitle) {
        const index = this.bookmarks.indexOf(bookId);
        
        if (index > -1) {
            this.bookmarks.splice(index, 1);
            this.showToast(`Removed "${bookTitle}" from bookmarks`, 'info');
        } else {
            this.bookmarks.push(bookId);
            this.showToast(`Bookmarked "${bookTitle}"!`, 'success');
        }
        
        localStorage.setItem('readwell_bookmarks', JSON.stringify(this.bookmarks));
        this.updateBookIcons(bookId);
    }

    updateBookIcons(bookId) {
        // Update heart icon
        const heartIcons = document.querySelectorAll(`[onclick*="${bookId}"] .fa-heart`);
        heartIcons.forEach(icon => {
            if (this.isBookFavorited(bookId)) {
                icon.classList.add('fas');
                icon.classList.remove('far');
                icon.style.color = '#e74c3c';
            } else {
                icon.classList.add('far');
                icon.classList.remove('fas');
                icon.style.color = '';
            }
        });
        
        // Update bookmark icon
        const bookmarkIcons = document.querySelectorAll(`[onclick*="${bookId}"] .fa-bookmark`);
        bookmarkIcons.forEach(icon => {
            if (this.isBookBookmarked(bookId)) {
                icon.classList.add('fas');
                icon.classList.remove('far');
                icon.style.color = '#3498db';
            } else {
                icon.classList.add('far');
                icon.classList.remove('fas');
                icon.style.color = '';
            }
        });
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

    // Load popular books from Open Library
    async loadPopularBooks() {
        this.showLoading();
        this.showNotification('Loading popular books...', 'info');
        
        try {
            const response = await fetch(`${this.API_BASE}/openlibrary/popular`);
            const books = await response.json();
            
            this.books = books;
            this.filteredBooks = this.books;
            this.updateDisplay();
            this.hideLoading();
            this.showNotification(`Loaded ${books.length} popular books`, 'success', 2000);
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
            
            if (this.filters.genre && this.filters.genre !== 'all') {
                url = `${this.API_BASE}/openlibrary/category/${this.filters.genre}?page=${this.currentPage}&limit=${this.booksPerPage}`;
            } else if (this.filters.search) {
                url = `${this.API_BASE}/openlibrary/search?q=${encodeURIComponent(this.filters.search)}&page=${this.currentPage}&limit=${this.booksPerPage}`;
            } else {
                // Show popular books
                this.loadPopularBooks();
                return;
            }
            
            // Add sort parameter if applicable
            if (this.filters.sort && this.filters.sort !== 'relevance') {
                // Note: Open Library has limited sorting options
                // We'll handle client-side sorting for some options
                url += `&sort=${this.getOpenLibrarySort(this.filters.sort)}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            this.filteredBooks = this.applyClientSideSorting(data.books);
            this.updateResultsCount(data.total, data.page, data.totalPages);
            
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
        // View toggle with enhanced feedback
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.view-btn').dataset.view;
                this.setView(view);
                this.showToast(`Switched to ${view} view`, 'info');
            });
        });

        // Search filter with debouncing
        document.getElementById('searchFilter').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.currentPage = 1;
            this.debounce(() => this.searchBooks(), 500);
        });

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

        // Language filter
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.filters.language = e.target.value;
            // Note: Open Library API doesn't support language filtering in basic search
            this.showToast('Language filter applied (note: Open Library search may not support this)', 'info');
        });

        // Sort dropdown
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.currentPage = 1;
            this.showToast(`Sorted by: ${e.target.options[e.target.selectedIndex].text}`, 'info');
            this.searchBooks();
        });

        // Pagination with enhanced feedback
        document.getElementById('prevPage').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.nextPage();
        });

        // Filter toggle for mobile
        document.getElementById('filterToggle').addEventListener('click', () => {
            this.toggleFilters();
        });

        // Enhanced clear filters
        document.querySelector('.btn-clear').addEventListener('click', () => {
            this.showToast('All filters cleared', 'info');
        });
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

    setView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        const booksContainer = document.getElementById('booksContainer');
        booksContainer.className = `books-container ${view}-view`;
    }

    updateDisplay() {
        this.renderBooks();
        this.updatePagination();
    }

    renderBooks() {
        const booksContainer = document.getElementById('booksContainer');
        const booksToShow = this.filteredBooks;

        if (booksToShow.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        booksContainer.innerHTML = booksToShow.map(book => `
            <div class="book-card" tabindex="0" role="button" aria-label="${book.title} by ${book.author}" 
                 onkeypress="if(event.key==='Enter') readBook('${book.id}', '${book.title}', '${book.author}')">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title} Cover" 
                         onerror="this.src='https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover'"
                         loading="lazy">
                    <div class="book-overlay">
                        <button class="btn-icon" aria-label="${this.isBookFavorited(book.id) ? 'Remove from favorites' : 'Add to favorites'}" 
                                onclick="browseManager.toggleFavorite('${book.id}', '${book.title}')">
                            <i class="${this.isBookFavorited(book.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="btn-icon" aria-label="${this.isBookBookmarked(book.id) ? 'Remove bookmark' : 'Bookmark this book'}" 
                                onclick="browseManager.toggleBookmark('${book.id}', '${book.title}')">
                            <i class="${this.isBookBookmarked(book.id) ? 'fas' : 'far'} fa-bookmark"></i>
                        </button>
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
                        <div class="stars">
                            ${this.renderStars(4.0)}
                        </div>
                        <span class="rating-value">4.0</span>
                    </div>
                    <p class="book-year">${book.year}</p>
                    <p class="book-description">${book.description}</p>
                </div>
            </div>
        `).join('');
        
        // Apply initial icon states
        booksToShow.forEach(book => {
            this.updateBookIcons(book.id);
        });
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
        const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        prevBtn.classList.toggle('disabled', this.currentPage === 1);
        nextBtn.classList.toggle('disabled', this.currentPage === totalPages || totalPages === 0);

        let paginationHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="browseManager.goToPage(${i})"
                        aria-label="Go to page ${i}">
                    ${i}
                </button>
            `;
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
        this.currentPage = page;
        this.searchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showToast(`Navigated to page ${page}`, 'info');
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    nextPage() {
        this.currentPage++;
        this.searchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        this.currentTheme = localStorage.getItem('theme') || 'light';
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
        localStorage.setItem('theme', theme);
        
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
    document.getElementById('languageSelect').value = 'all';
    document.getElementById('sortSelect').value = 'relevance';
    
    browseManager.filters = {
        search: '',
        genre: 'all',
        language: 'all',
        sort: 'relevance'
    };
    
    browseManager.currentPage = 1;
    browseManager.showToast('All filters cleared', 'success');
    browseManager.loadPopularBooks();
}

function addToFavorites(bookId, bookTitle = 'book') {
    browseManager.toggleFavorite(bookId, bookTitle);
}

function addToBookmark(bookId, bookTitle = 'book') {
    browseManager.toggleBookmark(bookId, bookTitle);
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