const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


const generateRandomString = () => {
  const availableChars = '012345789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomShortURL = '';
  
  for (let i = 0; i < 6; i++) {
    randomShortURL += availableChars.charAt(Math.floor(Math.random() * 62));
  }
  
  return randomShortURL;
  

};

const isUserRegistered = (users, email) => {
  for(const user in users){
    console.log(users[user]['email'], email)
    if(users[user]['email'] === email ){

      return true;
    }

  }

  return false;
  
};


const urlDatabase = {

  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {

    "userRandomID": {

      id: "userRandomID",
      email:"user@example.com",
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

app.get('/urls', (req, res) => {
  
  const templateVars = {
    urls: urlDatabase,
    userInfo: users[req.cookies['user_id']]
  };
  
  res.render('urls_index', templateVars);

});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    userInfo: users[req.cookies['user_id']]
  };
  res.render("urls_new", templateVars);


});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  

});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userInfo: users[req.cookies['user_id']]
  };

  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {

  const longURL = urlDatabase[req.params.shortURL];

  if (!longURL) {
    res.status(404).send('Error: That shortURL does not exist');
    return;
  }

  res.redirect(longURL);

});

app.post('/urls/:shortURL/delete', (req, res) => {
  
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.post('/urls/:shortURL', (req, res) => {
  
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls`);

});

app.post('/login', (req, res) => {

  res.cookie('username', req.body.username);
  res.redirect(`/urls`);

});

app.post('/logout', (req, res) => {

  res.clearCookie('username', req.body.username);
  res.redirect(`/urls`);
  
});

app.get('/register', (req, res) => {

  res.render('registration');
});

app.post('/register', (req, res) => {

  const userRandomID = generateRandomString();

  if(!req.body.email || !req.body.password ){

    res.status(400).send('Error: Cannot have empty email or password');
    return;
  }

  if(isUserRegistered(users, req.body.email)){
    res.status(400).send('Error: Email Already Registered');
    console.log(users)
    return;

  } else {

  users[userRandomID]= {
    
    id: userRandomID, 
    email: req.body.email, 
    password: req.body.password
    
  };

  if(!req.body.email || !req.body.email ){

    res.status(400).send('Error: Cannot have empty email or password');
  }
  res.cookie('user_id', userRandomID);

  console.log(users)
  
  res.redirect(`/urls`);
}

});



app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});




