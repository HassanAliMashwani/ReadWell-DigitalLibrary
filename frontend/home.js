// home.js - Home Page Functionality
class HomeManager {
    constructor() {
        this.API_BASE = 'http://localhost:5000/api';
        this.init();
    }

    async init() {
        await this.loadFeaturedBooks();
        await this.loadRecentBooks();
        await this.loadPopularBooks();
    }

    // Load featured books for the main section
    async loadFeaturedBooks() {
        try {
            const response = await fetch(`${this.API_BASE}/books?limit=4`);
            const data = await response.json();
            this.renderFeaturedBooks(data.books);
        } catch (error) {
            console.error('Error loading featured books:', error);
            this.showFallbackBooks('featured-books');
        }
    }

    // Load recently added books
    async loadRecentBooks() {
        try {
            const response = await fetch(`${this.API_BASE}/books?sort=newest&limit=4`);
            const data = await response.json();
            this.renderBooksGrid(data.books, 'recent-books');
        } catch (error) {
            console.error('Error loading recent books:', error);
            this.showFallbackBooks('recent-books');
        }
    }

    // Load popular books (highest rated)
    async loadPopularBooks() {
        try {
            const response = await fetch(`${this.API_BASE}/books?sort=rating&limit=4`);
            const data = await response.json();
            this.renderBooksGrid(data.books, 'popular-books');
        } catch (error) {
            console.error('Error loading popular books:', error);
            this.showFallbackBooks('popular-books');
        }
    }

    // Render featured books in the hero section
    renderFeaturedBooks(books) {
        const featuredContainer = document.getElementById('featured-books');
        if (!featuredContainer) return;

        featuredContainer.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title} Cover" onerror="this.src='https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover'">
                    <div class="book-overlay">
                        <button class="btn-icon" onclick="addToFavorites('${book._id}')">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn-icon" onclick="addToBookmark('${book._id}')">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="btn-read" onclick="readBook('${book._id}')">
                            Read Now
                        </button>
                    </div>
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">${book.author}</p>
                    <div class="rating">
                        <div class="stars">
                            ${this.renderStars(book.rating)}
                        </div>
                        <span class="rating-value">${book.rating}</span>
                    </div>
                    <p class="book-description">${book.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Render books in grid sections (recent, popular)
    renderBooksGrid(books, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title} Cover" onerror="this.src='https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover'">
                    <div class="book-overlay">
                        <button class="btn-icon" onclick="addToFavorites('${book._id}')">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn-icon" onclick="addToBookmark('${book._id}')">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="btn-read" onclick="readBook('${book._id}')">
                            Read Now
                        </button>
                    </div>
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">${book.author}</p>
                    <div class="rating">
                        <div class="stars">
                            ${this.renderStars(book.rating)}
                        </div>
                        <span class="rating-value">${book.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
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

    showFallbackBooks(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p>Unable to load books. Please try again later.</p>';
        }
    }
}

// Global functions for button actions
function addToFavorites(bookId) {
    alert(`Added book ${bookId} to favorites!`);
}

function addToBookmark(bookId) {
    alert(`Bookmarked book ${bookId}!`);
}

function readBook(bookId) {
    alert(`Opening book ${bookId} for reading...`);
}

// Initialize when page loads
let homeManager;
document.addEventListener('DOMContentLoaded', () => {
    homeManager = new HomeManager();
});