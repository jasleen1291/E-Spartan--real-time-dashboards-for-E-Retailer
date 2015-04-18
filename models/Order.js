var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var orderSchema = new mongoose.Schema({
    
	userid:Number,
	retailerid:Number,
	itemid:Number,
	shippingAddress:{
		AddressLine1:String,
		AddressLine2:String,
		City:String,
		State:String,
		ZipCode:Number
	}
	receipientName:String,
	receipientPhoneNumber:String,
	quantity:Number,
	CreditCard:Number,
	created_at:Date,
	updated_at:Date
});
// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});
orderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'category_id', startAt: 1 });
var Order = mongoose.model('Order', orderSchema);
module.exports = Order;