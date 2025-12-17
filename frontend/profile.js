// Profile Page Functionality
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
        loadBooksWithProgress(),
        loadStats()
    ]);
}

async function loadBooksWithProgress() {
    try {
        console.log('Loading books with progress, token:', authToken ? 'Token exists' : 'No token');
        const response = await fetch(`${API_BASE}/reading-progress`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log('Reading progress API response status:', response.status);

        if (response.ok) {
            const progressList = await response.json();
            console.log('Reading progress received:', progressList);
            console.log('Progress list type:', Array.isArray(progressList) ? 'Array' : typeof progressList);
            console.log('Progress list length:', Array.isArray(progressList) ? progressList.length : 'Not an array');
            
            // Ensure it's an array
            if (Array.isArray(progressList)) {
                console.log('Displaying', progressList.length, 'books with progress');
                displayBooksWithProgress(progressList);
            } else {
                console.error('Expected array but got:', typeof progressList, progressList);
                displayBooksWithProgress([]);
            }
        } else {
            const errorText = await response.text();
            console.error('Failed to load reading progress:', response.status, errorText);
            const container = document.getElementById('booksWithProgress');
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading reading progress</p>
                        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Status: ${response.status}</p>
                        <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">Reload Page</button>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading reading progress:', error);
        const container = document.getElementById('booksWithProgress');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading reading progress</p>
                    <p style="font-size: 0.8rem; margin-top: 0.5rem;">Error: ${error.message}</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">Reload Page</button>
                </div>
            `;
        }
    }
}

function displayBooksWithProgress(progressList) {
    const container = document.getElementById('booksWithProgress');
    
    if (!container) {
        console.error('Container element #booksWithProgress not found');
        return;
    }
    
    console.log('Displaying books with progress:', progressList);
    
    if (!progressList || !Array.isArray(progressList) || progressList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book"></i>
                <p>No reading progress saved yet</p>
                <a href="browse.html" class="btn btn-primary" style="margin-top: 1rem;">Browse Books</a>
            </div>
        `;
        return;
    }

    try {
        console.log('Rendering', progressList.length, 'books with progress');
        const html = progressList.map(progress => {
            // Escape special characters in bookTitle for onclick
            const escapedTitle = (progress.bookTitle || 'Unknown Book')
                .replace(/'/g, "\\'")
                .replace(/"/g, '&quot;')
                .replace(/\n/g, ' ')
                .replace(/\r/g, '');
            
            const bookId = (progress.bookId || '').replace(/'/g, "\\'");
            const quotesCount = progress.quotes && Array.isArray(progress.quotes) ? progress.quotes.length : 0;
            
            console.log('Rendering book:', progress.bookTitle, 'ID:', bookId, 'Quotes:', quotesCount);
            
            return `
                <div class="reading-book-item" style="cursor: pointer; padding: 1rem; margin-bottom: 0.5rem; border: 1px solid var(--border-color); border-radius: 8px; transition: background-color 0.2s; background: var(--bg-secondary);" 
                     onmouseover="this.style.backgroundColor='var(--bg-primary)'" 
                     onmouseout="this.style.backgroundColor='var(--bg-secondary)'"
                     onclick="viewBookProgressDetails('${bookId}', '${escapedTitle}')">
                    <h3 style="color: #3498db; margin: 0; font-size: 1.1rem;">
                        ${progress.bookTitle || 'Unknown Book'}
                        ${quotesCount > 0 ? `<span style="color: var(--text-secondary); font-size: 0.9rem; margin-left: 0.5rem;">(${quotesCount} quote${quotesCount > 1 ? 's' : ''})</span>` : ''}
                    </h3>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('Books with progress displayed successfully. HTML length:', html.length);
    } catch (error) {
        console.error('Error rendering books with progress:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading reading progress</p>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">Reload Page</button>
            </div>
        `;
    }
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
        console.log('Loading stats...');
        const progressResponse = await fetch(`${API_BASE}/reading-progress`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        let booksReading = 0;
        let quotesSaved = 0;

        if (progressResponse.ok) {
            const progressList = await progressResponse.json();
            console.log('Progress list for stats:', progressList);
            booksReading = Array.isArray(progressList) ? progressList.length : 0;
            
            if (Array.isArray(progressList)) {
                progressList.forEach(progress => {
                    if (progress.quotes && Array.isArray(progress.quotes)) {
                        quotesSaved += progress.quotes.length;
                    }
                });
            }
        } else {
            console.error('Failed to load progress for stats:', progressResponse.status);
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
                booksRated = Array.isArray(ratings) ? ratings.length : 0;
            }
        } catch (error) {
            console.error('Error loading ratings:', error);
        }

        console.log('Stats:', { booksReading, quotesSaved, booksRated });
        
        const booksReadingEl = document.getElementById('booksReading');
        const quotesSavedEl = document.getElementById('quotesSaved');
        const booksRatedEl = document.getElementById('booksRated');
        
        if (booksReadingEl) booksReadingEl.textContent = booksReading;
        if (quotesSavedEl) quotesSavedEl.textContent = quotesSaved;
        if (booksRatedEl) booksRatedEl.textContent = booksRated;
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

async function viewBookProgressDetails(bookId, bookTitle) {
    try {
        const response = await fetch(`${API_BASE}/reading-progress/${encodeURIComponent(bookId)}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const progress = await response.json();
            showProgressDetailsModal(progress, bookTitle);
        } else {
            showToast('Failed to load progress details', 'error');
        }
    } catch (error) {
        console.error('Error loading progress:', error);
        showToast('Failed to load progress details', 'error');
    }
}

function showProgressDetailsModal(progress, bookTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    const safeTitle = bookTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>${safeTitle}</h2>
            <div style="margin-top: 1.5rem;">
                <h3 style="margin-bottom: 1rem;"><i class="fas fa-book-open"></i> Reading Progress</h3>
                <div class="progress-info" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div class="progress-info-item">
                        <i class="fas fa-book"></i>
                        <span><strong>Chapter:</strong> ${progress.chapter !== null && progress.chapter !== undefined ? progress.chapter : 'N/A'}</span>
                    </div>
                    <div class="progress-info-item">
                        <i class="fas fa-file-alt"></i>
                        <span><strong>Page:</strong> ${progress.page !== null && progress.page !== undefined ? progress.page : 'N/A'}</span>
                    </div>
                    <div class="progress-info-item">
                        <i class="fas fa-paragraph"></i>
                        <span><strong>Paragraph:</strong> ${progress.paragraph !== null && progress.paragraph !== undefined ? progress.paragraph : 'N/A'}</span>
                    </div>
                    <div class="progress-info-item">
                        <i class="fas fa-align-left"></i>
                        <span><strong>Line:</strong> ${progress.lineNumber !== null && progress.lineNumber !== undefined ? progress.lineNumber : 'N/A'}</span>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        <strong>Last Updated:</strong> ${progress.lastReadAt ? new Date(progress.lastReadAt).toLocaleString() : (progress.updatedAt ? new Date(progress.updatedAt).toLocaleString() : 'Recently')}
                    </p>
                </div>
                ${progress.quotes && progress.quotes.length > 0 ? `
                    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 2px solid var(--border-color);">
                        <h3 style="margin-bottom: 1rem;"><i class="fas fa-quote-left"></i> Saved Quotes (${progress.quotes.length})</h3>
                        <div style="max-height: 400px; overflow-y: auto;">
                            ${progress.quotes.map((quote, idx) => `
                                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid #3498db;">
                                    <p style="font-style: italic; color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.05rem; line-height: 1.6;">"${quote.text}"</p>
                                    <p style="font-size: 0.85rem; color: var(--text-secondary);">
                                        ${quote.chapter ? `Chapter ${quote.chapter}` : ''}${quote.chapter && quote.page ? ', ' : ''}${quote.page ? `Page ${quote.page}` : ''}
                                    </p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : `
                    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 2px solid var(--border-color);">
                        <h3 style="margin-bottom: 1rem;"><i class="fas fa-quote-left"></i> Saved Quotes</h3>
                        <p style="color: var(--text-secondary);">No quotes saved for this book yet.</p>
                    </div>
                `}
                <div style="margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="editProgress('${progress.bookId}', '${safeTitle}')">
                        <i class="fas fa-edit"></i> Edit Progress
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
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

