var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var categorySchema = new mongoose.Schema({
    category_id: {type: Number},
	name: String,
    description: String,
    isDeleted: Boolean,
    parent_id: Number
});

categorySchema.plugin(autoIncrement.plugin, { model: 'Category', field: 'category_id', startAt: 1 });
var Category = mongoose.model('Category', categorySchema);