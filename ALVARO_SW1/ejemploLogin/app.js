const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const restrictedRouter = require('./routes/restricted');
const carritoRouter = require('./routes/carrito');
const eliminarCarritoRouter = require('./routes/eliminarCarrito');
const cookiesAceptarRouter = require('./routes/cookiesAceptar');
const cookiesRechazarRouter = require('./routes/cookiesRechazar');
const chatRouter = require('./routes/chat');

const app = express();
app.locals.title = "Tu tienda de productos robados por negros de confianza";
app.locals.cookies = false;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "La frase que querais",
  resave: false,
  saveUninitialized: true
}));
app.use((req, res, next) => {
  const message = req.session.message;
  const error = req.session.error;
  delete req.session.message;
  delete req.session.error;
  res.locals.message = "";
  res.locals.error = "";
  if (message) res.locals.message = `<p>${message}</p>`;
  if (error) res.locals.error = `<p>${error}</p>`;
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/carrito', restricted, carritoRouter);
app.use('/eliminarCarrito', restricted, eliminarCarritoRouter);
app.use('/restricted', restricted, restrictedRouter);
app.use('/chat', restricted, chatRouter);
app.use('/cookiesAceptar', cookiesAceptarRouter);
app.use('/cookiesRechazar', cookiesRechazarRouter);


app.use("/logout", (req, res) => {
  req.session.destroy();
  req.app.locals.cookies = false;
  res.redirect("/");
});

app.use('/logout2', (req, res) => {
  req.session.destroy();
  req.app.locals.cookies = false;
  res.redirect("/");
});

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("login");
  }
}

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
  res.render('error');
});

module.exports = app;
