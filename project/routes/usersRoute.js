module.exports = function(app) {
  var usersController    = app.controllers.usersController;
  app.post('/users', usersController.create);
}