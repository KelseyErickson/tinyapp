const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


function generateRandomString(){
  const availableChars = '012345789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let randomShortURL = '';
  
  for(let i = 0; i < 6; i++){
    randomShortURL += availableChars.charAt(Math.floor(Math.random() * 62));
  }
  
  return randomShortURL;
  

}


const urlDatabase = {

  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.get('/', (req, res) => {

  res.send('Hello!');


});

app.get('/urls.json', (req, res) => {

  res.json(urlDatabase);

});

app.get('/hello', (req, res) => {

  res.send('<html><body>Hello <b>World</b></body></html>\n')

});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);

});

app.get('/urls/new', (req, res) => {
  res.render("urls_new");

});

app.post ('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  

})

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {

  const longURL = urlDatabase[req.params.shortURL]

  res.redirect(longURL);

});

app.post('/urls/:shortURL/delete', (req, res) => {
  
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});




app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});




