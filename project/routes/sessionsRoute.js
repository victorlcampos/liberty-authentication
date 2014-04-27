module.exports = function(app) {
  var sessionsController = app.controllers.sessionsController;

  app.get('/auth/current_user', sessionsController.current_user);
  app.post('/auth/session'    , sessionsController.login       );
  app.del('/auth/session'     , sessionsController.logout      );
}