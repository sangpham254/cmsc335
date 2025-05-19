require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/books');
const path = require('path');
const config = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public'));

// Database connection
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../public')));
  }
  
// Routes
app.use('/books', bookRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});