document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.getElementById('reviewForm');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const searchResults = document.getElementById('searchResults');
  const reviewsList = document.getElementById('reviewsList');

  // Load reviews when page loads
  loadReviews();

  // Form submission
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      title: reviewForm.title.value,
      author: reviewForm.author.value,
      review: reviewForm.review.value,
      rating: parseInt(reviewForm.rating.value)
    };

    try {
      const response = await fetch('/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        reviewForm.reset();
        loadReviews();
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Search books
  searchButton.addEventListener('click', searchBooks);

  async function searchBooks() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      const response = await fetch(`/books/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      displaySearchResults(data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  }

  function displaySearchResults(books) {
    searchResults.innerHTML = '';
    
    if (books.length === 0) {
      searchResults.innerHTML = '<p>No books found. Try a different search term.</p>';
      return;
    }

    books.forEach(book => {
      const bookInfo = book.volumeInfo;
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';
      
      let authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author';
      let thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Cover';
      
      bookCard.innerHTML = `
        <img src="${thumbnail}" alt="${bookInfo.title}" style="max-width: 100%; height: auto;">
        <h3>${bookInfo.title}</h3>
        <p>By ${authors}</p>
      `;
      
      searchResults.appendChild(bookCard);
    });
  }

  async function loadReviews() {
    try {
      const response = await fetch('/books');
      const reviews = await response.json();
      displayReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  function displayReviews(reviews) {
    reviewsList.innerHTML = '';
    
    if (reviews.length === 0) {
      reviewsList.innerHTML = '<p>No reviews yet. Be the first to add one!</p>';
      return;
    }

    reviews.forEach(review => {
      const reviewItem = document.createElement('div');
      reviewItem.className = 'review-item';
      
      reviewItem.innerHTML = `
        <h3>${review.title}</h3>
        <p>By ${review.author}</p>
        <div class="rating">Rating: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
        <p>${review.review}</p>
        <small>Reviewed on ${new Date(review.createdAt).toLocaleDateString()}</small>
      `;
      
      reviewsList.appendChild(reviewItem);
    });
  }
});