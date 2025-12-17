# MongoDB Collection Names Guide

## Collection Names in Your Database

Mongoose automatically pluralizes model names. Here's what you should see in MongoDB Compass:

### Expected Collections:

1. **`libraries`** (not "Library")
   - Model: `Library.js`
   - Stores: Liked and bookmarked books
   - Fields: `user`, `bookId`, `bookTitle`, `bookAuthor`, `bookCover`, `type`, `addedAt`

2. **`readingprogresses`** (or `readingprogress`)
   - Model: `ReadingProgress.js`
   - Stores: Reading progress and quotes
   - Fields: `user`, `bookId`, `bookTitle`, `chapter`, `page`, `paragraph`, `lineNumber`, `quotes`, `lastReadAt`

3. **`users`**
   - Model: `User.js`
   - Stores: User accounts
   - Fields: `username`, `email`, `password`

4. **`ratings`**
   - Model: `Rating.js`
   - Stores: Book ratings
   - Fields: `user`, `bookId`, `bookTitle`, `rating`

5. **`books`** (if exists)
   - Model: `Book.js` (if exists)
   - Stores: Local book data

---

## How to Check Collections in MongoDB Compass

1. **Open MongoDB Compass**
2. **Connect to your database** (usually `mongodb://localhost:27017`)
3. **Select database**: `readwell` (or your database name)
4. **Look for collection**: `libraries` (lowercase, plural)

---

## If `libraries` Collection Doesn't Exist

The collection will be **automatically created** when you:
1. Like a book (saves with `type: 'favorite'`)
2. Bookmark a book (saves with `type: 'bookmark'`)

**To test:**
1. Go to Browse page
2. Click heart icon (Like) on any book
3. Check backend console for: `Library item saved: ...`
4. Refresh MongoDB Compass
5. Collection `libraries` should appear

---

## Verify Collection Exists

### In MongoDB Compass:
- Look for `libraries` in the left sidebar
- Click on it to view documents
- Should see documents with your user ID

### In MongoDB Shell:
```javascript
use readwell
show collections
// Should show: libraries, readingprogresses, users, ratings

db.libraries.find().pretty()
// Should show your liked/bookmarked books
```

---

## Collection Name Rules

- Model name: `Library` (singular, PascalCase)
- Collection name: `libraries` (plural, lowercase)
- Mongoose automatically converts: `Library` → `libraries`

---

## Troubleshooting

### Collection not showing:
1. **Refresh MongoDB Compass** (click refresh button)
2. **Check database name** - make sure you're in `readwell` database
3. **Like/bookmark a book** - this will create the collection
4. **Check backend console** for errors when saving

### Data not appearing:
1. **Check user ID** - documents must have matching user ID
2. **Check collection name** - should be `libraries` (lowercase, plural)
3. **Verify data exists**: `db.libraries.find({ user: ObjectId("your-user-id") })`

