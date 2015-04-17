var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//create a schema
var counters= new Schema(
	{name:String,
	 seq:{type:Number ,default: 0}
});

var User=mongoose.model('Counters',counters);
module.exports=User;
