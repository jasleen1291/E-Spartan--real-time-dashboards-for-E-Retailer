var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var userSchema = new mongoose.Schema({
    user_id: Number,
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	firstname: String,
	lastname: String,
    retailer: Boolean,
    created_at:Date,
	updated_at:Date
});

userSchema.plugin(autoIncrement.plugin, { model: 'User', startAt: 1 });
var User = mongoose.model('User', userSchema);