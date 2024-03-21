const express = require('express');
const router = express.Router();
const { cacheBooks, getAllBooks, addBook } = require('../controllers/bookController');

router.get('/books', cacheBooks, getAllBooks);
router.post('/books-add', addBook);

module.exports = router;
