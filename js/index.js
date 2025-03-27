document.addEventListener('DOMContentLoaded', function () {
    const base_URL = 'http://localhost:3000/books';
  
    const searchInput = document.querySelector('#search input');
    const form = document.getElementById('bookForm');
  
    const bookName = document.getElementById('book-name');
    const bookImage = document.getElementById('book-image');
    const bookAuthor = document.getElementById('book-author');
    const bookPages = document.getElementById('book-pages');
    const bookPublication = document.getElementById('publication-year');
  
    const booksContainer = document.getElementById('books-container');
    const likeBtn = document.getElementById('like-btn');
    const deleteBtn = document.getElementById('delete-btn');
  
    let books = [];
    let currentBook = null;
  
  
    fetch(base_URL)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        books = data;
        if (books.length > 0) {
          displayBookDetails(books[0]);
          renderBookList(books);
        }
      });
  
   
    function displayBookDetails(book) {
      currentBook = book;
      bookName.textContent = book.name || '';
      bookImage.src = book.image || '';
      bookAuthor.textContent = 'Author: ' + (book.author || '');
      bookPages.textContent = 'Pages: ' + (book.pages || '');
      bookPublication.textContent = 'Published: ' + (book.publication || '');
    }
  
    
    function renderBookList(bookArray) {
      booksContainer.innerHTML = '';
      bookArray.forEach(function (book) {
        var img = document.createElement('img');
        img.src = book.image;
        img.alt = book.name;
        img.title = book.name;
        img.style.width = '100px';
        img.style.margin = '10px';
        img.style.cursor = 'pointer';
  
        img.addEventListener('click', function () {
          displayBookDetails(book);
        });
  
        booksContainer.appendChild(img);
      });
    }
  
    
    searchInput.addEventListener('input', function () {
      var searchTerm = searchInput.value.toLowerCase();
      var filtered = books.filter(function (book) {
        return book.name.toLowerCase().includes(searchTerm);
      });
  
      renderBookList(filtered);
      if (filtered.length > 0) {
        displayBookDetails(filtered[0]);
      } else {
        booksContainer.innerHTML = '<p style="color:red;">No book found!</p>';
      }
    });
  
    
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      var newBook = {
        name: document.getElementById('new-name').value,
        author: document.getElementById('new-author').value,
        image: document.getElementById('new-image').value,
        pages: parseInt(document.getElementById('new-pages').value),
        publication: parseInt(document.getElementById('new-publication').value),
        likes: 0
      };
  
      fetch(base_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (book) {
          books.push(book);
          renderBookList(books);
          displayBookDetails(book);
          form.reset();
        });
    });
  
    
    likeBtn.addEventListener('click', function () {
      if (!currentBook) return;
      let newLikes = (currentBook.likes || 0) + 1;
  
      fetch(base_URL + '/' + currentBook.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: newLikes })
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (updated) {
          alert('Liked! Total Likes: ' + updated.likes);
          currentBook.likes = updated.likes;
        });
    });
  
    
    deleteBtn.addEventListener('click', function () {
      if (!currentBook) return;
  
      fetch(base_URL + '/' + currentBook.id, {
        method: 'DELETE'
      }).then(function () {
        books = books.filter(function (book) {
          return book.id !== currentBook.id;
        });
        renderBookList(books);
        displayBookDetails(books[0] || {});
      });
    });
  });