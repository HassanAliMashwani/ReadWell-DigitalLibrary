// Profile Page Functionality
const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('readwell_token');
let currentUser = null;

// Check authentication and load profile data
async function initProfile() {
    // Check auth
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
            updateProfileHeader();
            await loadProfileData();
        } else {
            localStorage.removeItem('readwell_token');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('readwell_token');
        window.location.href = 'dashboard.html';
    }
}

function updateProfileHeader() {
    if (currentUser) {
        const userName = document.getElementById('userName');
        const profileEmail = document.getElementById('profileEmail');
        if (userName) {
            userName.textContent = currentUser.username;
            // Force blue color for visibility
            userName.style.color = '#3498db';
            userName.style.fontWeight = '700';
        }
        if (profileEmail) profileEmail.textContent = currentUser.email;
        
        // Update header user menu
        const userMenu = document.getElementById('userMenu');
        const authButtons = document.getElementById('authButtons');
        if (userMenu) userMenu.style.display = 'flex';
        if (authButtons) authButtons.style.display = 'none';
    }
}

async function loadProfileData() {
    await Promise.all([
        loadReadingProgress(),
        loadQuotes(),
        loadStats()
    ]);
}

async function loadReadingProgress() {
    try {
        const response = await fetch(`${API_BASE}/reading-progress`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const progressList = await response.json();
            displayReadingProgress(progressList);
        } else {
            console.error('Failed to load reading progress:', response.statusText);
            displayReadingProgress([]);
        }
    } catch (error) {
        console.error('Error loading reading progress:', error);
        displayReadingProgress([]);
    }
}

function displayReadingProgress(progressList) {
    const container = document.getElementById('currentlyReading');
    
    if (!progressList || progressList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book"></i>
                <p>No books in progress</p>
                <a href="browse.html" class="btn btn-primary" style="margin-top: 1rem;">Browse Books</a>
            </div>
        `;
        return;
    }

    container.innerHTML = progressList.map(progress => `
        <div class="reading-book-item">
            <h3>${progress.bookTitle}</h3>
            <div class="progress-info">
                <div class="progress-info-item">
                    <i class="fas fa-book"></i>
                    <span>Chapter ${progress.chapter}</span>
                </div>
                <div class="progress-info-item">
                    <i class="fas fa-file-alt"></i>
                    <span>Page ${progress.page}</span>
                </div>
                <div class="progress-info-item">
                    <i class="fas fa-paragraph"></i>
                    <span>Paragraph ${progress.paragraph}</span>
                </div>
                <div class="progress-info-item">
                    <i class="fas fa-align-left"></i>
                    <span>Line ${progress.lineNumber}</span>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <button class="btn btn-primary btn-small" onclick="editProgress('${progress.bookId}', '${progress.bookTitle.replace(/'/g, "\\'")}')">
                    <i class="fas fa-edit"></i> Edit Progress
                </button>
                <button class="btn btn-secondary btn-small" onclick="viewQuotes('${progress.bookId}', '${progress.bookTitle.replace(/'/g, "\\'")}')">
                    <i class="fas fa-quote-left"></i> View Quotes
                </button>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
                Last read: ${progress.updatedAt ? new Date(progress.updatedAt).toLocaleDateString() : (progress.lastReadAt ? new Date(progress.lastReadAt).toLocaleDateString() : 'Recently')}
            </div>
        </div>
    `).join('');
}

async function loadQuotes() {
    try {
        const response = await fetch(`${API_BASE}/reading-progress`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const progressList = await response.json();
            const allQuotes = [];
            
            progressList.forEach(progress => {
                if (progress.quotes && progress.quotes.length > 0) {
                    progress.quotes.forEach(quote => {
                        allQuotes.push({
                            ...quote,
                            bookTitle: progress.bookTitle,
                            bookId: progress.bookId
                        });
                    });
                }
            });

            displayQuotes(allQuotes);
        }
    } catch (error) {
        console.error('Error loading quotes:', error);
    }
}

function displayQuotes(quotes) {
    const container = document.getElementById('savedQuotes');
    
    if (!quotes || quotes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-quote-left"></i>
                <p>No quotes saved yet</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Save quotes while reading books</p>
            </div>
        `;
        return;
    }

    // Sort by date (newest first)
    quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    container.innerHTML = quotes.map(quote => `
        <div class="quote-item">
            <div class="quote-text">"${quote.text}"</div>
            <div class="quote-meta">
                <div class="quote-book">
                    <i class="fas fa-book"></i> ${quote.bookTitle}
                    ${quote.chapter ? ` • Chapter ${quote.chapter}` : ''}
                    ${quote.page ? ` • Page ${quote.page}` : ''}
                </div>
                <div class="quote-actions">
                    <button class="btn btn-secondary btn-small" onclick="deleteQuote('${quote.bookId}', '${quote._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadStats() {
    try {
        const progressResponse = await fetch(`${API_BASE}/reading-progress`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        let booksReading = 0;
        let quotesSaved = 0;

        if (progressResponse.ok) {
            const progressList = await progressResponse.json();
            booksReading = progressList.length;
            
            progressList.forEach(progress => {
                if (progress.quotes) {
                    quotesSaved += progress.quotes.length;
                }
            });
        }

        // Get ratings count
        let booksRated = 0;
        try {
            const ratingsResponse = await fetch(`${API_BASE}/ratings/user`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (ratingsResponse.ok) {
                const ratings = await ratingsResponse.json();
                booksRated = ratings.length;
            }
        } catch (error) {
            console.error('Error loading ratings:', error);
        }

        document.getElementById('booksReading').textContent = booksReading;
        document.getElementById('quotesSaved').textContent = quotesSaved;
        document.getElementById('booksRated').textContent = booksRated;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function editProgress(bookId, bookTitle) {
    // Redirect to browse page and open progress modal
    window.location.href = `browse.html?book=${bookId}&action=progress`;
}

function viewQuotes(bookId, bookTitle) {
    // Show quotes modal
    window.location.href = `browse.html?book=${bookId}&action=quotes`;
}

async function deleteQuote(bookId, quoteId) {
    if (!confirm('Are you sure you want to delete this quote?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/reading-progress/${bookId}/quotes/${quoteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            showToast('Quote deleted!', 'success');
            loadQuotes();
            loadStats();
        } else {
            showToast('Failed to delete quote', 'error');
        }
    } catch (error) {
        console.error('Error deleting quote:', error);
        showToast('Failed to delete quote', 'error');
    }
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

function logout() {
    localStorage.removeItem('readwell_token');
    authToken = null;
    currentUser = null;
    showToast('Logged out successfully', 'info');
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initProfile();
    
    // Setup theme manager
    if (typeof ThemeManager !== 'undefined') {
        const themeManager = new ThemeManager();
    } else if (window.themeManager) {
        // Theme manager already initialized
    }
});

