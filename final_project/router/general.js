const axios = require("axios");
const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
//-------------------------------------------------------------------------------------------------------
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  } else {
    res.send({ message: "Please enter valid username and password" });
  }
});
//-------------------------------------------using promises------------------------------------------------------------
// Get the book list available in the shop
public_users.get("/", function (req, res) {
  
  let getBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      z = books;
      if (z != 0) {
        resolve(books);
      } else return reject();
    }, 60);
  });

  getBooks.then((successMessage) => {
    res.send(successMessage);
  }).catch((err) => res.send("No Books List Found"));
});

//---------------------------------------using promises----------------------------------------------------------------
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let getBooksByISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books.hasOwnProperty(isbn)) {
        const books_isbn = books[isbn];
        resolve(books_isbn);
      } else {
        return reject();
      }
    }, 60);
  });
  getBooksByISBN
    .then((successMessage) => {
      res.send(successMessage);
    })
    .catch((err) => res.send("No ISBN book found..."));
});

/* const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    const books_isbn = books[isbn];
    res.send(books_isbn);
  } else {
    return res.status(403).json({ message: "ISBN Number Not Found" });
  }*/
//});
//-------------------------------------------------using promises----------------------------------------------------
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const auth = req.params.author;
  let getBooksByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      x = Object.values(books).filter((book) => book.author === auth);
      if (x != 0) {
        resolve(x);
      } else {
        return reject(x);
      }
    }, 60);
  });
  getBooksByAuthor
    .then((successMessage) => {
      res.send(successMessage);
    })
    .catch((err) => res.send("No Author Found..."));
});
/* x = Object.values(books).filter((book) => book.author === auth);
  if (x != 0) {
    res.send(x);
  } else {
    res.status(403).json({ message: "No Author Found" });
  } */
//// fuck yessssssssssssssssssssssssssss

//-----------------------------------------using promises------------------------------------------------------------
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  let getBooksByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      y = Object.values(books).filter((book) => book.title === title);
      if (y != 0) {
        resolve(y);
      } else {
        reject(y);
      }
    }, 60);
  });
  getBooksByTitle
    .then((successMessage) => {
      res.send(successMessage);
    })
    .catch((err) => res.send("No Book With That Title..."));
});

/*const title = req.params.title;
  y = Object.values(books).filter((book) => book.title === title);
  if (y != 0) {
    res.send(y);
  } else {
    res.status(403).json({ message: "No Title Found" });
  }
  */

//-----------------------------------------------------------------------------------------------------
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    const review = book.reviews;
    res.send(review);
  } else {
    return res.status(403).json({ message: "Reviews  Not Found" });
  }
});

module.exports.general = public_users;
