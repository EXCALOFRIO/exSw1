const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recursosRouter = require('./routes/recursos');
const loginRouter = require('./routes/login');

const app = express();

// Session info
app.use(session({
  secret: process.env.SERVER_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recursos', recursosRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/:idRecurso/:idActivo', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next()
});

module.exports = app;
