var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');

var index = require('./routes/index');
var login = require('./routes/login');
var singlebattle = require('./routes/single_battle');
var battle = require('./routes/battle');
var design = require('./routes/design');
var ws = require('./ws');

process.chdir(__dirname);

var app = express();
var appCookieParser = cookieParser();

app.set('TOKEN_SECRET', process.env.TOKEN_SECRET);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'layout'); 

if (app.get('env') !== 'development'){
  app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
    return next();
  });
};

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(appCookieParser);
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt({
  secret: app.get('TOKEN_SECRET'),
  getToken: req => req.cookies.a_token
}).unless({path: ['/login', '/login/register']}));

app.use('/', index);
app.use('/login', login);
app.use('/battle', battle);
app.use('/singlebattle', singlebattle);
if (app.get('env') === 'development'){
  app.use('/design', design);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err.status == 401){
    res.redirect('/login');
  }
  else{
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

var server = http.createServer(app);

ws(server, appCookieParser);

module.exports = server;
