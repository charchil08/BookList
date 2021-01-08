//Construct a Book class
class Book {
    constructor(title, author, price, isbn) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.isbn = isbn;
    }
}

class BookStore {
    static getBooks() {
        let books;
        //If books has already there then we are collecting it from localstorage else we are declaring books as an array in if block.
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBooks(book) {
        const books = BookStore.getBooks();
        //Adding a new book to local storage
        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn) {
        //We are removing book into localStorage using isbn.
        const books = BookStore.getBooks();
        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Class to have a default book with static method 
class UI {
    static displayBooks() {
        const localBooks = BookStore.getBooks();

        const books = localBooks;

        //Adding books into a list
        books.forEach(function (book) {
            UI.addBookToList(book);
        });
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.price}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-sm btn-outline-danger del-btn">X</a></td>
        `;

        list.appendChild(row);
    }

    //Clear title, Author and Price section
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#price').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(element) {
        if(element.classList.contains('del-btn')) {
            element.parentElement.parentElement.remove();
        }
    }

    static setAlert(message, alertClass)
    {
        const div = document.createElement('div');
        div.className = `border-rad alert alert-${alertClass}`;
        div.appendChild(document.createTextNode(message));
        const form = document.querySelector('#book-form');
        const container = document.querySelector('.container');
        container.insertBefore(div, form);

        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 1000);
    }
}

//Add event for calling a static method of LocalBook class and add some default books into a list
document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', function (e) {
    e.preventDefault();
    //Collect Dynamically added book
    const bookTitle = document.querySelector('#title').value;
    const bookAuthor = document.querySelector('#author').value;
    const bookPrice = document.querySelector('#price').value;
    const bookIsbn = document.querySelector('#isbn').value;

    // Validation of a form
    if(bookTitle === '' || bookAuthor==='' || bookPrice==='' || bookIsbn==='')
    {
        UI.setAlert('Please Fill All Fields.','danger');
    }    
    else
    {
        const book = new Book(bookTitle, bookAuthor, bookPrice, bookIsbn);
        UI.addBookToList(book);
        BookStore.addBooks(book);
        UI.setAlert('Book Added Successfully', 'success');
        UI.clearFields();
    }
});

//To delete a single book
document.querySelector('#book-list').addEventListener('click', function(e) {
    //Removing book from Local Storage and UI.
    BookStore.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.deleteBook(e.target);
    UI.setAlert('Book Removed.','warning');
});
