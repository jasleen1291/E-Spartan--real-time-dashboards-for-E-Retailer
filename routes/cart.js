var socket = require('../app');

module.exports = function(router) {
    var accessDeniedMsg = "Access Denied! You need to be logged in as a normal user of this application to perform this operation.";

    router.get('/loadCartDetails', function(req, res, next) {
        if(!req.session.user || req.session.user.role == "admin" || req.session.user.role == "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            var Cart = require("../models/Cart");
            Cart.findOne({
                user_id: req.session.user.user_id
                }, function(err, doc) {
                    if (err) {
                        console.log("Error in finding cart");
                        res.send({
                            type: false,
                            data: "Error in finding cart" + err
                        });
                    } else {
                        if(doc) {
                            //case: Found cart
                            console.log("Found the cart");
                            res.send({
                                type: true,
                                data: doc
                            });
                        } else {
                            //case: Didnt find cart
                            console.log("Couldnt find the cart");
                            res.send({
                                type: true,
                                data: doc
                            });
                        }    
                    }
                    
            });

        }
    });

    router.post('/addToCart', function(req, res, next) {
        if(!req.session.user || req.session.user.role == "admin" || req.session.user.role == "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            var Cart = require("../models/Cart");
        var Item = require("../models/Item");
        Cart.findOne({
            user_id: req.session.user.user_id
        }, function(err, doc) {
            if (err) {
                res.send({
                    type: false,
                    message: "Error in finding cart" + err
                });
            } else {
                if (doc) {
                    Item.findOne({
                        "_id": req.body.item_id
                    }, function(err, item) {
                        if (err) {
                            res.send({
                                type: false,
                                message: "Error in finding item" + err
                            });
                        } else {
                            if (item) {
                                callback(doc, item);
                            } else {
                                res.send({
                                    type: false,
                                    message: "Item not found"
                                });
                            }
                        }

                    });


                } else {
                    var cart = new Cart({
                        user_id: req.session.user.userid,
                        items: []
                    });
                    cart.save(function(err, doc) {
                        if (err)
                            res.send({
                                type: false,
                                message: "Error in saving to cart" + err
                            });
                        else {
                            Item.findOne({
                                "_id": req.body.item_id
                            }, function(err, item) {
                                if (err) {
                                    res.send({
                                        type: false,
                                        message: "Error in finding item" + err
                                    });
                                } else {
                                    if (item) {
                                        callback(doc, item);
                                    } else {
                                        res.send({
                                            type: false,
                                            message: "Item not found"
                                        });
                                    }
                                }

                            });

                        }
                    });
                }
            }

            function callback(cart, itemF) {
                try {
                    var items = cart.items;
                    var item = req.body;
                    if (item.quantity > itemF.quantity) {
                        res.send({
                            type: false,
                            message: "Cannot add items more than in stock"
                        });
                    } else {
                        itemF.quantity = item.quantity;
                        items.push(itemF);

                        cart.user_id = req.session.user.user_id;
                        cart.total = cart.total + (item.price * item.quantity);
                        //console.log(cart);
                        cart.save(function(err, doc) {
                            if (err)
                                res.send({
                                    type: false,
                                    message: "Error in cart" + err
                                });
                            else
                                res.send({
                                    type: true,
                                    message: "Ok"
                                });
                        });
                    }
                } catch (e) {
                    res.send({
                        type: false,
                        message: "Error Invalid JSON for items"
                    });
                }



            }
        });

        }
    });

    router.put('/updateCart', function(req, res, next) {
        if(!req.session.user || req.session.user.role == "admin" || req.session.user.role == "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            var Cart = require("../models/Cart");
        Cart.findOne({
            user_id: req.session.user.user_id
        }, function(err, doc) {
            if (err) {
                res.send({
                    type: false,
                    message: "Error" + err
                });
            } else {
                if (doc) {
                    callback(doc);
                    ////console.log(doc);
                } else {
                    res.send({
                        type: false,
                        message: "Cart not found"
                    });
                }
            }

            function callback(cart) {
                try {


                    var items = req.body;
                    var total = 0;
                    for (q = 0; q < items.length; q++) {
                        ////console.log(items[q].quantity * items[q].price);
                        total = total + (items[q].quantity * items[q].price);
                    }
                    cart.total = total;
                    cart.items = req.body;
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
        }

    });

    router.put('/deleteItemFromCart', function(req, res, next) {
        if(!req.session.user || req.session.user.role == "admin" || req.session.user.role == "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            var Cart = require("../models/Cart");
        Cart.findOne({
            user_id: req.session.user.user_id
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

                    ////console.log(1);
                    var items = cart.items;
                    var index = -1;
                    for (q = 0; q < items.length; q++) {

                        if (items[q]._id === req.body.itemid) {
                            index = q;
                            break;
                        }
                    }
                    ////console.log(2);
                    if (index === -1) {
                        res.send({
                            type: false,
                            message: "Item not found"
                        });
                    } else {
                        ////console.log(index);
                        items.splice(index, 1);
                        ////console.log(items);
                        var total = 0;
                        for (q = 0; q < items.length; q++) {
                            ////console.log(items[q]);
                            total = total + (items[q].quantity * items[q].price);
                        }
                        ////console.log(4);
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

                } catch (e) {
                    res.send({
                        type: false,
                        message: e
                    });
                }

            }
        });
        }

    });

    router.put('/emptyCart', function(req, res, next) {
        if(!req.session.user || req.session.user.role == "admin" || req.session.user.role == "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
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
                    callback(doc, req, res);

                } else {
                    res.send({
                        type: false,
                        message: "Cart not found"
                    });
                }
            }


        });

        }
        
    });



    function callback(cart, req, res) {
        try {

            ////console.log(1);

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




        } catch (e) {
            res.send({
                type: false,
                message: e
            });
        }

    }

    router.post('/checkout', function(req, res, next) {
        if(!req.session.user || req.session.user.role == "admin" || req.session.user.role == "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            var Cart = require("../models/Cart");
        var Order = require("../models/Order");
        var Item = require("../models/Item");
        Cart.findOne({
            user_id: req.session.user.user_id
        }, function(err, doc) {
            if (err) {
                res.send({
                    type: false,
                    message: "Error" + err
                });
            } else {
                if (doc) {
                    if (doc.items.length > 0) {
                        var orders = [];

                        for (i = 0; i < doc.items.length; i++) {
                            var item = doc.items[i];
                            var order = new Order();
                            order.userid = Number(req.session.user.user_id);
                            order.retailerid = item.retailer_id;
                            order.item_id = item._id;

                            order.quantity = item.quantity;
                            order.price = item.price;
                            try {
                                order.shippingAddress = JSON.parse(req.body.shippingAddress);
                                order.receipientName = req.body.receipientName;
                                order.receipientPhoneNumber = req.body.receipientPhoneNumber;
                                order.creditCard = req.body.creditCard;
                                order.status = "Pending";
                                orders.push(order);
                                //console.log(order);

                            } catch (e) {
                                //console.log("Error"+e);
                            }


                        }

                        Order.create(orders, onInsert);

                        function onInsert(err, docs) {
                            if (err) {
                                res.send(err);
                            } else {
                                callback(doc, req, res);
                            }
                        }
                    } else {
                        res.send({
                            type: false,
                            message: "No items in cart"
                        });
                    }

                } else {
                    res.send({
                        type: false,
                        message: "Cart not found"
                    });
                }
            }


        });
        socket.socketio.emit('updateDashboard', "");
        }

    });


}