'use strict';

var app            = require('./lib/utils').app                   ,
    should         = require('should')                            ,
    request        = require('supertest').agent(app)              ,
    passportStub   = require('passport-stub')                     ,
    authentication = require('./lib/authentication')(passportStub),
    mongoose       = app.database                                 ;


passportStub.install(app);

describe('sessionsController', function () {
  describe('get /v1/auth/current_user', function(){
    describe('with logged user', function() {

      beforeEach(authentication.login({username: 'test'}));
      afterEach(authentication.logout(                  ));

      it('should receive 200', function (done) {
        request
          .get('/v1/auth/current_user')
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);

            res.body.username.should.equal('test');

            done();
          });
      });
    });

    describe('with not logged user', function() {
      it('should receive 400', function (done) {
        request
          .get('/v1/auth/current_user')
          .expect(400)
          .end(function (err, res) {
            should.not.exist(err);
            res.text.should.equal("Not logged in");
            done();
          });
      });
    });
  });
});