var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection=mongoose.connect('mongodb://cmpe280:cmpe280@ds061651.mongolab.com:61651/cmpe280');
autoIncrement.initialize(connection);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('./models/User');
require('./models/Item');
require('./models/Category');
require('./models/Rating');

//Routes for APIS
var router=express.Router();
var userRoutes=require('./routes/users')(router);
require('./routes/cart')(router);
require('./routes/items')(router);
require('./routes/orders')(router);
require('./routes/category')(router);
//require('./routes/rating')(router);

//Routes for Pages
require('./routes/index')(router);

var port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/api',router);
var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir)); 

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection error: Unable to connect. Resolve connection issue before starting application'));
db.once('open', dbListening);
app.on('error', appError);

function dbListening() {
  console.log("Successfully connected to MongoDB!");
  var server = app.listen(port, function() {
  console.log("Successfully started application");
	  var host = server.address().address;
	  var port = server.address().port;
      console.log('Application Listening at http://%s:%s', host, port);
    });
  }

function appError(error) {
	console.log("Application startup failure.");
	 if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}