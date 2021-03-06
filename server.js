var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var mongoose=require('mongoose');

mongoose.connect('mongodb://cmpe280:cmpe280@ds061651.mongolab.com:61651/cmpe280');

//--------------------------------Default methods------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//----------------------------Creating http server-----------------------------


var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Website listening at http://%s:%s', host, port)

});




module.exports = app;

