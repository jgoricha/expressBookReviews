const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const ans = Object.values(books).filter(book => book.author === req.params.author);

  if (ans.length === 0) {
    return res.status(300).json({message: "Author not found"});
  }

  res.send(ans);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const ans = Object.values(books).filter(book => book.title === req.params.title);

  if (ans.length === 0) {
    return res.status(300).json({message: "Title not found"});
  }

  res.send(ans);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

//Task 10
function ListofBooks(){
    return new promise((resolve, reject)=>{
        resolve(books);
    })
}

public_users.get('/',function (req, res) {
    ListofBooks().then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
    );  
});

//Task 11
function BookDetailsISBN(){
    let book = books[isbn];
    return new promise ((resolve, reject)=>{
        if (book){
        resolve(book);
    }else{
        reject("No book found");
    }
    })
}

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    BookDetailsISBN(isbn).then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
    )
});

//Task 12
function BookDetailsAuthor(author) {
    const ans = Object.values(books).filter(book => book.author === author);

    return new Promise((resolve, reject) => {
        resolve(ans);
    });
}

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    BookDetailsAuthor(author).then(
        (bk) => res.send(JSON.stringify(bk, null, 4)),
    );
});

//Task 13
function BookDetailsTitle(title) {
    const ans = Object.values(books).filter(book => book.title === title);

    return new Promise((resolve, reject) => {
        resolve(ans);
    });
}

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    BookDetailsAuthor(title).then(
        (bk) => res.send(JSON.stringify(bk, null, 4)),
    );
});

module.exports.general = public_users;
