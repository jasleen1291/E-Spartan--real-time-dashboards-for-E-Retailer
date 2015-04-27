var formidable = require('formidable');
var fs = require('fs-extra');
var qt = require('quickthumb');
var util = require('util');

module.exports = function(router) {

	router.post('/uploadphoto', function(req, res, next) {
		  var form = new formidable.IncomingForm();
		  form.parse(req, function(err, fields, files) {
		  	if(err) {
		  		res.json({
                	type: false,
                	data: "Error:" + err
            	});	
		  	}
		    //res.writeHead(200, {'content-type': 'text/plain'});
		    //res.write('received upload:\n\n');
		    //res.end(util.inspect({fields: fields, files: files}));
		    res.json({
                type: true,
                data: "File has been uploaded!"
            });
		  });

		  form.on('end', function(fields, files) {
		    /* Temporary location of our uploaded file */
		    var temp_path = this.openedFiles[0].path;
		    /* The file name of the uploaded file */
		    var file_name = this.openedFiles[0].name;
		    /* Location where we want to copy the uploaded file */
		    var new_location = 'F:\\Workspace\\280-Project\\CMPE280\\public\\images\\uploads\\';
		    
		    //fs.copy(temp_path, new_location + req.body.form.userName + "_" + file_name, function(err) {  
		    fs.copy(temp_path, new_location + file_name, function(err) {  
		      if (err) {
		        console.error(err);
		        res.json({
                	type: false,
                	data: "Error:" + err
            	});	
		      } else {
		        console.log("success!")
		      }
		    });
		  });
		});


	router.get('/uploadphotoform', function(req, res, next) {
		res.writeHead(200, {'Content-Type': 'text/html' });
  		var form = '<form action="/api/uploadphoto" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="text" name="userName" hidden="hidden" value="mariovinay" /><input type="submit" value="Upload" /></form>';
  		res.end(form); 
	});	
	
}