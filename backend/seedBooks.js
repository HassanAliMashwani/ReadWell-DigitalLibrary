const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

const sampleBooks = [
  // Fiction & Classics
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://covers.openlibrary.org/b/id/8259447-L.jpg",
    rating: 4.5,
    year: 1925,
    genre: "fiction",
    language: "english",
    description: "A classic novel of the Jazz Age, exploring themes of idealism, resistance to change, and excess."
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://covers.openlibrary.org/b/id/13018254-L.jpg",
    rating: 5.0,
    year: 1960,
    genre: "fiction",
    language: "english",
    description: "A gripping tale of racial injustice and childhood innocence in the American South."
  },
  {
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/id/8264454-L.jpg",
    rating: 4.8,
    year: 1949,
    genre: "fiction",
    language: "english",
    description: "A dystopian social science fiction novel about totalitarian control."
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://covers.openlibrary.org/b/id/8222294-L.jpg",
    rating: 4.6,
    year: 1813,
    genre: "fiction",
    language: "english",
    description: "A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet."
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://covers.openlibrary.org/b/id/8260719-L.jpg",
    rating: 4.7,
    year: 1951,
    genre: "fiction",
    language: "english",
    description: "A controversial novel about teenage rebellion and alienation."
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    cover: "https://covers.openlibrary.org/b/id/8260720-L.jpg",
    rating: 4.2,
    year: 1954,
    genre: "fiction",
    language: "english",
    description: "A novel about a group of British boys stranded on an uninhabited island."
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    cover: "https://covers.openlibrary.org/b/id/8260723-L.jpg",
    rating: 4.6,
    year: 2003,
    genre: "fiction",
    language: "english",
    description: "A powerful story of friendship, betrayal, and redemption in Afghanistan."
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    cover: "https://covers.openlibrary.org/b/id/8260734-L.jpg",
    rating: 4.7,
    year: 2018,
    genre: "fiction",
    language: "english",
    description: "A novel about an abandoned girl who raises herself in the marshes of North Carolina."
  },

  // Science Fiction
  {
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://covers.openlibrary.org/b/id/8260729-L.jpg",
    rating: 4.8,
    year: 1965,
    genre: "scifi",
    language: "english",
    description: "A science fiction novel set in the distant future amidst a feudal interstellar society."
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    cover: "https://covers.openlibrary.org/b/id/8260718-L.jpg",
    rating: 4.4,
    year: 1932,
    genre: "scifi",
    language: "english",
    description: "A dystopian novel about a futuristic society controlled by technology."
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    cover: "https://covers.openlibrary.org/b/id/8260724-L.jpg",
    rating: 4.5,
    year: 2008,
    genre: "scifi",
    language: "english",
    description: "A dystopian novel about a televised death match in a post-apocalyptic nation."
  },
  {
    title: "Foundation",
    author: "Isaac Asimov",
    cover: "https://covers.openlibrary.org/b/id/8257276-L.jpg",
    rating: 4.6,
    year: 1951,
    genre: "scifi",
    language: "english",
    description: "The first novel in Isaac Asimov's classic science-fiction masterpiece, the Foundation series."
  },
  {
    title: "Neuromancer",
    author: "William Gibson",
    cover: "https://covers.openlibrary.org/b/id/8232699-L.jpg",
    rating: 4.3,
    year: 1984,
    genre: "scifi",
    language: "english",
    description: "A novel that popularized the cyberpunk genre and was the first winner of the science-fiction triple crown."
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    cover: "https://covers.openlibrary.org/b/id/8259448-L.jpg",
    rating: 4.7,
    year: 2011,
    genre: "scifi",
    language: "english",
    description: "An astronaut becomes stranded on Mars and must survive using his ingenuity and scientific knowledge."
  },

  // Fantasy
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://covers.openlibrary.org/b/id/8260717-L.jpg",
    rating: 4.9,
    year: 1937,
    genre: "fantasy",
    language: "english",
    description: "A fantasy novel about the adventures of hobbit Bilbo Baggins."
  },
  {
    title: "The Night Circus",
    author: "Erin Morgenstern",
    cover: "https://covers.openlibrary.org/b/id/8260732-L.jpg",
    rating: 4.3,
    year: 2011,
    genre: "fantasy",
    language: "english",
    description: "A fantasy novel about a magical competition between two illusionists."
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    cover: "https://covers.openlibrary.org/b/id/8259449-L.jpg",
    rating: 4.8,
    year: 1997,
    genre: "fantasy",
    language: "english",
    description: "The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage."
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    cover: "https://covers.openlibrary.org/b/id/8259450-L.jpg",
    rating: 4.6,
    year: 2007,
    genre: "fantasy",
    language: "english",
    description: "A fantasy novel written by American author Patrick Rothfuss. It is the first book in the ongoing fantasy trilogy The Kingkiller Chronicle."
  },
  {
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    cover: "https://covers.openlibrary.org/b/id/8259451-L.jpg",
    rating: 4.5,
    year: 1996,
    genre: "fantasy",
    language: "english",
    description: "The first novel in A Song of Ice and Fire, a series of fantasy novels by American author George R. R. Martin."
  },

  // Mystery & Thriller
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    cover: "https://covers.openlibrary.org/b/id/8260722-L.jpg",
    rating: 4.3,
    year: 2003,
    genre: "mystery",
    language: "english",
    description: "A mystery thriller novel about a conspiracy within the Catholic Church."
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    cover: "https://covers.openlibrary.org/b/id/8260726-L.jpg",
    rating: 4.2,
    year: 2012,
    genre: "thriller",
    language: "english",
    description: "A psychological thriller about a marriage gone terribly wrong."
  },
  {
    title: "The Girl on the Train",
    author: "Paula Hawkins",
    cover: "https://covers.openlibrary.org/b/id/8260730-L.jpg",
    rating: 4.1,
    year: 2015,
    genre: "thriller",
    language: "english",
    description: "A psychological thriller about a woman who becomes entangled in a missing persons investigation."
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover: "https://covers.openlibrary.org/b/id/8260733-L.jpg",
    rating: 4.5,
    year: 2019,
    genre: "mystery",
    language: "english",
    description: "A psychological thriller about a woman who shoots her husband and then stops speaking."
  },
  {
    title: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    cover: "https://covers.openlibrary.org/b/id/8259452-L.jpg",
    rating: 4.4,
    year: 1902,
    genre: "mystery",
    language: "english",
    description: "The third of the four crime novels by British writer Arthur Conan Doyle featuring the detective Sherlock Holmes."
  },

  // Romance
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    cover: "https://covers.openlibrary.org/b/id/8260735-L.jpg",
    rating: 4.6,
    year: 2017,
    genre: "romance",
    language: "english",
    description: "A novel about a reclusive Hollywood icon and her seven marriages."
  },
  {
    title: "Outlander",
    author: "Diana Gabaldon",
    cover: "https://covers.openlibrary.org/b/id/8259453-L.jpg",
    rating: 4.4,
    year: 1991,
    genre: "romance",
    language: "english",
    description: "A historical romance with elements of fantasy and adventure."
  },
  {
    title: "The Notebook",
    author: "Nicholas Sparks",
    cover: "https://covers.openlibrary.org/b/id/8259454-L.jpg",
    rating: 4.3,
    year: 1996,
    genre: "romance",
    language: "english",
    description: "A contemporary romance novel set in the 1940s in North Carolina."
  },
  {
    title: "Bridgerton: The Duke and I",
    author: "Julia Quinn",
    cover: "https://covers.openlibrary.org/b/id/8259455-L.jpg",
    rating: 4.2,
    year: 2000,
    genre: "romance",
    language: "english",
    description: "The first novel in Julia Quinn's best-selling series of Regency romance novels."
  },

  // Biography
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    cover: "https://covers.openlibrary.org/b/id/8260727-L.jpg",
    rating: 4.4,
    year: 2011,
    genre: "biography",
    language: "english",
    description: "The exclusive biography of Apple co-founder Steve Jobs."
  },
  {
    title: "Educated",
    author: "Tara Westover",
    cover: "https://covers.openlibrary.org/b/id/8260731-L.jpg",
    rating: 4.7,
    year: 2018,
    genre: "biography",
    language: "english",
    description: "A memoir about a young woman who grows up in a survivalist family and eventually goes to college."
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    cover: "https://covers.openlibrary.org/b/id/8259456-L.jpg",
    rating: 4.8,
    year: 2018,
    genre: "biography",
    language: "english",
    description: "A memoir by former First Lady of the United States Michelle Obama, published in 2018."
  },
  {
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    cover: "https://covers.openlibrary.org/b/id/8259457-L.jpg",
    rating: 4.5,
    year: 1947,
    genre: "biography",
    language: "english",
    description: "A book of the writings from the Dutch-language diary kept by Anne Frank while she was in hiding for two years with her family during the Nazi occupation of the Netherlands."
  },

  // History
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: "https://covers.openlibrary.org/b/id/8260728-L.jpg",
    rating: 4.6,
    year: 2011,
    genre: "history",
    language: "english",
    description: "A brief history of humankind from the Stone Age to the present."
  },
  {
    title: "A People's History of the United States",
    author: "Howard Zinn",
    cover: "https://covers.openlibrary.org/b/id/8259458-L.jpg",
    rating: 4.4,
    year: 1980,
    genre: "history",
    language: "english",
    description: "A history of the United States from the perspective of historically marginalized peoples."
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    cover: "https://covers.openlibrary.org/b/id/8259459-L.jpg",
    rating: 4.3,
    year: 1997,
    genre: "history",
    language: "english",
    description: "A book that attempts to explain why Eurasian civilizations have survived and conquered others."
  },

  // More Fiction
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    cover: "https://covers.openlibrary.org/b/id/8260721-L.jpg",
    rating: 4.5,
    year: 1988,
    genre: "fiction",
    language: "portuguese",
    description: "A philosophical book about a shepherd's journey to find treasure."
  },
  {
    title: "Life of Pi",
    author: "Yann Martel",
    cover: "https://covers.openlibrary.org/b/id/8259460-L.jpg",
    rating: 4.4,
    year: 2001,
    genre: "fiction",
    language: "english",
    description: "A fantasy adventure novel about an Indian boy named Pi who survives a shipwreck and is adrift in the Pacific Ocean."
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    cover: "https://covers.openlibrary.org/b/id/8259461-L.jpg",
    rating: 4.7,
    year: 2005,
    genre: "fiction",
    language: "english",
    description: "A historical novel set in Nazi Germany, narrated by Death."
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    cover: "https://covers.openlibrary.org/b/id/8259462-L.jpg",
    rating: 4.3,
    year: 2006,
    genre: "fiction",
    language: "english",
    description: "A post-apocalyptic novel about a father and son's journey through a devastated America."
  },
  {
    title: "Cloud Atlas",
    author: "David Mitchell",
    cover: "https://covers.openlibrary.org/b/id/8259463-L.jpg",
    rating: 4.2,
    year: 2004,
    genre: "fiction",
    language: "english",
    description: "A novel that combines six different stories set in different times and places."
  },

  // More Science Fiction
  {
    title: "Ender's Game",
    author: "Orson Scott Card",
    cover: "https://covers.openlibrary.org/b/id/8259464-L.jpg",
    rating: 4.5,
    year: 1985,
    genre: "scifi",
    language: "english",
    description: "A military science fiction novel about child soldiers in a futuristic Earth."
  },
  {
    title: "Snow Crash",
    author: "Neal Stephenson",
    cover: "https://covers.openlibrary.org/b/id/8259465-L.jpg",
    rating: 4.3,
    year: 1992,
    genre: "scifi",
    language: "english",
    description: "A science fiction novel that explores themes of linguistics, computer science, and politics."
  },
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    cover: "https://covers.openlibrary.org/b/id/8259466-L.jpg",
    rating: 4.4,
    year: 1969,
    genre: "scifi",
    language: "english",
    description: "A science fiction novel set in the fictional Hainish universe, dealing with themes of gender and sexuality."
  },

  // More Fantasy
  {
    title: "Mistborn: The Final Empire",
    author: "Brandon Sanderson",
    cover: "https://covers.openlibrary.org/b/id/8259467-L.jpg",
    rating: 4.7,
    year: 2006,
    genre: "fantasy",
    language: "english",
    description: "A fantasy novel set in a world where the Dark Lord has won and rules with an iron fist."
  },
  {
    title: "American Gods",
    author: "Neil Gaiman",
    cover: "https://covers.openlibrary.org/b/id/8259468-L.jpg",
    rating: 4.4,
    year: 2001,
    genre: "fantasy",
    language: "english",
    description: "A fantasy novel that explores the concept of old gods being replaced by new ones in modern America."
  },
  {
    title: "The Lies of Locke Lamora",
    author: "Scott Lynch",
    cover: "https://covers.openlibrary.org/b/id/8259469-L.jpg",
    rating: 4.6,
    year: 2006,
    genre: "fantasy",
    language: "english",
    description: "A fantasy novel about a group of con artists in a city reminiscent of Venice."
  },

  // More Mystery
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    cover: "https://covers.openlibrary.org/b/id/8259470-L.jpg",
    rating: 4.4,
    year: 2005,
    genre: "mystery",
    language: "english", // Changed from swedish to english
    description: "A psychological thriller novel about a journalist and a hacker investigating a wealthy family."
  },
  {
    title: "And Then There Were None",
    author: "Agatha Christie",
    cover: "https://covers.openlibrary.org/b/id/8259471-L.jpg",
    rating: 4.5,
    year: 1939,
    genre: "mystery",
    language: "english",
    description: "A mystery novel by Agatha Christie, widely considered her masterpiece and one of the best-selling books of all time."
  },

  // Self-Help & Business
  {
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://covers.openlibrary.org/b/id/8260736-L.jpg",
    rating: 4.8,
    year: 2018,
    genre: "biography",
    language: "english",
    description: "A guide to building good habits and breaking bad ones."
  },
  {
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    cover: "https://covers.openlibrary.org/b/id/8259472-L.jpg",
    rating: 4.3,
    year: 1989,
    genre: "biography",
    language: "english",
    description: "A business and self-help book that presents an approach to being effective in attaining goals."
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover: "https://covers.openlibrary.org/b/id/8259473-L.jpg",
    rating: 4.5,
    year: 2011,
    genre: "biography",
    language: "english",
    description: "A book that summarizes research that Kahneman conducted over decades, often in collaboration with Amos Tversky."
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/readwell')
  .then(() => console.log('✅ Connected to MongoDB for seeding...'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const seedDB = async () => {
  try {
    await Book.deleteMany({});
    await Book.insertMany(sampleBooks);
    console.log('✅ Sample books added to database!');
    console.log(`📚 Added ${sampleBooks.length} books`);
    
    // Show book count by genre
    const genreCounts = {};
    sampleBooks.forEach(book => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });
    
    console.log('\n📊 Books by Genre:');
    Object.entries(genreCounts).forEach(([genre, count]) => {
      console.log(`   ${genre}: ${count} books`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDB();