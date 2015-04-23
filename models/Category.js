var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var categorySchema = new mongoose.Schema({
	name: String,
    description: String,
    isDeleted: {type:Boolean,default:false},
    parent_id: {type:Number, default:0},
    features:[]
});

categorySchema.plugin(autoIncrement.plugin, { model: 'Category', startAt: 1 });
var Category = mongoose.model('Category', categorySchema);
module.exports = Category; 