module.exports = function(passportStub) {

  authentication = {
    login: function(user_info) {
      return function(done) {
        passportStub.login({user_info: user_info});
        return done();
      }
    },
    logout: function() {
      return function(done) {
        passportStub.logout();
        return done();
      }
    }
  }

  return authentication;
}