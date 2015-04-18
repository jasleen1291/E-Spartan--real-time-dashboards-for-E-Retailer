///Rate a product.......


module.exports = function(router) {
    
    var RatingSchema = require('../models/Rating');
    router.post('/rate', function(req, res, next) {
       var RatingSchema = require('../models/Rating');
       var ItemSchema = require('../models/Item');

        ItemSchema.findOne({
            item_id: req.body.item_id
            // description: req.body.description
        }, function(err, item) {
            if (err) {
                console.log('err');
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (item) {
                    console.log('item exists');
                    var ratingModel = new RatingSchema();
                    console.log("data for : " + req.body.item_id);
                    ratingModel.item_id = req.body.item_id;
                    ratingModel.stars = req.body.stars;
                    ratingModel.user_id = req.body.user_id;
                    ratingModel.comments = req.body.comments;
                    ratingModel.rated_on = new Date();
                   
                    ratingModel.save(function(err, rating) {
                        res.json({
                            type: true,
                            data: rating
                        });
                    })

                }

            }
        });
    });




// update item by Id

router.put('/getItem/:id', function (req, res){
    var RatingSchema = require('../models/Rating');
  return RatingSchema.findById(req.params.id, function (err, rating) {
    rating.item_id = req.body.item_id;
    rating.stars = req.body.stars;
    rating.user_id = req.body.user_id;
    rating.comments = req.body.comments;
    rating.rated_on = new Date();
    return rating.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(rating);
    });
  });
});



// delete item by Id
router.delete('/getItem/id', function (req, res){
var RatingSchema = require('../models/Rating');
return RatingSchema.findById(req.params.id, function (err, rating) {
    return rating.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

}