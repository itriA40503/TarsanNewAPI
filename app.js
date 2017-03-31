var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var scribe = require('scribe-js')();

var index = require('./routes/index');
var users = require('./routes/users');
var runad = require('./routes/runad');
var testing = require('./routes/testing');
var webApi = require('./routes/web_api');

var machine = require('./routes/machine_api');
var webLog = require('./routes/webLog_api');
var ad = require('./routes/ad_api');
var msb = require('./routes/msb_install');
var app = express();

var console = process.console; 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(scribe.express.logger());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  saveUninitialized: false,
  resave: true,
  secret: 'Fantastic!,Allons-y!,Geronimo!'
}));

app.use(express.static(path.join(__dirname, 'public')));
//# Serving static files from "public" folder
app.use(express.static('public'));

app.set('trust proxy', true);

app.use('/logs', scribe.webPanel());

app.use('/', index);
app.use('/users', users);
app.use('/runad',runad);
app.use('/testing',testing);
app.use('/msb',msb);
app.use('/web',webApi);

app.use('/machine',machine);
app.use('/webLog',webLog);
app.use('/ad',ad);

// app.use(function(req, res, next) {
//     // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
//     res.setHeader('Access-Control-Allow-Origin', 'http://tarsanad.ddns.net:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//     res.heasetHeaderder('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,  X-Total-Count');

//     //intercepts OPTIONS method
//     if ('OPTIONS' === req.method) {
//       //respond with 200
//       res.send(200);
//     }
//     else {
//     //move on
//       next();
//     }
// });

// app.options("/*", function(req, res, next){
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,  X-Total-Count');

//   res.send(200);
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // console.tag('Error').time().file().myLogger('res.locals.error');
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  let n = Math.floor(Math.random() * 2);
  let errorPage = ['star', 'great'];
  res.render(errorPage[n],{  
   title: err.status,
   status: res.locals.error,
   msg:err.message  
  });
});

module.exports = app;
