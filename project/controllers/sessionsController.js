module.exports = function (app) {

  var User     = app.models.user    ;
  var passport = require('passport');

  var sessionsController = {
    current_user: function(req, res) {
      var user = req.user;
      if (user) {
        res.json(req.user.user_info);
      } else {
        res.send(400, "Not logged in");
      }
    },
    logout: function(req, res) {
      if(req.user) {
        req.logout();
        res.send(200);
      } else {
        res.send(400, "Not logged in");
      }
    },
    login: function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        var error = err || info;
        if (error) {
          console.log(error);
          return res.json(400, error);
        }

        req.logIn(user, function(err) {
          if (err) {
            console.log(error);
            return res.send(err);
          }
          res.json(req.user.user_info);
        });

      })(req, res, next);
    }
  };

  return sessionsController;
}