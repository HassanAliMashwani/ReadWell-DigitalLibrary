# Debug Guide: My Library and Profile Data Loading

## How Data is Loaded

### My Library Page (`library.js`)

1. **Authentication Check** (`initLibrary`)
   - Checks for `readwell_token` in localStorage
   - Verifies token with `/api/auth/verify`
   - Redirects to dashboard if not authenticated

2. **Loading Library Data** (`loadLibrary`)
   - Makes GET request to: `http://localhost:5000/api/library`
   - Headers: `Authorization: Bearer <token>`
   - Backend route: `backend/routes/libraryRoutes.js` → `GET /`
   - Backend filters by: `{ user: req.user._id }`
   - Returns array of library items with:
     - `bookId` (e.g., "/works/OL5738154W")
     - `bookTitle`
     - `bookAuthor`
     - `bookCover`
     - `type` ("favorite" or "bookmark")
     - `addedAt`

3. **Displaying Books** (`displayLibraryBooks`)
   - Shows only book titles in a simple list
   - Filters by tab: "all", "favorite", or "bookmark"

### Profile Page (`profile.js`)

1. **Authentication Check** (`initProfile`)
   - Checks for `readwell_token` in localStorage
   - Verifies token with `/api/auth/verify`
   - Redirects to dashboard if not authenticated

2. **Loading Reading Progress** (`loadBooksWithProgress`)
   - Makes GET request to: `http://localhost:5000/api/reading-progress`
   - Headers: `Authorization: Bearer <token>`
   - Backend route: `backend/routes/readingProgressRoutes.js` → `GET /`
   - Backend filters by: `{ user: req.user._id }`
   - Returns array of progress items with:
     - `bookId` (e.g., "/works/OL5738154W")
     - `bookTitle`
     - `chapter`, `page`, `paragraph`, `lineNumber`
     - `quotes` (array)
     - `lastReadAt`, `updatedAt`

3. **Displaying Books** (`displayBooksWithProgress`)
   - Shows only book titles
   - Clicking title opens modal with full progress and quotes

## Debugging Steps

### Check Browser Console

1. **Open Browser Developer Tools** (F12)
2. **Go to Console Tab**
3. **Check for these logs:**

#### My Library:
- `Loading library with token: Token exists` or `No token`
- `Library API response status: 200` (should be 200)
- `Library data received: [...]` (should show array of books)
- `Library data length: X` (should be > 0 if you have books)
- `All library books set to: X`
- `Showing tab: all Books: X Total: X`

#### Profile:
- `Loading books with progress, token: Token exists` or `No token`
- `Reading progress API response status: 200` (should be 200)
- `Reading progress received: [...]` (should show array)
- `Progress list length: X` (should be > 0 if you have progress)
- `Displaying X books with progress`

### Check Backend Console

Look for these logs in your backend terminal:

#### Library:
- `Fetching library for user: <user_id>`
- `Filter type: all` (or favorite/bookmark)
- `Found library items: X`
- `Library items: [...]` (JSON array)

#### Reading Progress:
- `Fetching reading progress for user: <user_id>`
- `Found reading progress entries: X`
- `Progress data: [...]` (JSON array)

## Common Issues

### Issue 1: "No token" in console
**Solution:** 
- Make sure you're logged in
- Check localStorage: `localStorage.getItem('readwell_token')`
- If null, login again

### Issue 2: Status 401 (Unauthorized)
**Solution:**
- Token expired or invalid
- Login again to get new token
- Check backend JWT_SECRET matches

### Issue 3: Status 200 but empty array `[]`
**Solution:**
- Check user ID matches in database
- Verify data exists in MongoDB:
  ```javascript
  // In MongoDB shell or Compass
  db.libraries.find({ user: ObjectId("693ebc5f9481489ce00493f8") })
  db.readingprogresses.find({ user: ObjectId("693ebc5f9481489ce00493f8") })
  ```

### Issue 4: Data in DB but not showing
**Possible causes:**
1. **User ID mismatch**: Token user ID doesn't match DB user ID
2. **Wrong collection name**: Check MongoDB collection names
3. **Data format issue**: Check if data structure matches expected format

## Verify Data in MongoDB

### Check Library Collection:
```javascript
// In MongoDB Compass or shell
use readwell  // or your database name
db.libraries.find().pretty()
```

### Check Reading Progress Collection:
```javascript
db.readingprogresses.find().pretty()
// or
db.readingprogress.find().pretty()
```

### Check User ID:
```javascript
// Get your user ID from token or users collection
db.users.find().pretty()
```

## Quick Test

1. **Open Browser Console** (F12)
2. **Run this in console:**
```javascript
// Check token
console.log('Token:', localStorage.getItem('readwell_token'));

// Test Library API
fetch('http://localhost:5000/api/library', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('readwell_token')}`
    }
})
.then(r => r.json())
.then(data => console.log('Library:', data))
.catch(e => console.error('Error:', e));

// Test Reading Progress API
fetch('http://localhost:5000/api/reading-progress', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('readwell_token')}`
    }
})
.then(r => r.json())
.then(data => console.log('Progress:', data))
.catch(e => console.error('Error:', e));
```

This will show you exactly what data is being returned from the APIs.

