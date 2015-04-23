module.exports = function(router) {

    var ItemSchema = require('../models/Item');

    //create single item
    
    router.post('/item/create', function(req, res, next) {
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
                    itemModel.retailer_id = req.body.retailer_id;
                    try {
                        itemModel.features = JSON.parse(req.body.features);
                        itemModel.save(function(err, item) {
                            if (!err) {
                                res.json({
                                    type: true,
                                    data: item
                                });
                            } else {
                                res.json({
                                    type: false,
                                    data: err
                                });
                            }
                        });
                    } catch (e) {
                        res.json({
                            type: false,
                            data: e
                        });
                    }
                }
            }
        });
    });

    // get all the items
    router.get('/item', function(req, res) {
        var ItemSchema = require('../models/Item');
        return ItemSchema.find(function(err, items) {
            if (!err) {
                return res.send(items);
            } else {
                return console.log(err);
            }
        });
    });

    // get item by Id.
    router.get('/item/:id', function(req, res) {
        var ItemSchema = require('../models/Item');
        return ItemSchema.findById(req.params.id, function(err, item) {
            if (!err) {
                return res.send(item);
            } else {
                return console.log(err);
            }
        });
    });


    // update item by Id
    router.put('/item/update/:id', function(req, res) {
        var ItemSchema = require('../models/Item');
        return ItemSchema.findById(req.params.id, function(err, item) {
            itemModel.name = req.body.name;
            itemModel.description = req.body.description;
            itemModel.price = req.body.price;
            itemModel.quantity = req.body.quantity;
            itemModel.category_id = req.body.category_id;
            itemModel.retailer_id = req.body.retailer_id;
            try {
                itemModel.features = JSON.parse(req.body.features);
                itemModel.save(function(err, item) {
                    if (!err) {
                        res.json({
                            type: true,
                            data: item
                        });
                    } else {
                        res.json({
                            type: false,
                            data: err
                        });
                    }
                });
            } catch (e) {
                res.json({
                    type: false,
                    data: e
                });
            }
        });
    });


    // delete item by Id
    router.delete('/item/delete/:id', function(req, res) {
        var ItemSchema = require('../models/Item');
        return ItemSchema.findById(req.params.id, function(err, item) {
            return item.remove(function(err) {
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