var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var ratingSchema = new mongoose.Schema({
    item_id: Number,
    stars: Number,
    user_id: Number,
    comments: String,
    rated_on: Date
});

var Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;