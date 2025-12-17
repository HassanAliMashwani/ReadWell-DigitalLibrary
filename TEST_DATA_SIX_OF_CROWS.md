# Test Data: Six of Crows - Reading Progress

## Book Information

**Title:** Six of Crows  
**Author:** Leigh Bardugo  
**Open Library ID:** `/works/OL16811150W` or `/works/OL20170215W`  
**ISBN:** 978-1-62779-212-7

---

## Test Reading Progress Data

### Sample 1: Early in the Book
```json
{
  "bookId": "/works/OL16811150W",
  "bookTitle": "Six of Crows",
  "chapter": 1,
  "page": 15,
  "paragraph": 3,
  "lineNumber": 12,
  "quotes": [
    {
      "text": "No mourners. No funerals. Among them, it passed for 'good luck.'",
      "chapter": 1,
      "page": 15
    }
  ]
}
```

### Sample 2: Mid-Book Progress
```json
{
  "bookId": "/works/OL16811150W",
  "bookTitle": "Six of Crows",
  "chapter": 8,
  "page": 142,
  "paragraph": 7,
  "lineNumber": 5,
  "quotes": [
    {
      "text": "The heart is an arrow. It demands aim to land true.",
      "chapter": 8,
      "page": 142
    },
    {
      "text": "I will have you without armor, Kaz Brekker. Or I will not have you at all.",
      "chapter": 8,
      "page": 145
    }
  ]
}
```

### Sample 3: Later in the Book
```json
{
  "bookId": "/works/OL16811150W",
  "bookTitle": "Six of Crows",
  "chapter": 15,
  "page": 287,
  "paragraph": 2,
  "lineNumber": 8,
  "quotes": [
    {
      "text": "When everyone knows you're a monster, you needn't waste time doing every monstrous thing.",
      "chapter": 15,
      "page": 287
    },
    {
      "text": "We are all someone's monster.",
      "chapter": 15,
      "page": 289
    }
  ]
}
```

---

## Famous Quotes from Six of Crows

Use these quotes for testing:

1. **"No mourners. No funerals."** (Chapter 1, Page 15)
2. **"The heart is an arrow. It demands aim to land true."** (Chapter 8, Page 142)
3. **"I will have you without armor, Kaz Brekker. Or I will not have you at all."** (Chapter 8, Page 145)
4. **"When everyone knows you're a monster, you needn't waste time doing every monstrous thing."** (Chapter 15, Page 287)
5. **"We are all someone's monster."** (Chapter 15, Page 289)
6. **"Greed may do your bidding, but death serves no man."** (Chapter 20, Page 350)
7. **"The easiest way to steal a man's wallet is to tell him you're going to steal his watch."** (Chapter 5, Page 89)
8. **"I'm a business man. No more, no less."** (Chapter 3, Page 45)

---

## How to Test Reading Progress

### Step 1: Find the Book
1. Go to Browse page: `http://localhost:8000/browse.html`
2. Search for "Six of Crows"
3. Click on the book

### Step 2: Save Reading Progress
1. Click "Reading Progress" button (or icon)
2. Fill in the form:
   - **Chapter:** 1
   - **Page:** 15
   - **Paragraph:** 3
   - **Line Number:** 12
3. Click "Save Progress"

### Step 3: Add Quotes
1. In the same modal, scroll to "Quotes" section
2. Click "Add Quote"
3. Enter quote text: `"No mourners. No funerals. Among them, it passed for 'good luck.'"`
4. Enter Chapter: `1`
5. Enter Page: `15`
6. Click "Add Quote"

### Step 4: Update Progress
1. Read more (or simulate)
2. Open Reading Progress modal again
3. Update:
   - **Chapter:** 8
   - **Page:** 142
   - **Paragraph:** 7
   - **Line Number:** 5
4. Add more quotes as you "read"
5. Click "Save Progress"

### Step 5: Verify in Profile
1. Go to Profile page: `http://localhost:8000/profile.html`
2. You should see "Six of Crows" in the "Books with Reading Progress" section
3. Click on the book title
4. Modal should show:
   - Latest reading progress (Chapter 8, Page 142, etc.)
   - All saved quotes

---

## Testing Checklist

- [ ] Save initial reading progress (Chapter 1, Page 15)
- [ ] Add first quote
- [ ] Update progress to Chapter 8, Page 142
- [ ] Add second quote
- [ ] Update progress to Chapter 15, Page 287
- [ ] Add third quote
- [ ] Verify progress shows in Profile page
- [ ] Click book title in Profile to see details
- [ ] Verify all quotes are displayed
- [ ] Test editing progress
- [ ] Test deleting a quote
- [ ] Test updating a quote

---

## API Test (Using Browser Console)

### Save Reading Progress:
```javascript
const token = localStorage.getItem('readwell_token');

fetch('http://localhost:5000/api/reading-progress', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        bookId: '/works/OL16811150W',
        bookTitle: 'Six of Crows',
        chapter: 1,
        page: 15,
        paragraph: 3,
        lineNumber: 12
    })
})
.then(r => r.json())
.then(data => console.log('Progress saved:', data));
```

### Add Quote:
```javascript
const token = localStorage.getItem('readwell_token');

fetch('http://localhost:5000/api/reading-progress/%2Fworks%2FOL16811150W/quotes', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        text: 'No mourners. No funerals. Among them, it passed for \'good luck.\'',
        chapter: 1,
        page: 15
    })
})
.then(r => r.json())
.then(data => console.log('Quote added:', data));
```

### Get Reading Progress:
```javascript
const token = localStorage.getItem('readwell_token');

fetch('http://localhost:5000/api/reading-progress/%2Fworks%2FOL16811150W', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(r => r.json())
.then(data => console.log('Reading progress:', data));
```

---

## Expected MongoDB Document

After testing, you should see a document like this in `readingprogresses` collection:

```json
{
  "_id": ObjectId("..."),
  "user": ObjectId("693ebc5f9481489ce00493f8"),
  "bookId": "/works/OL16811150W",
  "bookTitle": "Six of Crows",
  "chapter": 15,
  "page": 287,
  "paragraph": 2,
  "lineNumber": 8,
  "quotes": [
    {
      "_id": ObjectId("..."),
      "text": "No mourners. No funerals. Among them, it passed for 'good luck.'",
      "chapter": 1,
      "page": 15,
      "createdAt": ISODate("...")
    },
    {
      "_id": ObjectId("..."),
      "text": "The heart is an arrow. It demands aim to land true.",
      "chapter": 8,
      "page": 142,
      "createdAt": ISODate("...")
    },
    {
      "_id": ObjectId("..."),
      "text": "When everyone knows you're a monster, you needn't waste time doing every monstrous thing.",
      "chapter": 15,
      "page": 287,
      "createdAt": ISODate("...")
    }
  ],
  "lastReadAt": ISODate("2025-12-17T..."),
  "createdAt": ISODate("2025-12-17T..."),
  "updatedAt": ISODate("2025-12-17T...")
}
```

---

## Notes

- **Book ID:** Use `/works/OL16811150W` or search for the actual ID in Open Library
- **Optional Fields:** Chapter, page, paragraph, and lineNumber are all optional
- **Quotes:** Can be added independently of progress updates
- **Multiple Quotes:** You can add multiple quotes for the same book
- **Progress Updates:** Each save updates the latest progress

---

**Happy Testing! 📚**

