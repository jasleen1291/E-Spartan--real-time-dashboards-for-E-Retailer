var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var CartItem = new Schema({ item:Object,quantity:Number,price:Number,discountedPrice:Number });
var cart = new mongoose.Schema({
	user_id:Number,
	items:[CartItem],
	total:Number
});

cart.plugin(autoIncrement.plugin, { model: 'Item', startAt: 1 });
var item = mongoose.model('Item', cart);
module.exports = item;