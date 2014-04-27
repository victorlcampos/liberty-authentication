'use strict';

process.env.NODE_ENV = 'test';
var app              = require('../../app').app
var mongoose         = app.database;
var fixtures         = require('pow-mongoose-fixtures');

beforeEach(function (done) {
  fixtures.load('fixtures', mongoose, function() {
    return done();
  });
});

exports.app = app