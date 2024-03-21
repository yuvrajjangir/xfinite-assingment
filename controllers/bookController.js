const { validationResult } = require('express-validator');
const Book = require('../models/bookModel');
const redisClient = require('../config/redisConfig')

async function cacheBooks(req, res, next) {
  try {
    console.log('Checking cache for books...');
    redisClient.get('books', async (err, cachedBooks) => {
      if (err) {
        console.error('Redis error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (cachedBooks) {
        console.log('Data fetched from Redis.');
        req.books = JSON.parse(cachedBooks);
        return next(); // Move to the next middleware or route handler
      } else {
        try {
          console.log('Fetching data from MongoDB...');
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 6;
          const offset = (page - 1) * limit;

          const books = await Book.find()
            .skip(offset)
            .limit(limit)
            .exec();

          console.log('Caching data in Redis...');
          // Use the set method with the EX option to set a key with an expiration time
          await redisClient.set('books', JSON.stringify(books), 'EX', 1800); // 1800 seconds = 30 minutes
          console.log('Data cached in Redis.');

          req.books = books;
          return next(); // Move to the next middleware or route handler
        } catch (error) {
          console.error('Error fetching data from MongoDB:', error);
          return res.status(500).json({ message: 'Error fetching data from MongoDB' });
        }
      }
    });
  } catch (err) {
    console.error('Error checking cache:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function getAllBooks(req, res) {
  try {
    if (req.books) {
      return res.status(200).json(req.books);
    }
    return res.status(200).json([]); // Return an empty array if books are not found
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Internal server error' });
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
  addBook,
  cacheBooks
};