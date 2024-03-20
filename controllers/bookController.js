const Book = require('../models/bookModel');
const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient();

// Handle Redis errors
redisClient.on('error', err => {
  console.error('Redis error:', err);
});

async function getAllBooks(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 6; // default limit to 6 if not provided
  
      // Calculate the offset to skip the correct number of documents
      const offset = (page - 1) * limit;
  
      // Check if Redis client is connected
      if (redisClient.connected) {
        // Check if data is cached in Redis
        redisClient.get(`books:page:${page}`, async (err, data) => {
          if (err) throw err;
  
          if (data) {
            res.status(200).json(JSON.parse(data));
          } else {
            // If data not found in Redis, fetch from MongoDB with pagination
            const books = await Book.find()
              .skip(offset)
              .limit(limit)
              .exec();
  
            // Cache data in Redis for 30 minutes
            redisClient.setex(`books:page:${page}`, 1800, JSON.stringify(books));
  
            res.status(200).json(books);
          }
        });
      } else {
        // If Redis client is not connected, fetch from MongoDB with pagination
        const books = await Book.find()
          .skip(offset)
          .limit(limit)
          .exec();
        res.status(200).json(books);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  

async function addBook(req, res) {
    const booksToAdd = req.body;
  
    // Check if the request body is an array
    if (!Array.isArray(booksToAdd)) {
      return res.status(400).json({ message: 'Please provide an array of books' });
    }
  
    const insertedBooks = [];
  
    // Iterate through each book in the array
    for (const bookData of booksToAdd) {
      const { title, author, genre } = bookData;
  
      // Validate if the required fields are present
      if (!title || !author || !genre) {
        return res.status(400).json({ message: 'Please provide title, author, and genre for each book' });
      }
  
      const newBook = new Book({
        title,
        author,
        genre
        // Add more fields as necessary
      });
  
      try {
        // Save each book to the database
        const savedBook = await newBook.save();
        insertedBooks.push(savedBook);
      } catch (err) {
        // If any error occurs, return a 500 status with an error message
        return res.status(500).json({ message: err.message });
      }
    }
  
    // Return the array of inserted books
    res.status(201).json(insertedBooks);
  }
  

module.exports = {
  getAllBooks,
  addBook
};
