document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://localhost:3000/books';
  
    const searchInput = document.querySelector('#search input');
    const form = document.getElementById('bookForm');
  
    const bookNameEl = document.getElementById('book-name');
    const bookImageEl = document.getElementById('book-image');
    const bookAuthorEl = document.getElementById('book-author');
    const bookPagesEl = document.getElementById('book-pages');
    const bookPublicationEl = document.getElementById('publication-year');
  
    const booksContainer = document.getElementById('books-container');
  
    let books = [];
  
    // Fetch books from db.json
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        books = data;
        displayBookDetails(books[0]); // show first book initially
        renderBookList();
      });
  
    // Display details of a book
    function displayBookDetails(book) {
      bookNameEl.textContent = book.name;
      bookImageEl.src = book.image;
      bookAuthorEl.textContent = `Author: ${book.author}`;
      bookPagesEl.textContent = `Pages: ${book.pages}`;
      bookPublicationEl.textContent = `Published: ${book.publication}`;
    }
  
    // Render the list of all books
    function renderBookList() {
      booksContainer.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = book.name;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => displayBookDetails(book));
        booksContainer.appendChild(li);
      });
    }
  
    // Filter books on search input
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const foundBook = books.find(book => book.name.toLowerCase().includes(searchTerm));
      if (foundBook) {
        displayBookDetails(foundBook);
      }
    });
  
    // Handle form submission to add new book
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const newBook = {
        name: document.getElementById('new-name').value,
        author: document.getElementById('new-author').value,
        image: document.getElementById('new-image').value,
        pages: parseInt(document.getElementById('new-pages').value),
        publication: parseInt(document.getElementById('new-publication').value)
      };
  
      fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })
      .then(res => res.json())
      .then(book => {
        books.push(book);
        renderBookList();
        displayBookDetails(book); // show the newly added book
        form.reset();
      });
    });
  });