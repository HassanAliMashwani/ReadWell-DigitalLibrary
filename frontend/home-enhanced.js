// Enhanced Home Page with HCI Principles
class EnhancedHomeManager {
    constructor() {
        this.API_BASE = 'http://localhost:5000/api';
        this.init();
    }

    async init() {
        this.setupSkeletonLoading();
        await this.loadAllSections();
        this.setupEnhancedInteractions();
        this.setupKeyboardNavigation();
    }

    setupSkeletonLoading() {
        // Show skeleton loading for better perceived performance
        const sections = ['featured-books', 'recent-books', 'popular-books'];
        sections.forEach(sectionId => {
            const container = document.getElementById(sectionId);
            if (container) {
                container.innerHTML = this.getSkeletonHTML(4);
            }
        });
    }

    getSkeletonHTML(count) {
        return Array(count).fill(`
            <div class="book-card skeleton-loading">
                <div class="book-cover" style="height: 200px; background: #f0f0f0;"></div>
                <div class="book-info">
                    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
                    <div style="height: 16px; background: #f0f0f0; margin-bottom: 8px; border-radius: 4px; width: 60%;"></div>
                    <div style="height: 14px; background: #f0f0f0; border-radius: 4px; width: 40%;"></div>
                </div>
            </div>
        `).join('');
    }

    async loadAllSections() {
        try {
            await Promise.all([
                this.loadFeaturedBooks(),
                this.loadRecentBooks(),
                this.loadPopularBooks()
            ]);
        } catch (error) {
            this.showError('Failed to load content. Please refresh the page.', 'error');
        }
    }

    async loadFeaturedBooks() {
        const response = await fetch(`${this.API_BASE}/openlibrary/search?q=bestseller&limit=4`);
        const data = await response.json();
        this.renderBooksGrid(data.books, 'featured-books', true);
    }

    async loadRecentBooks() {
        const response = await fetch(`${this.API_BASE}/openlibrary/search?q=new+releases&limit=4`);
        const data = await response.json();
        this.renderBooksGrid(data.books, 'recent-books');
    }

    async loadPopularBooks() {
        try {
            // Get popular books from ratings API
            const response = await fetch(`${this.API_BASE}/ratings/popular/week`);
            const popularBooks = await response.json();
            
            if (popularBooks.length > 0) {
                // Fetch book details for popular books
                const booksWithDetails = await Promise.all(
                    popularBooks.slice(0, 8).map(async (book) => {
                        try {
                            // Try to get book details from Open Library
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
                        // Fallback to basic book info
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
                this.renderBooksGrid(booksWithDetails, 'popular-books');
            } else {
                // Fallback to Open Library popular if no ratings
                const response = await fetch(`${this.API_BASE}/openlibrary/popular`);
                const books = await response.json();
                this.renderBooksGrid(books, 'popular-books');
            }
        } catch (error) {
            console.error('Error loading popular books:', error);
            // Fallback to Open Library popular
            const response = await fetch(`${this.API_BASE}/openlibrary/popular`);
            const books = await response.json();
            this.renderBooksGrid(books, 'popular-books');
        }
    }

    renderBooksGrid(books, containerId, showDescription = false) {
        const container = document.getElementById(containerId);
        if (!container || !books) return;

        container.innerHTML = books.map(book => `
            <div class="book-card" tabindex="0" role="button" aria-label="${book.title} by ${book.author}">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title} Cover" 
                         onerror="this.src='https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover'"
                         loading="lazy">
                    <div class="book-overlay">
                        <button class="btn-icon" aria-label="Add to favorites" onclick="addToFavorites('${book.id}')">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn-icon" aria-label="Bookmark" onclick="addToBookmark('${book.id}')">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="btn-read" onclick="readBook('${book.id}', '${book.title}', '${book.author}')">
                            Read Now
                        </button>
                    </div>
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">${book.author}</p>
                    <div class="rating">
                        <div class="stars">
                            ${this.renderStars(book.averageRating || 0)}
                        </div>
                        <span class="rating-value">${book.averageRating ? book.averageRating.toFixed(1) : 'No ratings'}</span>
                        ${book.totalRatings ? `<span style="color: #7f8c8d; font-size: 0.9rem;">(${book.totalRatings})</span>` : ''}
                    </div>
                    ${showDescription && book.description ? `<p class="book-description">${book.description}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    setupEnhancedInteractions() {
        // Enhanced hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.book-card')) {
                e.target.closest('.book-card').classList.add('card-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.book-card')) {
                e.target.closest('.book-card').classList.remove('card-hover');
            }
        });

        // Click outside to close overlays
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.book-overlay') && !e.target.closest('.btn-icon')) {
                document.querySelectorAll('.book-overlay').forEach(overlay => {
                    overlay.style.opacity = '0';
                });
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Enter key to activate book cards
            if (e.key === 'Enter' && e.target.classList.contains('book-card')) {
                e.target.click();
            }
            
            // Escape key to close modals/overlays
            if (e.key === 'Escape') {
                document.querySelectorAll('.book-overlay').forEach(overlay => {
                    overlay.style.opacity = '0';
                });
            }
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

    showError(message, type = 'error') {
        // Use the same enhanced error notification from browse.js
        console.error(message);
    }
}

// Enhanced global functions with HCI improvements
function addToFavorites(bookId) {
    showToast('Added to favorites!', 'success');
    // HCI: Provide immediate feedback
}

function addToBookmark(bookId) {
    showToast('Book marked for later!', 'success');
}

function readBook(bookId, title, author) {
    showToast(`Opening ${title}...`, 'info');
    setTimeout(() => {
        const openLibraryUrl = `https://openlibrary.org${bookId}`;
        window.open(openLibraryUrl, '_blank');
    }, 500);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize enhanced home manager
let enhancedHomeManager;
document.addEventListener('DOMContentLoaded', () => {
    enhancedHomeManager = new EnhancedHomeManager();
});