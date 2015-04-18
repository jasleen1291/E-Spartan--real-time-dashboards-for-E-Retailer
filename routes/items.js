
//create single item
module.exports = function(router) {
    
    var ItemSchema = require('../models/Item');
    router.post('/createItem', function(req, res, next) {
        var ItemSchema = require('../models/Item');

        ItemSchema.findOne({
            name: req.body.name
        }, function(err, item) {
            if (err) {
                console.log('err');
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (item) {
                    console.log('exists');
                    res.json({
                        type: false,
                        data: "The item already exists!"
                    });
                } else {
                    console.log('new');
                    var itemModel = new ItemSchema();
                    console.log("data: " + req.body.name);
                    itemModel.name = req.body.name;
                    itemModel.description = req.body.description;
                    itemModel.price = req.body.price;
                    itemModel.quantity = req.body.quantity;
                    itemModel.category_id = req.body.category_id;
                   
                    itemModel.save(function(err, user) {
                        res.json({
                            type: true,
                            data: item
                        });
                    })
                }
            }
        });
    });

// get all the items
router.get('/getItem', function (req, res){
var ItemSchema = require('../models/Item');
  return ItemSchema.find(function (err, items) {
    if (!err) {
      return res.send(items);
    } else {
      return console.log(err);
    }
  });
});
    
// get item by Id.
router.get('/getItem/id', function (req, res){
    var ItemSchema = require('../models/Item');
  return ItemSchema.findById(req.params.id, function (err, item) {
    if (!err) {
      return res.send(item);
    } else {
      return console.log(err);
    }
  });
});


// update item by Id
router.put('/getItem/id', function (req, res){
    var ItemSchema = require('../models/Item');
  return ItemSchema.findById(req.params.id, function (err, item) {
    item.title = req.body.name;
    item.description = req.body.description;
    item.style = req.body.price;
    item.title = req.body.quantity;
    item.title = req.body.category_id;
    item.title = req.body.retailer_id;
    return item.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(item);
    });
  });
});


// delete item by Id
router.delete('/getItem/id', function (req, res){
var ItemSchema = require('../models/Item');
return ItemSchema.findById(req.params.id, function (err, item) {
    return item.remove(function (err) {
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