var q=require("q");
module.exports = function(router) {

    router.get('/user', function(req, res) {
        var UserSchema = require('../models/User');

        console.log("Getting list of users");
        return UserSchema.find(function(err, users) {
            if (!err) {
                return res.send(users);
            } else {
                return console.log(err);
            }
        });

    });

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
                    deffered.resolve(user);
                }
            });
            return deffered.promise;
        }
    }

    //Creating order for user - userid
    router.post('/user/:userid/order/create', function(req, res, next) {
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');

        var findUserRequest = findUserObj.findUser(req.params.userid);
        findUserRequest.done(function(data) {
            if (data == "Error") {
                res.json({
                    type: false,
                    data: "User not found"
                });
            } else {
                console.log('Creating Order');
                console.log(req.data);
                var orderModel = new OrderSchema();
                saveOrder(req, res, orderModel);
            }

        });

    });

    //Getting list of orders for user - userid
    router.get('/user/:userid/order', function(req, res) {
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');

        var findUserRequest = findUserObj.findUser(req.params.userid);
        findUserRequest.done(function(data) {
            if (data == "Error") {
                res.json({
                    type: false,
                    data: "User not found"
                });
            } else {
                console.log("User found");
                console.log("Finding orders for user " + req.params.userid);
                OrderSchema.find({
                    userid: req.params.userid
                }, function(err, orders) {
                    if (err) {
                        res.json({
                            type: false,
                            data: null
                        });
                    } else {
                        res.json({
                            type: true,
                            data: orders
                        });
                    }
                });
            }
        });

        //        UserSchema.findOne({user_id:req.params.userid}, function(err, user){
        //            if(err){
        //                 res.json({
        //                        type: false,
        //                        data: "User not found"
        //                 });
        //            }
        //            else{
        //                if(user){
        //                }
        //            }            
        //        });
    });


    //Getting a specific order for user - userid
    router.get('/user/:userid/order/:orderid', function(req, res) {
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');

        UserSchema.findOne({
            user_id: req.params.userid
        }, function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "User not found"
                });
            } else {
                if (user) {
                    console.log("User found");
                    console.log("Finding orders for user " + req.params.userid);
                    OrderSchema.findById(req.params.orderid, function(err, order) {
                        if (err) {
                            res.json({
                                type: false,
                                data: null
                            });
                        } else {
                            res.json({
                                type: true,
                                data: order
                            });
                        }
                    });
                }
            }
        });
    });

    //cancelling a order
    router.put('/user/:userid/order/cancel/:orderid', function(req, res) {
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');

        UserSchema.findOne({
            user_id: req.params.userid
        }, function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "User not found"
                });
            } else {
                if (user) {
                    console.log("User found");
                    console.log("Finding orders for user " + req.params.userid);
                    OrderSchema.findById(req.params.orderid, function(err, order) {
                        if (err) {
                            res.json({
                                type: false,
                                data: "No order found for this id"
                            });
                        } else {
                            order.status = "Cancelled";
                            order.save(function(err, order) {
                                if (err) {
                                    res.json({
                                        type: false,
                                        data: "Error Occurred :" + err
                                    });
                                } else {
                                    res.json({
                                        type: true,
                                        data: order
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    //updating order
    router.put('/user/:userid/order/update/:orderid', function(req, res) {
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');

        var findUserRequest = findUserObj.findUser();
        findUserRequest.done(function(data) {
            if (data = "Error") {
                res.json({
                    type: false,
                    data: "User not found"
                });
            } else {
                console.log("User found");
                console.log("Finding orders for user " + req.params.userid);
                OrderSchema.findById(req.params.orderid, function(err, order) {
                    if (err) {
                        res.json({
                            type: false,
                            data: "No order found for this id"
                        });
                    } else {
                        if (order.status != 'Shipped') {
                            console.log('Update Order');
                            saveOrder(req, res, order);
                        }
                    }
                });
            }
        });
    });
    router.get('/getAvgSalesByMonth', function(req, res) {
        var yr = req.query.year;
        var rid = req.query.retailerid;

        var OrderSchema = require('../models/Order');
        OrderSchema.aggregate([{
            $project: {
                year: {
                    $year: "$updated_at"
                },
                month: {
                    $month: "$updated_at"
                },
                retailer_id: "$retailerid",
                total: {
                    $multiply: ["$price", "$quantity"]
                }
            }
        }, {
            $match: {
                year: Number(yr),
                retailer_id: Number(rid),
                status:{$nin:["Cancelled","cancelled"]}
            }
        }, {
            $group: {
                _id: "$month",
                avg: {
                    $avg: "$total"
                }
            }
        }], function(err, result) {
            res.send(result);
        });
    });
    router.get('/getAvgSalesByYear', function(req, res) {
        var rid = req.query.retailerid;

        var OrderSchema = require('../models/Order');
        OrderSchema.aggregate([{
            $project: {
                year: {
                    $year: "$updated_at"
                },
                retailer_id: "$retailerid",
                total: {
                    $multiply: ["$price", "$quantity"]
                }
            }
        }, {
            $match: {
                retailer_id: Number(rid),
                status:{$nin:["Cancelled","cancelled"]}
            }
        }, {
            $group: {
                _id: "$year",
                avg: {
                    $avg: "$total"
                }
            }
        }], function(err, result) {
            res.send(result);
        });
    });
    router.get('/getTotalSalesByYear', function(req, res) {
        var rid = req.query.retailerid;

        var OrderSchema = require('../models/Order');
        OrderSchema.aggregate([{
            $project: {
                year: {
                    $year: "$updated_at"
                },
                retailer_id: "$retailerid",
                total: {
                    $multiply: ["$price", "$quantity"]
                }
            }
        }, {
            $match: {
                retailer_id: Number(rid),
                status:{$nin:["Cancelled","cancelled"]}
            }
        }, {
            $group: {
                _id: "$year",
                sum: {
                    $sum: "$total"
                }
            }
        }], function(err, result) {
            res.send(result);
        });
    });
    router.get('/getTotalSalesByMonth', function(req, res) {
        var yr = req.query.year;
        var rid = req.query.retailerid;

        var OrderSchema = require('../models/Order');
        OrderSchema.aggregate([{
            $project: {
                year: {
                    $year: "$updated_at"
                },
                month: {
                    $month: "$updated_at"
                },
                status:"$status",
                retailer_id: "$retailerid",
                total: {
                    $multiply: ["$price", "$quantity"]
                }
            }
        }, {
            $match: {
                year: Number(yr),
                retailer_id: Number(rid),
                status:{$nin:["Cancelled","cancelled"]}
            }
        }, {
            $group: {
                _id: "$month",
                sum: {
                    $sum: "$total"
                }
            }
        }], function(err, result) {
            res.send(result);
        });
    });

router.get('/getSalesTrends', function(req, res) {
        var date=new Date();
        date.setDate(date.getDate()-30);
        var updatedAtQuery={}
        if(req.query.startDate&&req.query.endDate)
        {
            updatedAtQuery["$gte"]=new Date(Date.parse(req.query.startDate));
            updatedAtQuery["$lte"]=new Date(Date.parse(req.query.endDate));
        }else{
             updatedAtQuery["$gte"]=date;
        }
        
        var rid = req.query.retailerid;

        var OrderSchema = require('../models/Order');
        OrderSchema.aggregate(
                [

                    { 
                        $match:{
                            retailerid: Number(1),
                            "updated_at":
                                updatedAtQuery
                            }
                    },
                    {   
                        $project:{
                            "date":"$updated_at",
                            "sale":{$multiply:["$price","$quantity"]},
                            "_id":0
                            }
                    }
   
    ]
, function(err, result) {
    if(!err)
            res.send(result);
        else{
            res.send(err);
        }
        });
   
});


function saveOrder(req, res, order) {
    console.log(req.data);
    order.userid = req.params.userid;
    order.retailerid = req.body.retailerid;
    order.item_id=req.body.item_id,
    order.quantity=req.body.quantity, 
    order.price=req.body.price ,
    order.shippingAddress = req.body.shippingAddress;
    order.receipientName = req.body.receipientName;
    order.receipientPhoneNumber = req.body.receipientPhoneNumber;
    order.creditCard = req.body.creditCard;
    order.status = "Pending";

    order.save(function(err, order) {
        if (err) {
            res.json({
                type: false,
                data: "Error Occurred :" + err
            });
        } else {
            res.json({
                type: true,
                data: order
            });
        }
    });
}
}