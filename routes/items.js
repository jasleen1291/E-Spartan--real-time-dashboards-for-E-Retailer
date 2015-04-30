var q = require("q");
var socket = require('../app');

module.exports = function(router) {

    var ItemSchema = require('../models/Item');
    var accessDeniedMsg = "Access Denied! You need to be logged in to perform this operation.";

    var findUserObj = {
        findUser: function(userid) {
            var deffered = q.defer();
            console.log("finding user with userid " + userid);
            var UserSchema = require('../models/User');
            UserSchema.findOne({
                user_id: userid
            }, function(err, user) {
                if (err) {
                    console.log("Error occured: " + err);
                    deffered.resolve("Error");
                } else {
                    console.log("User found");
                    deffered.resolve(user);
                }
            });
            return deffered.promise;
        }
    }


    router.get('/ui/featuredItems', function(req, res, next) {
        var ItemSchema = require('../models/Item');
        ItemSchema.find({
            discount: {
                $gt: 0
            }
        }, function(err, featuredItems) {
            if (!err) {
                res.json({
                    type: true,
                    data: featuredItems
                });
            } else {
                console.log(err);
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            }
        });
    });

    router.get('/ui/itemBrands', function(req, res, next) {
        var ItemSchema = require('../models/Item');
        ItemSchema.aggregate([{
            $match: {
                "features.Brand": {
                    $exists: true
                }
            }
        }, {
            $group: {
                _id: "$features.Brand",
                count: {
                    $sum: 1
                }
            }
        }], function(err, brands) {
            if (!err) {
                res.json({
                    type: true,
                    data: brands
                });
            } else {
                console.log(err);
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            }
        });
    });

    //create single item

    router.post('/item/create', function(req, res, next) {
        var ItemSchema = require('../models/Item');
        console.log("Creating New Item");
        console.log(req.body);
        if (!req.session.user || req.session.user.role != "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
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
                        console.log('The item already exists');
                        res.json({
                            type: false,
                            data: "The item already exists!"
                        });
                    } else {
                        console.log(req.body);
                        var itemModel = new ItemSchema();
                        itemModel.name = req.body.name;
                        itemModel.description = req.body.description;
                        itemModel.price = req.body.price;
                        itemModel.quantity = req.body.quantity;
                        itemModel.category_id = req.body.category_id;
                        itemModel.retailer_id = req.session.user.user_id;
                        //console.log("retailer_id:" + retailer_id);
                        itemModel.discount = req.body.discount;
                        try {
                            itemModel.features = JSON.parse(req.body.features);
                            itemModel.save(function(err, item) {
                                if (!err) {
                                    console.log("New Item Added");
                                    //console.log(item);
                                    res.json({
                                        type: true,
                                        data: item
                                    });
                                } else {
                                    console.log("Error Adding Data: " + err);
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
        }
    });

    // get all the items
    router.get('/item', function(req, res) {
        var ItemSchema = require('../models/Item');
        if (!req.session.user || req.session.user.role != "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            return ItemSchema.find(function(err, items) {
                if (!err) {
                    return res.send(items);
                } else {
                    return console.log(err);
                }
            });
        }
    });

    // get item by Id.
    router.get('/item/:id', function(req, res) {
        var ItemSchema = require('../models/Item');
        if (!req.session.user || req.session.user.role != "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            return ItemSchema.findById(req.params.id, function(err, item) {
                if (!err) {
                    return res.send(item);
                } else {
                    return console.log(err);
                }
            });
        }
    });


    // update item by Id
    router.put('/item/update/:id', function(req, res) {
        var ItemSchema = require('../models/Item');
        if (!req.session.user || req.session.user.role != "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            return ItemSchema.findById(req.params.id, function(err, item) {
                item.name = req.body.name;
                item.description = req.body.description;
                item.price = req.body.price;
                item.quantity = req.body.quantity;
                item.category_id = req.body.category_id;
                item.discount = req.body.discount;
                //item.retailer_id = req.body.retailer_id;
                try {
                    item.features = JSON.parse(req.body.features);
                    item.save(function(err, item) {
                        if (!err) {
                            console.log("Item Updated");
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
        }
    });

    //Getting list of items for retailer - retailerid
    router.get('/retailer/:retailerid/item', function(req, res) {
        var ItemSchema = require('../models/Item');
        var UserSchema = require('../models/User');

        var findUserRequest = findUserObj.findUser(req.params.retailerid);
        if (!req.session.user) {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            var findUserRequest = findUserObj.findUser(req.params.userid);
            findUserRequest.done(function(data) {
                if (data == "Error") {
                    res.json({
                        type: false,
                        data: "User not found"
                    });
                } else {
                    console.log("User found");
                    console.log("Finding Items for retailer " + req.params.retailerid);
                    ItemSchema.find({
                        retailer_id: req.params.retailerid
                    }, function(err, items) {
                        if (err) {
                            res.json({
                                type: false,
                                data: null
                            });
                        } else {
                            console.log("returning items");
                            res.json({
                                type: true,
                                data: items
                            });
                        }
                    });
                }
            });
        }
    });

    // delete item by Id
    router.delete('/item/delete/:id', function(req, res) {
        var ItemSchema = require('../models/Item');
        if (!req.session.user || req.session.user.role != "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            return ItemSchema.findById(req.params.id, function(err, item) {
                return item.remove(function(err) {
                    if (!err) {
                        console.log("Item Deleted");
                        return res.send('');
                    } else {
                        console.log(err);
                    }
                });
            });
        }
    });
}