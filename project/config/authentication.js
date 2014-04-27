'use strict';

module.exports = function (app) {
  var database      = app.database,
      passport      = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User          = database.model('user');

  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            'errors': {
              'email': { type: 'Email is not registered.' }
            }
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            'errors': {
              'password': { type: 'Password is incorrect.' }
            }
          });
        }
        return done(null, user);
      });
    }
  ));
}

// Use local strategy
