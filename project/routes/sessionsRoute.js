module.exports = function(app) {
  var sessionsController = app.controllers.sessionsController;

  app.get( '/v1/auth/sessions/current_user', sessionsController.current_user);
  app.post('/v1/auth/sessions'             , sessionsController.login       );
  app.del( '/v1/auth/sessions'             , sessionsController.logout      );
}