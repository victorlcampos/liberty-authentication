/**
 * Module dependencies.
 */
var express        = require('express'),
    http           = require('http'),
    load           = require('express-load'),
    app            = express(),
    db             = require('mongoose'),
    dbUrls         = require('./config/database')
    mongoStore     = require('connect-mongo')(express),
    passportConfig = require('./config/authentication'),
    passport       = require('passport');

// all environments
app.set('port', process.env.PORT || 8000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var databaseUrl = dbUrls[process.env.NODE_ENV || "development"];
app.database    = db.connect(databaseUrl);

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

passportConfig(app);

app.use(express.session({
  secret: 'MEAN',
  store: new mongoStore({
    url: databaseUrl,
    collection: 'sessions'
  })
}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports.app = app;