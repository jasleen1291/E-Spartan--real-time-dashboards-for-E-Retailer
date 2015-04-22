module.exports = function(router) {
  router.post('/addToCart', function(req, res, next) {
                            var Cart = require("../models/Cart");
                            Cart.findOne({
                                user_id: req.body.userid
                            }, function(err, doc) {
                                if (err) {
                                    res.send({
                                        type: false,
                                        message: "Error" + err
                                    });
                                } else {
                                    if (doc) {
                                        callback(doc);

                                    } else {
                                        var cart = new Cart({
                                            user_id: req.body.userid,
                                            items: []
                                        });
                                        cart.save(function(err, doc) {
                                            if (err)
                                                res.send({
                                                    type: false,
                                                    message: "Error" + err
                                                });
                                            else
                                                callback(doc);
                                        });
                                    }
                                }

                                function callback(cart) {
                                    try {
                                        var items = cart.items;
                                        var item = JSON.parse(req.body.item);
                                        console.log(
                                            "item:");
                                         console.log(   item);
                                        items.push(item);

                                        cart.user_id = req.body.userid;
                                        cart.total = cart.total + (item.price * item.quantity);
                                        
                                        cart.save(function(err, doc) {
                                            if (err)
                                                res.send({
                                                    type: false,
                                                    message: "Error" + err
                                                });
                                            else
                                                res.send({
                                                    type: true,
                                                    message: "Ok"
                                                });
                                        });
                                    } catch (e) {
                                        res.send({
                                            type: false,
                                            message: "Error Invalid JSON for items"
                                        });
                                    }



                                }
                            });

                        });

        router.put('/updateCart', function(req, res, next) {
            var Cart = require("../models/Cart");
            Cart.findOne({
                user_id: req.body.userid
            }, function(err, doc) {
                if (err) {
                    res.send({
                        type: false,
                        message: "Error" + err
                    });
                } else {
                    if (doc) {
                        callback(doc);
                        //console.log(doc);
                    } else {
                        res.send({
                            type: false,
                            message: "Cart not found"
                        });
                    }
                }

                function callback(cart) {
                    try {


                        var items = JSON.parse(req.body.items);
                        var total = 0;
                        for (q = 0; q < items.length; q++) {
                            //console.log(items[q].quantity * items[q].price);
                            total = total + (items[q].quantity * items[q].price);
                        }
                        cart.total = total;
                        cart.items = JSON.parse(req.body.items);
                        cart.save(function(err, doc) {
                            if (err)
                                res.send({
                                    type: false,
                                    message: "Error" + err
                                });
                            else
                                res.send({
                                    type: true,
                                    message: "Ok"
                                });
                        });
                    } catch (e) {
                        res.send({
                            type: false,
                            message: "Error Invalid JSON for items"
                        });
                    }



                }
            });

        });
        router.put('/deleteItemFromCart', function(req, res, next) {
                    var Cart = require("../models/Cart");
                    Cart.findOne({
                            user_id: req.body.userid
                        }, function(err, doc) {
                            if (err) {
                                res.send({
                                    type: false,
                                    message: "Error" + err
                                });
                            } else {
                                if (doc) {
                                    callback(doc);

                                } else {
                                    res.send({
                                        type: false,
                                        message: "Cart not found"
                                    });
                                }
                            }

                            function callback(cart) {
                                try {

//console.log(1);
                                    var items = cart.items;
                                    var index = -1;
                                    for (q = 0; q < items.length; q++) {

                                        if (items[q].itemid === req.body.itemid) {
                                            index = q;
                                            break;
                                        }
                                    }
                                    //console.log(2);
                                    if (index === -1) {
                                        res.send({
                                            type: false,
                                            message: "Item not found"
                                        });
                                    } else {
                                        //console.log(index);
                                        items.splice(index,1);
                                        //console.log(items);
                                        var total = 0;
                                        for (q = 0; q < items.length; q++) {
                                            //console.log(items[q]);
                                            total = total + (items[q].quantity * items[q].price);
                                        }
                                        //console.log(4);
                                        cart.total = total;
                                        cart.items = items;
                                        cart.save(function(err, doc) {
                                            if (err)
                                                res.send({
                                                    type: false,
                                                    message: "Error" + err
                                                });
                                            else
                                                res.send({
                                                    type: true,
                                                    message: "Ok"
                                                });
                                        });




                                    }

                            }
                                catch(e)
                                    {
                                        res.send({
                                                    type: false,
                                                    message: e
                                                });
                                    }

                            }
                        });

                           });
router.put('/emptyCart', function(req, res, next) {
                    var Cart = require("../models/Cart");
                    Cart.findOne({
                            user_id: req.body.userid
                        }, function(err, doc) {
                            if (err) {
                                res.send({
                                    type: false,
                                    message: "Error" + err
                                });
                            } else {
                                if (doc) {
                                    callback(doc);

                                } else {
                                    res.send({
                                        type: false,
                                        message: "Cart not found"
                                    });
                                }
                            }

                            function callback(cart) {
                                try {

//console.log(1);
                                    
                                        cart.total = 0;
                                        cart.items = [];
                                        cart.save(function(err, doc) {
                                            if (err)
                                                res.send({
                                                    type: false,
                                                    message: "Error" + err
                                                });
                                            else
                                                res.send({
                                                    type: true,
                                                    message: "Ok"
                                                });
                                        });




                                    }

                            
                                catch(e)
                                    {
                                        res.send({
                                                    type: false,
                                                    message: e
                                                });
                                    }

                            }
                        });

                           });


}