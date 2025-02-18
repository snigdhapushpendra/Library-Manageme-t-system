function login() {
    // Example login logic
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Simulate a successful login
    if (username === "admin" && password === "admin123") {
        document.getElementById("login").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
    } else {
        alert("Invalid username or password.");
    }
}

function logout() {
    document.getElementById("login").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
}

function fetchBooks() {
    // Example book list (you can fetch this data from a server)
    const books = [
        "Book 1: JavaScript for Beginners",
        "Book 2: Mastering HTML & CSS",
        "Book 3: The Art of Web Development"
    ];

    const bookListDiv = document.getElementById("book-list");
    bookListDiv.innerHTML = "<h3>Available Books</h3>";
    books.forEach(book => {
        const bookElement = document.createElement("p");
        bookElement.textContent = book;
        bookListDiv.appendChild(bookElement);
    });
}