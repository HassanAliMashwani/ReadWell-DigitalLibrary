cd# Test Library API - Debug Guide

## Your Token Info
- **Token User ID:** `693ebc5f9481489ce00493f8` ✅
- **Database User ID:** `693ebc5f9481489ce00493f8` ✅
- **Match:** ✅ YES
- **Token Expired:** ❌ NO

## Test API Directly

### In Browser Console (F12):

```javascript
// Test Library API
const token = localStorage.getItem('readwell_token');
fetch('http://localhost:5000/api/library', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(r => {
    console.log('Response status:', r.status);
    console.log('Response ok:', r.ok);
    return r.json();
})
.then(data => {
    console.log('Library data:', data);
    console.log('Data type:', Array.isArray(data) ? 'Array' : typeof data);
    console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
    if (Array.isArray(data) && data.length > 0) {
        console.log('First book:', data[0]);
        console.log('Book type:', data[0].type);
    }
})
.catch(e => console.error('Error:', e));
```

## Expected Output

If working correctly, you should see:
```javascript
Response status: 200
Response ok: true
Library data: [{...}]
Data type: Array
Data length: 1
First book: {
  _id: "...",
  bookId: "/works/OL2056818W",
  bookTitle: "Maus I",
  type: "favorite",
  user: "693ebc5f9481489ce00493f8",
  ...
}
Book type: "favorite"
```

## Check Browser Console Logs

When you open the Library page, you should see these logs in order:

1. `Library initialized for user: <username> ID: <user_id>`
2. `Loading library with token: Token exists`
3. `Library API response status: 200`
4. `Library data received: [...]`
5. `Library data type: Array`
6. `Library data length: 1`
7. `All library books set to: 1`
8. `First book: {...}`
9. `Calling showLibraryTab with currentTab: all`
10. `showLibraryTab called with tab: all`
11. `allLibraryBooks length: 1`
12. `Found tab buttons: 3`
13. `Before filtering - allLibraryBooks: [...]`
14. `Showing tab: all Books: 1 Total: 1`
15. `Filtered books: [...]`
16. `displayLibraryBooks called with: 1 books`
17. `Books data: [...]`
18. `Rendering book: Maus I Type: favorite`
19. `Library books displayed successfully. Rendered 1 books`

## If You See "Loading..." Forever

Check:
1. **Is API_BASE defined?** - Check console for errors about `API_BASE`
2. **Is the API call completing?** - Look for "Library API response status" log
3. **Is the data being received?** - Look for "Library data received" log
4. **Is displayLibraryBooks being called?** - Look for "displayLibraryBooks called" log
5. **Is the container found?** - Look for "Container #libraryBooks not found" error

## Common Issues

### Issue 1: API_BASE is undefined
**Solution:** Make sure `auth.js` is loaded before `library.js` in HTML

### Issue 2: API returns empty array
**Check:** Backend console should show:
- `Fetching library for user: 693ebc5f9481489ce00493f8`
- `Found library items: 1` (or 0 if empty)

### Issue 3: Container not found
**Check:** HTML should have `<div id="libraryBooks">` element

### Issue 4: Data not displaying
**Check:** Look for errors in `displayLibraryBooks` function

