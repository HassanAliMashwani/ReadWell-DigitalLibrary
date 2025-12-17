    // My Library Page Functionality
// API_BASE and authToken are declared in auth.js which is loaded first - use them
// Fallback if API_BASE is not available
if (typeof API_BASE === 'undefined') {
    window.API_BASE = 'http://localhost:5000/api';
}
const API_BASE = window.API_BASE || 'http://localhost:5000/api';

// Use authToken from auth.js if available (don't redeclare), otherwise get from localStorage
if (typeof authToken === 'undefined') {
    var authToken = localStorage.getItem('readwell_token');
}
let currentUser = null;
let currentTab = 'all';
let allLibraryBooks = [];

// Check authentication
async function initLibrary() {
    console.log('initLibrary called');
    
    // Get fresh token if needed
    if (!authToken) {
        authToken = localStorage.getItem('readwell_token');
    }
    
    if (!authToken) {
        console.log('No auth token found, redirecting to dashboard');
        window.location.href = 'dashboard.html';
        return;
    }

    try {
        console.log('Verifying auth token...');
        const response = await fetch(`${API_BASE}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            console.log('Auth verified, user:', currentUser.username);
            updateAuthUI();
            console.log('Loading library...');
            await loadLibrary();
        } else {
            console.error('Auth verification failed:', response.status);
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
    console.log('loadLibrary function called');
    
    // Get fresh token if needed
    if (!authToken) {
        authToken = localStorage.getItem('readwell_token');
    }
    
    const container = document.getElementById('libraryBooks');
    if (!container) {
        console.error('Container #libraryBooks not found!');
        return;
    }
    
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading your library...</p>
        </div>
    `;
    
    try {
        console.log('Loading library with token:', authToken ? 'Token exists' : 'No token');
        console.log('API_BASE:', API_BASE);
        console.log('Fetching from:', `${API_BASE}/library`);
        
        const response = await fetch(`${API_BASE}/library`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log('Library API response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Library data received:', data);
            console.log('Library data type:', Array.isArray(data) ? 'Array' : typeof data);
            console.log('Library data length:', Array.isArray(data) ? data.length : 'Not an array');
            
            allLibraryBooks = Array.isArray(data) ? data : [];
            console.log('All library books set to:', allLibraryBooks.length);
            console.log('Library books data:', allLibraryBooks);
            
            if (allLibraryBooks.length > 0) {
                console.log('First book:', allLibraryBooks[0]);
            }
            
            updateStats();
            console.log('Calling showLibraryTab with currentTab:', currentTab);
            showLibraryTab(currentTab);
        } else {
            const errorText = await response.text();
            console.error('Library API error:', response.status, errorText);
            let errorData = { message: 'Failed to load library' };
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText || 'Failed to load library' };
            }
            showError(errorData.message || 'Failed to load library');
            if (container) {
                container.innerHTML = `
                    <div class="empty-library">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error loading library</h3>
                        <p>${errorData.message || 'Please try again later'}</p>
                        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Status: ${response.status}</p>
                        <button class="btn btn-primary" onclick="loadLibrary()" style="margin-top: 1rem;">
                            <i class="fas fa-redo"></i> Retry
                        </button>
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
                    <p style="font-size: 0.8rem; margin-top: 0.5rem;">Error: ${error.message}</p>
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

// Make function globally accessible
window.showLibraryTab = function(tab) {
    console.log('showLibraryTab called with tab:', tab);
    console.log('allLibraryBooks length:', allLibraryBooks ? allLibraryBooks.length : 0);
    
    currentTab = tab;
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.library-tab');
    console.log('Found tab buttons:', tabButtons.length);
    
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.textContent.toLowerCase();
        if ((tab === 'all' && btnText.includes('all')) ||
            (tab === 'favorite' && (btnText.includes('like') || btnText.includes('favorite'))) ||
            (tab === 'bookmark' && btnText.includes('bookmark'))) {
            btn.classList.add('active');
            console.log('Activated tab button:', btnText);
        }
    });
    
    // Filter books by tab
    let filteredBooks = allLibraryBooks || [];
    console.log('Before filtering - allLibraryBooks:', allLibraryBooks);
    
    if (tab === 'favorite') {
        filteredBooks = allLibraryBooks.filter(b => b.type === 'favorite');
        console.log('Filtered for favorite:', filteredBooks);
    } else if (tab === 'bookmark') {
        filteredBooks = allLibraryBooks.filter(b => b.type === 'bookmark');
        console.log('Filtered for bookmark:', filteredBooks);
    }
    // For 'all', show all books (no filter)
    
    console.log('Showing tab:', tab, 'Books:', filteredBooks.length, 'Total:', allLibraryBooks.length);
    console.log('Filtered books:', filteredBooks);
    displayLibraryBooks(filteredBooks);
};

function displayLibraryBooks(books) {
    const container = document.getElementById('libraryBooks');
    
    if (!container) {
        console.error('Container #libraryBooks not found');
        return;
    }
    
    console.log('displayLibraryBooks called with:', books ? books.length : 0, 'books');
    console.log('Books data:', books);
    
    if (!books || !Array.isArray(books) || books.length === 0) {
        const tabName = currentTab === 'favorite' ? 'liked' : 
                       currentTab === 'bookmark' ? 'bookmarked' : 'books';
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
    
    try {
        const html = books.map(book => {
            const safeTitle = (book.bookTitle || 'Unknown Book').replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const safeBookId = (book.bookId || '').replace(/'/g, "\\'");
            const bookType = book.type || 'saved';
            
            console.log('Rendering book:', safeTitle, 'Type:', bookType);
            
            return `
                <div class="book-card" tabindex="0" style="display: flex; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 0.5rem; background: var(--bg-secondary);">
                    <h3 style="flex: 1; margin: 0; color: var(--text-primary); font-size: 1.1rem; cursor: pointer;" onclick="viewBookProgress('${safeBookId}', '${safeTitle}')">
                        ${book.bookTitle || 'Unknown Book'}
                    </h3>
                    ${bookType === 'favorite' ? `
                    <span class="badge" style="background: #e74c3c; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; margin-right: 0.5rem;">
                        <i class="fas fa-heart"></i> Like
                    </span>
                    ` : ''}
                    ${bookType === 'bookmark' ? `
                    <span class="badge" style="background: #3498db; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; margin-right: 0.5rem;">
                        <i class="fas fa-bookmark"></i> Bookmark
                    </span>
                    ` : ''}
                    <button class="btn btn-secondary btn-small" onclick="removeFromLibrary('${safeBookId}', '${bookType}')" style="margin-left: 0.5rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('Library books displayed successfully. Rendered', books.length, 'books');
    } catch (error) {
        console.error('Error rendering library books:', error);
        container.innerHTML = `
            <div class="empty-library">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error displaying books</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadLibrary()" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// Make function globally accessible
window.removeFromLibrary = async function(bookId, type) {
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
};

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

