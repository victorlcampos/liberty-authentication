module.exports = function(app) {
  var db         = app.database,
      timestamps = require('mongoose-timestamp'),
      Schema     = require('mongoose').Schema,
      crypto     = require('crypto');

  var User = new Schema({
    email: {
      type: String,
      unique: true,
      required: true
    },
    hashedPassword: String,
    salt: String,
    name: String,
    provider: String
  });

  /**
   * Virtuals
   */
  User.virtual('password')
    .set(function(password) {
      this._password      = password;
      this.salt           = this.makeSalt();
      this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
      return this._password;
    });

  User.virtual('user_info')
    .get(function () {
      return { '_id': this._id, 'name': this.name, 'email': this.email };
    });

  /**
   * Validations
   */
  var validatePresenceOf = function (value) {
    return value && value.length;
  };

  User.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  }, 'The specified email is invalid.');

  User.path('email').validate(function(value, respond) {
    db.models["user"].findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) return respond(false);
      respond(true);
    });
  }, 'The specified email address is already in use.');

  /**
   * Pre-save hook
   */
  User.pre('save', function(next) {
    if (!this.isNew) {
      return next();
    }

    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    }

    if (!validatePresenceOf(this.name)) {
      next(new Error('Invalid name'));
    }

    else {
      next();
    }
  });

  /**
   * Methods
   */
  User.methods = {
    /**
     * Authenticate - check if the passwords are the same
     */
    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     */
    makeSalt: function() {
      return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     */
    encryptPassword: function(password) {
      if (!password || !this.salt) return '';
      var salt = new Buffer(this.salt, 'base64');
      return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
  };

  User.plugin(timestamps);
  return db.model('user', User);
};