document.addEventListener('DOMContentLoaded', () => {
    const base_URL = 'http://localhost:3000/books';
  
    const searchInput = document.querySelector('#search input');
    const form = document.getElementById('bookForm');
  
    const bookName = document.getElementById('book-name');
    const bookImage = document.getElementById('book-image');
    const bookAuthor = document.getElementById('book-author');
    const bookPages = document.getElementById('book-pages');
    const bookPublication = document.getElementById('publication-year');
  
    const booksContainer = document.getElementById('books-container');
  
 
    fetch (base_URL)

    .then(res=> res.json())

    .then(data => {
        books = data; 
        if (books.length > 0){
            displayBookDetails(books[0]);
            renderBookList();  
        }
        
    });
    
  
   
    function displayBookDetails(book) {
      bookName.textContent = book.name;
      bookImage.src = book.image;
      bookAuthor.textContent = `Author: ${book.author}`;
      bookPages.textContent = `Pages: ${book.pages}`;
      bookPublication.textContent = `Published: ${book.publication}`;
    }
  

    function renderBookList() {
      booksContainer.innerHTML = '';
      books.forEach(book => {
        
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-list-item');
        bookItem.style.cursor ='pointer'

        const img = document.createElement('img');
        img.src= book.image;
        img.alt = book.name;

        img.style.width = '30px';
        img.style.height = '45px';
        img.style.objectFit = 'cover';
        img.style.marginRight = '10px'

        const title = document.createElement('span');
        title.textContent = book.name;

        bookItem.appendChild(img);
        bookItem.appendChild(title);

        bookItem.addEventListener('click', (event) => handleClick(book, event));

        booksContainer.appendChild(bookItem);
      });
    }

    function handleClick(book, event) {
        event.preventDefault ();
        displayBookDetails(book);   
    }
  
    // Filter books on search input
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filtered =books.filter(book => book.name.toLowerCase().includes(searchTerm));

      if (filtered.length > 0) {
        renderFilteredBooks(filtered);
      }
      else{
        booksContainer.innnerHtml = '<p>Your book not found</p>';
      }
    });

    function renderFilteredBooks(filetredBooks) {
        booksContainer.innerHTML = '';
        filetredBooks.forEach(book => {
            const bookitem = document.createElement('div');
            bookItem.classList.add('book-list-item');
        })
    }
  
    // Handle form submission to add new book
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const newBook = {
        name: document.getElementById('new-name').value,
        author: document.getElementById('new-author').value,
        image: document.getElementById('new-image').value,
        pages: parseInt(document.getElementById('new-pages').value),
        publication: parseInt(document.getElementById('new-publication').value)
      };
  
      fetch(base_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })

      .then(res => res.json())
      .then(book => {
        books.push(book);
        renderBookList();
        displayBookDetails(book); 
        form.reset();
      });
    });
  });