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
    cors           = require('cors'),
    passport       = require('passport');

// all environments
app.set('port', process.env.PORT || 8000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());

var databaseUrl = dbUrls[process.env.NODE_ENV || "development"];
app.database    = db.connect(databaseUrl);

app.use(express.session({
  secret: 'MEAN',
  store: new mongoStore({
    url: databaseUrl,
    collection: 'sessions'
  })
}));

app.use(cors({origin: 'http://localhost:8080', credentials: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
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