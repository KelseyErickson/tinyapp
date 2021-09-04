const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');


// Express
const express = require('express');
const app = express();

const PORT = 8080; //default port 8080

// Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// Cookie-Session
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// bcrypt
const bcrypt = require('bcrypt');


// Setting View Engine to ejs
app.set('view engine', 'ejs');



// Global Objects

const urlDatabase = {

  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }

};

const users = {

  "userRandomID": {

    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },

  "user2RandomID": {
    
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }

  

};


// GET and POST Requests

// List of created urls
app.get('/urls', (req, res) => {

  const user_idCookie = req.session.user_id;

  if (!user_idCookie) {
    res.send('Please login or register to view this page');
    return;
  }

  const userUrlDatabase = urlsForUser(user_idCookie, urlDatabase);
  
  console.log(userUrlDatabase)
  const templateVars = {

    urls: userUrlDatabase,
    userInfo: users[user_idCookie]

  };

  res.render('urls_index', templateVars);

});

// Add new url to list once created
app.post('/urls', (req, res) => {

  const shortURL = generateRandomString();
  const user_idCookie = req.session.user_id;

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: user_idCookie
  };

  res.redirect(`/urls/${shortURL}`);


});

// Render page to create new url
app.get('/urls/new', (req, res) => {

  const user_idCookie = req.session.user_id;
  const templateVars = {
    userInfo: users[user_idCookie]
  };

  if (!user_idCookie) {

    res.redirect('/login');
  }

  res.render("urls_new", templateVars);


});

// Shows newly created URL
app.get('/urls/:shortURL', (req, res) => {

  const user_idCookie = req.session.user_id;
  const shortURL = req.params.shortURL;

  if (!(user_idCookie === urlDatabase[shortURL].userID)) {
    res.send('Please login or register to view this page');
    return;
    
  }

  const templateVars = {
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
    userInfo: users[user_idCookie]
  };

  res.render("urls_show", templateVars);

});

// Adds ability to edit the longURL associated with the short URL
app.post('/urls/:shortURL', (req, res) => {

  const user_idCookie = req.session.user_id;
  const shortURL = req.params.shortURL;

  if (!(user_idCookie === urlDatabase[shortURL].userID)) {

    res.send('Access Denied');
  }

  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect(`/urls`);

});

// ShortURL shoud lead to longURL website unless it does not exist
app.get('/u/:shortURL', (req, res) => {

  const shortURL = req.params.shortURL;

  if (!urlDatabase[shortURL]) {
    res.status(404).send('Error: That shortURL does not exist');
    return;
  }

  const longURL = urlDatabase[shortURL].longURL;

  res.redirect(longURL);

});

// Removes a shortURL
app.post('/urls/:shortURL/delete', (req, res) => {

  const user_idCookie = req.session.user_id;
  const shortURL = req.params.shortURL;

  if (!(user_idCookie === urlDatabase[shortURL].userID)) {

    res.send('Access Denied');
  }

  delete urlDatabase[shortURL];
  res.redirect('/urls');

});

// Render Login Page
app.get('/login', (req, res) => {

  const user_idCookie = req.session.user_id;

  const templateVars = {
    userInfo: users[user_idCookie]
  };
  res.render('login_form', templateVars);

});

// Login
app.post('/login', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

  if (!email || !password) {

    res.status(400).send('Error: Cannot have empty email or password');
    return;
  }


  if (!user) {
    res.status(403).send('Error: This email does not exist');
    return;

  }


  if (!bcrypt.compareSync(password, user.password)) {

    return res.status(403).send('Error: Incorrect Password');
  }
  

  req.session.user_id = user.id;
  res.redirect('/urls');


});

// Logout
app.post('/logout', (req, res) => {

  req.session = null;
  res.redirect(`/urls`);

});


// Rendering register page
app.get('/register', (req, res) => {

  const user_idCookie = req.session.user_id;

  const templateVars = {
    userInfo: users[user_idCookie]
  };

  res.render('registration', templateVars);
});

// Register
app.post('/register', (req, res) => {

  const userRandomID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {

    res.status(400).send('Error: Cannot have empty email or password');
    return;
  }

  const user = getUserByEmail(email, users);

  if (user) {
    res.status(400).send('Error: Email Already Registered');
    return;

  }

  users[userRandomID] = {

    id: userRandomID,
    email: req.body.email,
    password: hashedPassword

  };

  
  req.session.user_id = userRandomID;

  res.redirect(`/urls`);


});


app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});




