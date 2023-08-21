const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
//-------------------------------------------------------------------------------------------------------
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}
}
//-------------------------------------------------------------------------------------------------------

//only registered users can login
regd_users.post("/customer/auth/login", (req,res) => {
  //res.send("testing")
  
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username and password match
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});
  

//-------------------------------------------------------------------------------------------------------
// Add a book review


regd_users.put("/customer/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username; // The username is stored in the req.user object

  // Check if the book exists in the database
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];

    // Check if the user already has a review for the book
    if (book.reviews.hasOwnProperty(username)) {
      // Modify the existing review
      book.reviews[username].review = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Add a new review for the user
      book.reviews[username] = {
        username: username,
        review: review,
      };
      return res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
//-------------------------------------------- delete uyser --------------------
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const review = req.body.review;
  const username = req.user.username;
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];

    // Check if the user already has a review for the book
    if (book.reviews.hasOwnProperty(username)) {
      // Modify the existing review
      delete books[review];
      return res.status(200).json({ message: "Review Deleted" });}
    } else {
      return res.send('No reviews found')
    }


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
