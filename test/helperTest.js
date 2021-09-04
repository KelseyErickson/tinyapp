const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers');

const testUsers = {
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

describe('getUserByEmail', function() {

  it('should return a user with a valid email', function() {

    const user = getUserByEmail('user@example.com', testUsers);
    const expectedOutput = 'userRandomID';

    assert.equal(user.id, expectedOutput);

  });

  it('should return a undefined with a invalid email', function() {

    const user = getUserByEmail('notRegisteredUser@example.com', testUsers);
    const expectedOutput = undefined;

    assert.equal(user, expectedOutput);

  });

});

describe('generateRandomString', function() {

  it('should return a string', function() {

    const randomString = generateRandomString();

    assert.equal(typeof (randomString), 'string');

  });

  it('should be six charaters long', function() {

    const randomString = generateRandomString();

    assert.equal(randomString.length, 6);

  });

  it('should not return lowercase characters in order', function() {

    const randomString = generateRandomString();

    assert.notEqual(randomString, 'abcdef');

  });

  it('should not return capital characters in order', function() {

    const randomString = generateRandomString();

    assert.notEqual(randomString, 'ABCDEF');

  });

  it('should not return numbers that are in order', function() {

    const randomString = generateRandomString();

    assert.notEqual(randomString, '123456');

  });


});

const testUrlDatabase = {

  shortURL: { longURL: "https://www.tsn.ca", userID: "user1" },
  shortURL2: { longURL: "https://www.google.ca", userID: "user1" },
  shortURL3: { longURL: "https://www.example.com", userID: "user2" },
  shortURL4: { longURL: "https://en.wikipedia.org", userID: "user3" },
  shortURL5: { longURL: "https://www.lighthouselabs.ca/", userID: "user2" }

};

describe('urlsForUser', function() {

  it('should return an object', function() {

    const userUrlDatabase = urlsForUser('user2', testUrlDatabase);

    assert.equal(typeof (userUrlDatabase), 'object');

  });

  it('should only return the shortURL objects for the userID specified', function() {

    const userUrlDatabase = urlsForUser('user2', testUrlDatabase);

    const expectedOutput = {
      shortURL3: { longURL: "https://www.example.com", userID: "user2" },
      shortURL5: { longURL: "https://www.lighthouselabs.ca/", userID: "user2" }

    };

    assert.deepEqual(userUrlDatabase, expectedOutput);

  });


  it('should not return any other user\'s shortURLs', function() {

    const userUrlDatabase = urlsForUser('user2', testUrlDatabase);

    const incorrectOutput = {

      shortURL3: { longURL: "https://www.example.com", userID: "user2" },
      shortURL4: { longURL: "https://en.wikipedia.org", userID: "user3" },
      shortURL5: { longURL: "https://www.lighthouselabs.ca/", userID: "user2" }

    };

    assert.notEqual(userUrlDatabase, incorrectOutput);

  });




  it('should return an empty object if the user is not in database', function() {

    const userUrlDatabase = urlsForUser('user5', testUrlDatabase);


    assert.deepEqual(userUrlDatabase, {});

  });

});