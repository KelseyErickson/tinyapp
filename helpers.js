// Find user in database with given an email and database
// Return the user associated with the email or undefined if no user found
const getUserByEmail = (email, database) => {
  for (const id in database) {
    const user = database[id];
    if (user.email === email) {

      return user;
    }

  }

  return undefined;

};

// Generate random alphanumeric string
const generateRandomString = () => {
  const availableChars = '012345789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomShortURL = '';

  for (let i = 0; i < 6; i++) {
    randomShortURL += availableChars.charAt(Math.floor(Math.random() * 61));
  }

  return randomShortURL;


};

// Takes in an id and a database
// Returns all items in the database associated with the id
const urlsForUser = (id, database) => {
  const userUrlDatabase = {};

  for (const URL in database) {
    const shortURL = database[URL];
    if (id === shortURL.userID) {

      userUrlDatabase[URL] = shortURL;
    }
    
  
  }
  return userUrlDatabase;
  
};


module.exports = { getUserByEmail, generateRandomString, urlsForUser };