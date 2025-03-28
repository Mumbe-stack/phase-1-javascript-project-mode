document.addEventListener('DOMContentLoaded', function () {
  const base_URL = 'https://end-of-phase-project-backend.vercel.app/books';

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
      bookName.textContent = book.name;
      bookImage.src = book.image;
      bookAuthor.textContent = `Author: ${book.author}`;
      bookPages.textContent = `Pages: ${book.pages}`;
      bookPublication.textContent = `Published: ${book.publication}`;
      likeBtn.textContent = `Like (${book.likes || 0})`;
     
  }

  
  function renderBookList(bookArray) {
    booksContainer.innerHTML = '';
    bookArray.forEach(book => {
       
      const bookItem = document.createElement('div');
      bookItem.classList.add('book-list-item');
      bookItem.style.cursor ='pointer'

      const img = document.createElement('img');
      img.src= book.image;
      img.style.width = '100px';
      img.style.margin = '10px';
      img.style.cursor = 'pointer';

      bookItem.appendChild(img)
      bookItem.addEventListener('click', (event) => handleClick(book, event));
      booksContainer.appendChild(bookItem);
    });
  }

  function handleClick(book, event) {
    event.preventDefault();
    displayBookDetails(book);
  }
  
  searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = books.filter(function (book) {
      return book.name.toLowerCase().includes(searchTerm);
    });

    renderBookList(filtered);
    if (filtered.length > 0) {
      displayBookDetails(filtered[0]);
    } else {
      booksContainer.innerHTML = '<p style="color:red;">Book not found!</p>';
    }
  });

  
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const newBook = {
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

  
  likeBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (!currentBook) return;
    let newLikes = (currentBook.likes || 0) + 1;
   

    fetch(`${base_URL}/${currentBook.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedBook => {
        currentBook.likes = updatedBook.likes;
        likeBtn.textContent = `Like (${updatedBook.likes})`;
      });
      
  });

  
  deleteBtn.addEventListener('click', function () {
    if (!currentBook) return;

    if (confirm(`Are you sure you want to delete"${currentBook.name}"?`)) {
      fetch(`$base_URL}/${currentBook.id}`, {
        method: 'DELETE'
      })
      .then(() => {
        books = books.filter(books = books.id !== currentBook.id);
        renderBookList(books);
        if (books.length >0) {
          displayBookDetails(books[0]);
        }
        else {
        currentBook = null;
        bookName.textContent = '';
        bookImage.src = '';
        bookAuthor.textContent = '';
        bookPages.textContent = '';
        bookPublication.textContent = '';
        likeBtn.textContent = 'Like';
        }
      });
    }
  });
});