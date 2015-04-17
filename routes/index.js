var express = require('express');
var router = express.Router();
var mysql = require('mysql');
// var md5 = require('MD5');


router.get('/', function(req, res) {
	res.sendfile('public/html/LandingPage.html');
});
router.get('/LandingPage.html', function(req, res) {
	res.sendfile('public/html/LandingPage.html');
});

router.get('/BigDataPage.html', function(req, res) {
	res.sendfile('public/html/BigDataPage.html');
});
router.get('/IOTPage.html', function(req, res) {
	res.sendfile('public/html/IOTPage.html');
});
router.get('/LocationPage.html', function(req, res) {
	res.sendfile('public/html/LocationPage.html');
});
router.get('/ManagementPage.html', function(req, res) {
	res.sendfile('public/html/ManagementPage.html');
});


  router.post('/savedata', function (req, res) {
  //res.send('Got a POST request');
  var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'tania',
  password : 'password',
  port : 3306, //port mysql
  database:'registerdb'
  });

  console.log("Reached in savedata func.");
  var formData = req.body;
  console.log(formData);

    var data = {
            
            Fname: formData.Fname,
            Lname : formData.Lname,
            Email   : formData.Email
    };

    console.log(data);

  connection.connect();

 var CreateQuery="CREATE TABLE saveAsgnData ( Fname VARCHAR(150) PRIMARY KEY NOT NULL, Lname VARCHAR(150), Email VARCHAR(250)); "; 

 connection.query(CreateQuery,function(err,rows){
 	if(err)
 		console.log("Error tada", err);
 });

var query = connection.query("INSERT INTO saveAsgnData set ? ",data, function(err, rows)
        {
  
          if (err)
            console.log("Error inserting  blah blah: %s ",err );

          else{
          	res.send(200);
          }  
          
        });
  connection.end();

});

module.exports = router;
