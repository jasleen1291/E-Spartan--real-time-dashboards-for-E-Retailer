var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var orderSchema = new mongoose.Schema({
	userid:Number,
	retailerid:Number,
	item_id:Number,
	quantity: Number, 
	price: Number ,

	///items:[{item_id:Number, quantity: Number, price: Number }],  //array of items, quantity and their price
    /*
	Changing items from array to item_id, quantity, price, retailer_id because we need 
	stats on retailer id and during checkout a user can have items form various retailers.
    */
    //Total price can be calculated using price and quantity
	shippingAddress:{
		AddressLine1:String,
		AddressLine2:String,
		City:String,
		State:String,
		ZipCode:Number
	},
	
	receipientName:String,
	receipientPhoneNumber:String,
	creditCard:Number,
	created_at:Date,
	updated_at:Date,
    status: String
});
// on every save, add the date
orderSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});
orderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'orderid', startAt: 1 });
var Order = mongoose.model('Order', orderSchema);
module.exports = Order;