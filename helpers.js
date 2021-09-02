const getUserByEmail = (email, database) => {
  for (const id in database) {
    const user = database[id];
    if (user.email === email) {

      return user;
    }

  }

  return undefined;

};

module.exports = { getUserByEmail };