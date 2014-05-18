module.exports = function (app) {
  var User     = app.models.user    ;
  var passport = require('passport');

  var sessionsController = {
    current_user: function(req, res) {
      var user = req.user;
      if (user) {
        var user_info   = req.user.user_info;
        user_info.token = app.tokenize(user_info._id);

        console.log(user_info.token);

        res.json(user_info);
      } else {
        res.send(403, "Not logged in");
      }
    },
    logout: function(req, res) {
      req.logout();
      res.send(200);
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
          var user_info   = req.user.user_info;
          user_info.token = app.tokenize(user_info._id);
          res.json(user_info);
        });

      })(req, res, next);
    }
  };

  return sessionsController;
}