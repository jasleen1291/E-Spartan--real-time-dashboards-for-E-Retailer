var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
//create a schema
var userSchema= new Schema(
	{name:String,
	 username: {type:String,required:true,unique:true},
	password:{type:String,required:true},
	retailer:Boolean,
	created_at:Date,
	updated_at:Date
});
userSchema.plugin(autoIncrement.plugin, 'User');
var User=mongoose.model('User',userSchema);
module.exports=User;

