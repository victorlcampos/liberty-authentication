module.exports = {
  "test": "mongodb://localhost/authentication-test",
  "development": "mongodb://localhost/authentication",
  "production": process.env.MONGOLAB_URI
};