const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


const generateRandomString = () => {
  const availableChars = '012345789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomShortURL = '';

  for (let i = 0; i < 6; i++) {
    randomShortURL += availableChars.charAt(Math.floor(Math.random() * 62));
  }

  return randomShortURL;


};

const getUserByEmail = (email) => {
  for (const id in users) {
    const user = users[id];
    if (user.email === email) {

      return user;
    }

  }

  return null;

};


const urlDatabase = {

  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {

  "userRandomID": {

    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },

  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }

};

app.get('/', (req, res) => {

  res.send('Hello!');


});

app.get('/urls.json', (req, res) => {

  res.json(urlDatabase);

});

app.get('/hello', (req, res) => {

  res.send('<html><body>Hello <b>World</b></body></html>\n');

});


// List of created urls
app.get('/urls', (req, res) => {

  const templateVars = {
    urls: urlDatabase,
    userInfo: users[req.cookies['user_id']]
  };

  res.render('urls_index', templateVars);

});

// To add new url to list once created
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL, 
    userID: req.cookies['user_id']
  }

  res.redirect(`/urls/${shortURL}`);


});

// To create new url
app.get('/urls/new', (req, res) => {
  const templateVars = {
    userInfo: users[req.cookies['user_id']]
  };

  if(!req.cookies['user_id']){

    res.redirect('/login')
  }

  res.render("urls_new", templateVars);


});

// Shows newly created URL
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    userInfo: users[req.cookies['user_id']]
  };


  res.render("urls_show", templateVars);
});

// Adds ability to edit the longURL associated with the short URL
app.post('/urls/:shortURL', (req, res) => {

  longURL: urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect(`/urls`);

});

// clicking on shortURL shoud lead to longURL website unless it does not exist 
app.get('/u/:shortURL', (req, res) => {

  const longURL = urlDatabase[req.params.shortURL].longURL;

  if (!longURL) {
    res.status(404).send('Error: That shortURL does not exist');
    return;
  }

  res.redirect(longURL);

});

// Removes a shortURL
app.post('/urls/:shortURL/delete', (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

// Render Login Page
app.get('/login', (req, res) => {
  const templateVars = {
    userInfo: users[req.cookies['user_id']]
  };
  res.render('login_form', templateVars);

});

// Login 
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);

  if (!email || !password) {

    res.status(400).send('Error: Cannot have empty email or password');
    return;
  }


  if (!user) {
    res.status(403).send('Error: This email does not exist');
    return;

  }


  if (user.password !== password) {

    return res.status(403).send('Error: Incorrect Password');
  }


  res.cookie('user_id', user.id);
  res.redirect('/urls')


});

// Logout
app.post('/logout', (req, res) => {

  res.clearCookie('user_id');
  res.redirect(`/urls`);

});


// Rendering register page
app.get('/register', (req, res) => {
  const templateVars = {
    userInfo: users[req.cookies['user_id']]
  };

  res.render('registration', templateVars);
});

// Register
app.post('/register', (req, res) => {

  const userRandomID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {

    res.status(400).send('Error: Cannot have empty email or password');
    return;
  }

  const user = getUserByEmail(email);

  if (user) {
    res.status(400).send('Error: Email Already Registered');
    return;

  }

  users[userRandomID] = {

    id: userRandomID,
    email: req.body.email,
    password: req.body.password

  };


  res.cookie('user_id', userRandomID);

  res.redirect(`/urls`);


});


app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});




