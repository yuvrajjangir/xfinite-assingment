const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/books', bookController.getAllBooks);
router.post('/books-add', bookController.addBook);

module.exports = router;
