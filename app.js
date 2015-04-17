var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var mongoose=require('mongoose');

mongoose.connect('mongodb://cmpe280:cmpe280@ds061651.mongolab.com:61651/cmpe280');

var port = 80;

//Routes for APIS

var router=express.Router();

var userRoutes=require('./routes/users')(router);
app.use('/api',router);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var mongoose=require('mongoose');

mongoose.createConnection('mongodb://cmpe280:cmpe280@ds061651.mongolab.com:61651/cmpe280');

var port = 80;

//Routes for APIS

var router=express.Router();

var userRoutes=require('./routes/users')(router);
app.use('/api',router);
app.listen(port);

