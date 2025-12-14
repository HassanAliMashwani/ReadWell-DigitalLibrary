// My Library Page Functionality
const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('readwell_token');
let currentUser = null;
let currentTab = 'all';
let allLibraryBooks = [];

// Check authentication
async function initLibrary() {
    if (!authToken) {
        window.location.href = 'dashboard.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateAuthUI();
            await loadLibrary();
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'dashboard.html';
    }
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const profileLink = document.getElementById('profileLink');
    
    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            userMenu.style.alignItems = 'center';
        }
        if (userName) userName.textContent = currentUser.username;
        if (profileLink) profileLink.style.display = 'block';
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
    }
}

async function loadLibrary() {
    const container = document.getElementById('libraryBooks');
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading your library...</p>
            </div>
        `;
    }
    
    try {
        const response = await fetch(`${API_BASE}/library`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            allLibraryBooks = await response.json();
            updateStats();
            showLibraryTab(currentTab);
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Failed to load library' }));
            showError(errorData.message || 'Failed to load library');
            if (container) {
                container.innerHTML = `
                    <div class="empty-library">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error loading library</h3>
                        <p>${errorData.message || 'Please try again later'}</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading library:', error);
        showError('Failed to load library. Please check your connection.');
        if (container) {
            container.innerHTML = `
                <div class="empty-library">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Connection Error</h3>
                    <p>Unable to connect to server. Please check your internet connection.</p>
                    <button class="btn btn-primary" onclick="loadLibrary()" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }
}

function updateStats() {
    const total = allLibraryBooks.length;
    const favorites = allLibraryBooks.filter(b => b.type === 'favorite').length;
    const bookmarks = allLibraryBooks.filter(b => b.type === 'bookmark').length;
    
    document.getElementById('totalBooks').textContent = total;
    document.getElementById('favoritesCount').textContent = favorites;
    document.getElementById('bookmarksCount').textContent = bookmarks;
}

function showLibraryTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.library-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target?.classList.add('active');
    
    // Filter books by tab
    let filteredBooks = allLibraryBooks;
    if (tab === 'favorite') {
        filteredBooks = allLibraryBooks.filter(b => b.type === 'favorite');
    } else if (tab === 'bookmark') {
        filteredBooks = allLibraryBooks.filter(b => b.type === 'bookmark');
    }
    
    displayLibraryBooks(filteredBooks);
}

function displayLibraryBooks(books) {
    const container = document.getElementById('libraryBooks');
    
    if (books.length === 0) {
        const tabName = currentTab === 'favorite' ? 'favorites' : 
                       currentTab === 'bookmark' ? 'bookmarks' : 'books';
        container.innerHTML = `
            <div class="empty-library">
                <i class="fas fa-book"></i>
                <h3>No ${tabName} yet</h3>
                <p>Start browsing and save books to your library!</p>
                <a href="browse.html" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-compass"></i> Browse Books
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = books.map(book => `
        <div class="book-card" tabindex="0">
            <div class="book-cover">
                <img src="${book.bookCover || 'https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover'}" 
                     alt="${book.bookTitle} Cover" 
                     onerror="this.src='https://via.placeholder.com/200x300/3498db/ffffff?text=No+Cover'"
                     loading="lazy">
                <div class="book-overlay">
                    <button class="btn-read" onclick="readBook('${book.bookId}', '${book.bookTitle.replace(/'/g, "\\'")}', '${book.bookAuthor.replace(/'/g, "\\'")}')">
                        Read Now
                    </button>
                </div>
            </div>
            <div class="book-info">
                <h3>${book.bookTitle}</h3>
                <p class="author">${book.bookAuthor || 'Unknown Author'}</p>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-small" onclick="viewBookProgress('${book.bookId}', '${book.bookTitle.replace(/'/g, "\\'")}')">
                        <i class="fas fa-book-open"></i> Reading Progress
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="removeFromLibrary('${book.bookId}', '${book.type}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                    ${book.type === 'favorite' ? `
                    <span class="badge" style="background: #e74c3c; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem;">
                        <i class="fas fa-heart"></i> Favorite
                    </span>
                    ` : ''}
                    ${book.type === 'bookmark' ? `
                    <span class="badge" style="background: #3498db; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem;">
                        <i class="fas fa-bookmark"></i> Bookmarked
                    </span>
                    ` : ''}
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
                    Added: ${new Date(book.addedAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    `).join('');
}

async function removeFromLibrary(bookId, type) {
    if (!confirm('Are you sure you want to remove this book from your library?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/library/${bookId}?type=${type}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            showToast('Book removed from library', 'success');
            await loadLibrary();
        } else {
            showToast('Failed to remove book', 'error');
        }
    } catch (error) {
        console.error('Error removing book:', error);
        showToast('Failed to remove book', 'error');
    }
}

function viewBookProgress(bookId, bookTitle) {
    window.location.href = `browse.html?book=${bookId}&action=progress`;
}

function readBook(bookId, title, author) {
    showToast(`Opening "${title}"...`, 'info');
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
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showError(message) {
    showToast(message, 'error');
}

function logout() {
    localStorage.removeItem('readwell_token');
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Theme Manager
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
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('readwell_theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initLibrary();
    const themeManager = new ThemeManager();
});

