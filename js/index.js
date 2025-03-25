fetch ("http://localhost:3000/books")

.then(response => response.json)

.then(data => {
    data.forEach(book => {
        
    });
})

.catch(error=> error)


function displayBooks(book) {
    document.getElementById("book-name").textContent = book.name;
    document.getElementById("book-image").src = book.image;
    document.getElementById("book-author").textContent = book.author;
    document.getElementById("book-pages").textContent = book.pages;
    document.getElementById("publication-year").textContent = publication.year


    
}