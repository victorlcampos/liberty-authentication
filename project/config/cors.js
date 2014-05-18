module.exports = {
  "development": {origin: "http://professorfinanceiro.herokuapp.com:8080", credentials: true},
  "production": {origin: process.env.SINGLEPAGE_URI, credentials: true}
};