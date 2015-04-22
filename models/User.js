var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var userSchema = new mongoose.Schema({
    user_id: Number,
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	firstname: String,
	lastname: String,
    role: {type:String,enum:['admin','user','retailer'],default:'user'},
    created_at:Date,
	updated_at:Date
});
// on every save, add the date
userSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updated_at = currentDate;
    userSchema.plugin(autoIncrement.plugin, { model: 'User', startAt: 1 });
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id', startAt: 1 });
var User = mongoose.model('User', userSchema);
module.exports = User;