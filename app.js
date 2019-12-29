var http = require('http');
var https = require('https');
var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');

var index = require('./routes/index');
var login = require('./routes/login');
var singlebattle = require('./routes/single_battle');
var single = require('./routes/single');
var battle = require('./routes/battle');
var design = require('./routes/design');
var armies = require('./routes/armies');
var map = require('./routes/map');
var ws = require('./ws/ws_setup');
var log = require('./logger');

process.chdir(__dirname);

var app = express();
var appCookieParser = cookieParser();

app.set('TOKEN_SECRET', process.env.TOKEN_SECRET);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'layout');

/*if (app.get('env') !== 'development') {
  app.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
    return next();
  });
};*/

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(appCookieParser);
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt({
  secret: app.get('TOKEN_SECRET'),
  getToken: req => req.cookies.a_token
}).unless({ path: ['/', '/login', '/login/register'] }));

app.use('/', index);
app.use('/login', login);
if (app.get('env') === 'development') {
  app.use('/design', design);
  app.use('/battle', battle.dev());
  app.use('/single', single.dev());
}
else {
  app.use('/battle', battle.prod());
  app.use('/single', single.prod());
}
app.use('/singlebattle', singlebattle);
app.use('/armies', armies);
app.use('/map', map);

var JL = require('jsnlog').JL;
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;
app.post('*.logger', function (req, res) {
  jsnlog_nodejs(JL, req.body);
  log.error(req.body);
  // Send empty response. This is ok, because client side jsnlog does not use response from server.
  res.send('');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err.status == 401) {
    res.redirect('/login?noauth=1');
  }
  else {
    log.error(err);
    // set locals, only providing error in development
    var error = {
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    };
    // render the error page
    res.status(err.status || 500);
    res.render('error', error);
  }
});

function createServer(app) {
  return process.env.LOCAL
    ? https.createServer({
      pfx: fs.readFileSync('localhost.pfx'),
      passphrase: 'localhost',
      requestCert: false,
      rejectUnauthorized: false
    }, app)
    : http.createServer(app);
}

var server = createServer(app);

ws(server, appCookieParser);

server.listen(process.env.PORT || '3000');

var io = require('socket.io')(server);
var cote = require('cote');
new cote.Sockend(io, {
  name: 'sockend server'
});

module.exports = server;
