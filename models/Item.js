var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var itemSchema = new mongoose.Schema({
	category_id: {type: Number},
	name: String,
    description: String,
    price: Number,
    quantity: Number,
    discount:{type:Number,default:0},
    retailer_id:Number,
    features:Object
});

itemSchema.plugin(autoIncrement.plugin, { model: 'Item', startAt: 1 });
var Item = mongoose.model('Item', itemSchema);
module.exports = Item; 