/**
 * Module dependencies.
 */
var express        = require('express'),
    http           = require('http'),
    load           = require('express-load'),
    app            = express(),
    db             = require('mongoose'),
    dbUrls         = require('./config/database'),
    corsConfig     = require('./config/cors'),
    sessionConfig  = require('./config/session'),
    mongoStore     = require('connect-mongo')(express),
    passportConfig = require('./config/authentication'),
    cors           = require('cors'),
    passport       = require('passport'),
    jwt            = require('jsonwebtoken');

// all environments
app.set('port', process.env.PORT || 8000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());

var env = process.env.NODE_ENV || "development";

var databaseUrl = dbUrls[env];
app.database    = db.connect(databaseUrl);

app.use(cors(corsConfig[env]));

var secret = sessionConfig[env].secret;

app.use(express.session({
  secret: secret,
  cookie: {
      path     : '/',
      httpOnly : false,
      maxAge   : 1000*60*60*24*30*12
  },
  store: new mongoStore({
    url: databaseUrl,
    collection: 'sessions'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.tokenize = function(id) {
  return jwt.sign({id: id}, secret, { expiresInMinutes: 60*24*30*12 });
}

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

passportConfig(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports.app = app;