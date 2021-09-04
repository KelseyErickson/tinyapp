const getUserByEmail = (email, database) => {
  for (const id in database) {
    const user = database[id];
    if (user.email === email) {

      return user;
    }

  }

  return undefined;

};

const generateRandomString = () => {
  const availableChars = '012345789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomShortURL = '';

  for (let i = 0; i < 6; i++) {
    randomShortURL += availableChars.charAt(Math.floor(Math.random() * 61));
  }

  return randomShortURL;


};

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