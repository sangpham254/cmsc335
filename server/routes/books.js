const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const axios = require('axios');
const config = require('../config');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new book review
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    review: req.body.review,
    rating: req.body.rating
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search books using Google Books API
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${config.GOOGLE_BOOKS_API_KEY}`
    );
    res.json(response.data.items || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;