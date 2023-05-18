var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var jwt = require('jsonwebtoken');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var faasRouter = require('./routes/faas');

var app = express();

app.locals.pool = mysql.createPool({
  host: 'localhost',
  user: 'express',
  password: 'express123faas',
  database: 'express',
  connectionLimit: 10
})

app.options('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization');
  res.end('ok')
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/faas', faasRouter);

app.use((req, res, next) => {
  var ignorePath = ['/', '/login', '/randomfuncname', '/favicon.ico', '/main']
  if (ignorePath.includes(req.path)) return next()
  try {
    req.app.locals.decoded = jwt.verify(req.headers.authorization, 'expresswithserverless', {
      ignoreExpiration: true,
      algorithms: 'HS256'
    })
    next();
  }
  catch (err) {
    console.log(err.message)
  }
})

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.message)
  res.send('error');
});

module.exports = app;
