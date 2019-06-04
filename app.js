/* eslint-disable */
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let stylus = require('stylus');

let indexRouter = require('./api/routes/index');
let downloadUnsplashData = require('./api/routes/download');
let usersRouter = require('./api/routes/users');
let birds = require('./api/routes/birds');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));

// Trying the middle ware
// if (app.get('env') === 'development') {
  // Will add this probbaly later to hide in production
// }
// const webpack = require('webpack');
// const webpackConfig = require('./config/webpack.dev.js');
// var compiler = webpack(webpackConfig);

// app.use(require("webpack-dev-middleware")(compiler, {
//     noInfo: true, publicPath: webpackConfig.output.publicPath
// }));

// app.use(require("webpack-hot-middleware")(compiler));

// Trying the middle ware END

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/download', downloadUnsplashData);
app.use('/birds', birds);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
