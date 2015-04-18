module.exports = function(router) {
    
    var ItemSchema = require('../models/Item');
    router.post('/createItem', function(req, res, next) {
        var ItemSchema = require('../models/Item');

        ItemSchema.findOne({
            name: req.body.name,
            description: req.body.description
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
    

}