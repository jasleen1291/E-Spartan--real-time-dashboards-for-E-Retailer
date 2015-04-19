var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var cart = new mongoose.Schema({
	user_id:Number,
	items:[{item_id :Number, quantity: Number}],
	total:{type:Number,default:0}
});

cart.plugin(autoIncrement.plugin, { model: 'Cart', startAt: 1 });
var item = mongoose.model('Cart', cart);
module.exports = item;