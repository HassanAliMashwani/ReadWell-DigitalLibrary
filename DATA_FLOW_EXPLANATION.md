# Data Flow Explanation: My Library & Profile

## Understanding the Two Collections

### 1. **Library Collection** (for Like/Bookmark)
- **Collection Name**: `libraries`
- **Model**: `backend/models/Library.js`
- **Purpose**: Stores books that users have **liked** or **bookmarked**
- **Fields**:
  - `user`: User ID
  - `bookId`: Book ID (e.g., "/works/OL82565W")
  - `bookTitle`: Book title
  - `bookAuthor`: Author name
  - `bookCover`: Cover image URL
  - `type`: "favorite" (like) or "bookmark"
  - `addedAt`: When added

### 2. **Reading Progress Collection** (for Reading Progress)
- **Collection Name**: `readingprogresses` or `readingprogress`
- **Model**: `backend/models/ReadingProgress.js`
- **Purpose**: Stores reading progress and quotes
- **Fields**:
  - `user`: User ID
  - `bookId`: Book ID
  - `bookTitle`: Book title
  - `chapter`, `page`, `paragraph`, `lineNumber`: Progress details
  - `quotes`: Array of saved quotes
  - `lastReadAt`: Last reading time

---

## Why My Library is Empty

**My Library shows books from the `libraries` collection, NOT from reading progress.**

If My Library is empty, it means:
- You haven't **liked** or **bookmarked** any books yet
- The `libraries` collection is empty for your user

**To populate My Library:**
1. Go to Browse page or Home page
2. Click the **heart icon** (Like) or **bookmark icon** (Bookmark) on any book
3. The book will be saved to MongoDB `libraries` collection
4. It will appear in My Library

---

## Why Profile Shows No Progress

**Profile shows books from the `readingprogresses` collection.**

If Profile is empty but you have data in MongoDB:
1. **Check User ID Match**: 
   - Your token's user ID must match the `user` field in the database
   - Check: `req.user._id` (from token) vs `user` field in DB document

2. **Check Browser Console**:
   - Open F12 → Console tab
   - Look for: `Reading progress received: [...]`
   - Check if array is empty or has data

3. **Check Backend Console**:
   - Look for: `Found reading progress entries: X`
   - Should show number > 0 if data exists

---

## How Like/Bookmark Saves to MongoDB

### Flow:
1. **User clicks Like/Bookmark** → `toggleFavorite()` or `toggleBookmark()` in `browse.js`
2. **Frontend sends POST request** → `POST /api/library`
3. **Backend receives request** → `backend/routes/libraryRoutes.js`
4. **Backend saves to MongoDB** → `Library.findOneAndUpdate()` with `upsert: true`
5. **Data saved** → Document created in `libraries` collection with:
   - `type: 'favorite'` (for like)
   - `type: 'bookmark'` (for bookmark)

### Example MongoDB Document:
```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("693ebc5f9481489ce00493f8"),
  bookId: "/works/OL82565W",
  bookTitle: "Harry Potter and the Half-Blood Prince",
  bookAuthor: "J.K. Rowling",
  bookCover: "https://...",
  type: "favorite",  // or "bookmark"
  addedAt: ISODate("2025-12-17T16:52:42.082Z")
}
```

---

## Debugging Steps

### Step 1: Check if Like/Bookmark is Working

1. **Open Browser Console** (F12)
2. **Go to Browse page**
3. **Click Like or Bookmark on a book**
4. **Check Console for**:
   - `Added "Book Title" to favorites!` (success message)
   - Or any error messages

5. **Check Backend Console for**:
   - `Adding book to library: { bookId: "...", bookTitle: "...", type: "favorite" }`
   - `Library item saved: <id> <title>`

6. **Check MongoDB**:
   ```javascript
   // In MongoDB Compass or shell
   db.libraries.find({ user: ObjectId("693ebc5f9481489ce00493f8") })
   ```

### Step 2: Check Reading Progress

1. **Open Browser Console** (F12)
2. **Go to Profile page**
3. **Check Console for**:
   - `Loading books with progress, token: Token exists`
   - `Reading progress API response status: 200`
   - `Reading progress received: [...]`
   - `Progress list length: X` (should be > 0)

4. **Check Backend Console for**:
   - `Fetching reading progress for user: <user_id>`
   - `Found reading progress entries: X`
   - `Progress data: [...]` (JSON array)

5. **If data exists but not showing**:
   - Check if `booksWithProgress` container exists in HTML
   - Check for JavaScript errors in console
   - Verify user ID matches

---

## Quick Test Commands

### Test Library API (in browser console):
```javascript
fetch('http://localhost:5000/api/library', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('readwell_token')}`
    }
})
.then(r => r.json())
.then(data => {
    console.log('Library books:', data);
    console.log('Count:', data.length);
});
```

### Test Reading Progress API (in browser console):
```javascript
fetch('http://localhost:5000/api/reading-progress', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('readwell_token')}`
    }
})
.then(r => r.json())
.then(data => {
    console.log('Reading progress:', data);
    console.log('Count:', data.length);
});
```

### Check MongoDB Collections:
```javascript
// Library collection
db.libraries.find({ user: ObjectId("693ebc5f9481489ce00493f8") }).pretty()

// Reading Progress collection
db.readingprogresses.find({ user: ObjectId("693ebc5f9481489ce00493f8") }).pretty()
// or
db.readingprogress.find({ user: ObjectId("693ebc5f9481489ce00493f8") }).pretty()
```

---

## Common Issues & Solutions

### Issue: My Library always empty
**Cause**: No books have been liked/bookmarked
**Solution**: 
1. Go to Browse or Home page
2. Click heart (Like) or bookmark icon on books
3. Check backend console for "Library item saved" message
4. Refresh My Library page

### Issue: Profile shows no progress
**Cause**: User ID mismatch or data not being fetched
**Solution**:
1. Check browser console for API response
2. Verify user ID in token matches DB user ID
3. Check backend console for "Found reading progress entries"
4. Verify data exists in MongoDB with correct user ID

### Issue: Like/Bookmark not saving
**Cause**: API error or authentication issue
**Solution**:
1. Check browser console for errors
2. Check backend console for "Adding book to library" log
3. Verify authentication token is valid
4. Check MongoDB connection

---

## Summary

- **My Library** = Books from `libraries` collection (liked/bookmarked)
- **Profile** = Books from `readingprogresses` collection (with progress/quotes)
- **Like/Bookmark** = Saves to `libraries` collection automatically
- **Reading Progress** = Saves to `readingprogresses` collection automatically

Both collections are separate and serve different purposes!

