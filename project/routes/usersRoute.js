module.exports = function(app) {
  var usersController = app.controllers.usersController;
  app.post('/v1/users', usersController.create);
}