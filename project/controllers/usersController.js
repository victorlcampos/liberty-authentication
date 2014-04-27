'use strict';

module.exports = function (app) {
  var User     = app.models.user            ;
  var passport = require('passport')        ;
  var ObjectId = app.database.Types.ObjectId;

  var usersController = {
    create: function (req, res, next) {
      var newUser = new User(req.body);
      newUser.provider = 'local';

      newUser.save(function(err) {
        if (err) {
          return res.send(400, err);
        }

        req.logIn(newUser, function(err) {
          if (err) return next(err);
          return res.json(newUser.user_info);
        });
      });
    }
  };

  return usersController;
}