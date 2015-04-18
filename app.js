var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var autoIncrement = require('mongoose-auto-increment');

var connection=mongoose.connect('mongodb://cmpe280:cmpe280@ds061651.mongolab.com:61651/cmpe280');
autoIncrement.initialize(connection);

require('./models/User');
require('./models/Item');
require('./models/Category');
require('./models/Rating');

//Routes for APIS

var router=express.Router();
var userRoutes=require('./routes/users')(router);

var app = express();
var port = 80;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api',router);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//mongoose.createConnection('mongodb://cmpe280:cmpe280@ds061651.mongolab.com:61651/cmpe280');

//Routes for APIS

app.listen(port);

