var q = require("q");
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
                    console.log("User found");
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
                    OrderSchema.findOne({
                        orderid: Number(req.params.orderid)
                    }, function(err, order) {
                        if (err) {
                            res.json({
                                type: false,
                                data: err
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
                    console.log("Finding orders for user " + req.params.orderid);
                    OrderSchema.findOne({
                        orderid: Number(req.params.orderid)
                    }, function(err, order) {
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
        console.log(req.params.userid);
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
                OrderSchema.findOne({
                    orderid: Number(req.params.orderid)
                }, function(err, order) {
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

    //get Average Sales By Month
    router.get('/getAvgSalesByMonth', function(req, res) {
        console.log("getAvgSalesByMonth API called");
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
                status: {
                    $nin: ["Cancelled", "cancelled"]
                }
            }
        }, {
            $group: {
                _id: "$month",
                avg: {
                    $avg: "$total"
                }
            }
        }], function(err, result) {
            console.log(result);
            res.send(result);
        });
    });

    //get Average Sales By Year
    router.get('/getAvgSalesByYear', function(req, res) {
        console.log("getAvgSalesByYear API called");
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
                status: {
                    $nin: ["Cancelled", "cancelled"]
                }
            }
        }, {
            $group: {
                _id: "$year",
                avg: {
                    $avg: "$total"
                }
            }
        }], function(err, result) {
            console.log(result);
            res.send(result);
        });
    });

    //get Total Sales By Year
    router.get('/getTotalSalesByYear', function(req, res) {
        console.log("getTotalSalesByYear API called");
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
                status: {
                    $nin: ["Cancelled", "cancelled"]
                }
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

    //get Total Sales By Month
    router.get('/getTotalSalesByMonth', function(req, res) {
        console.log("getTotalSalesByMonth API called");
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
                status: "$status",
                retailer_id: "$retailerid",
                total: {
                    $multiply: ["$price", "$quantity"]
                }
            }
        }, {
            $match: {
                year: Number(yr),
                retailer_id: Number(rid),
                status: {
                    $nin: ["Cancelled", "cancelled"]
                }
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
    
    //get Sales Trends
    router.get('/getSalesTrends', function(req, res) {
        console.log("getSalesTrends API called");
        var date = new Date();
        date.setDate(date.getDate() - 30);
        //console.log(date);
        var updatedAtQuery = {}
        if (req.query.startDate && req.query.endDate) {
            updatedAtQuery["$gte"] = new Date(Date.parse(req.query.startDate));
            updatedAtQuery["$lte"] = new Date(Date.parse(req.query.endDate));
        } else {
            updatedAtQuery["$gte"] = date;
        }

        var rid = req.query.retailerid;

        var OrderSchema = require('../models/Order');
        OrderSchema.aggregate(
            [

                {
                    $match: {
                        retailerid: Number(req.query.retailerid),
                        "updated_at": updatedAtQuery
                    }
                }, {
                    $project: {
                        "date": "$updated_at",
                        "sale": {
                            $multiply: ["$price", "$quantity"]
                        },
                        "_id": 0
                    }
                },{
                    $sort: {
                        "date" : 1
                    }
                }

            ],
            function(err, result) {
                if (!err)
                    res.send(result);
                else {
                    res.send(err);
                }
            });
    });
    
    //get Top Products
    router.get('/getTopProducts', function(req, res) {
        console.log("getTopProducts API called");
        var date = new Date();
        var year = date.getFullYear(),
            month = date.getMonth() + 1;
        if (req.query.year) {
            year = Number(req.query.year);
        }
        if (req.query.month) {
            month = Number(req.query.month);
        }
        var OrderSchema = require('../models/Order');

        OrderSchema.aggregate(
            [{
                $project: {
                    year: {
                        $year: "$updated_at"
                    },
                    month: {
                        $month: "$updated_at"
                    },
                    item_id: "$item_id",
                    retailer_id: "$retailerid",
                    qty: "$quantity"
                }
            }, {
                $match: {
                    year: year,
                    month: month,
                    retailer_id: Number(req.query.retailerid),
                    status: {
                        $nin: ["Cancelled", "cancelled"]
                    }
                }
            }, {
                $group: {
                    _id: "$item_id",
                    qty: {
                        $sum: "$qty"
                    }
                }
            }, {
                $sort: {
                    qty: -1
                }
            }, {
                $limit: 5
            }], function(err, result) {
                // var findItemRequest = findItemName.findItem(result);
                // findItemRequest.done(function(data) {

                    if (!err){
                       
                        prettyify(result,req,res);
                    }
                    else {
                        res.send(err);
                    }
                // });
            });
    });
    
    //get Sale by Location
    router.get("/getSaleByLocation", function(req, res) {
        console.log("getSaleByLocation API called");
        var match = {

            status: {
                $nin: ["Cancelled", "cancelled"]
            }
        };
        if (req.query.year) {
            match["year"] = Number(req.query.year);
            // if (req.query.month)
            //     match["month"] = Number(req.query.month);

        }
        match["retailer_id"] = Number(req.query.retailerid);
        var OrderSchema = require('../models/Order');
        OrderSchema.aggregate([{
            $project: {
                year: {
                    $year: "$updated_at"
                },
                // month: {
                //     $month: "$updated_at"
                // },
                item_id: "$item_id",
                retailer_id: "$retailerid",
                state: "$shippingAddress.State",
                total: {
                    $multiply: ["$price", "$quantity"]
                },
                qty: "$quantity"
            }
        }, {
            $match: match
        }, {
            $group: {
                _id: "$state",

                qty: {
                    $sum: "$total"
                }
            }
        }], function(err, result) {
            if (!err)
                res.send(result);
            else {
                res.send(err);
            }
        });
    });
    
    //get Sale by State
    router.get("/getSaleByLocation/:state", function(req, res) {
        console.log("getSaleByLocation:" + req.params.state + " API called");
        var match = {

            status: {
                $nin: ["Cancelled", "cancelled"]
            },
            state: req.params.state
        };
        if (req.query.year) {
            match["year"] = Number(req.query.year);
            if (req.query.month)
                match["month"] = Number(req.query.month);

        }
        match["retailer_id"] = Number(req.query.retailerid);
        var OrderSchema = require('../models/Order');
        OrderSchema.aggregate([{
            $project: {
                year: {
                    $year: "$updated_at"
                },
                month: {
                    $month: "$updated_at"
                },
                item_id: "$item_id",
                retailer_id: "$retailerid",
                state: "$shippingAddress.State",
                city: "$shippingAddress.City",
                total: {
                    $multiply: ["$price", "$quantity"]
                },
                qty: "$quantity"
            }
        }, {
            $match: match
        }, {
            $group: {
                _id: "$city",

                qty: {
                    $sum: "$total"
                }
            }
        }], function(err, result) {
            if (!err)
                res.send(result);
            else {
                res.send(err);
            }
        });
    });

    function saveOrder(req, res, order) {
        console.log(req.data);
        //Added if statements so that anything doesnt get set to undefined by accident
        if (req.params.userid)
            order.userid = req.params.userid;
        if (req.body.retailerid)
            order.retailerid = req.body.retailerid;
        if (req.body.item_id)
            order.item_id = req.body.item_id;
        if (req.body.quantity)
            order.quantity = req.body.quantity;
        if (req.body.price)
            order.price = req.body.price;
        try {
            if (req.body.shippingAddress)
                order.shippingAddress = JSON.parse(req.body.shippingAddress);
        } catch (e) {
            console.log("Error" + e);
        }
        if (req.body.receipientName)
            order.receipientName = req.body.receipientName;
        if (req.body.receipientPhoneNumber)
            order.receipientPhoneNumber = req.body.receipientPhoneNumber;
        if (req.body.creditCard)
            order.creditCard = req.body.creditCard;
        if (!req.body.status)
            order.status = "Pending";
        else
            order.status = req.body.status;
        console.log(req.body);
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
    function prettyify(result,req,res)
    {
        var ids={};
        var id=[]
        for(i=0;i<result.length;i++)
        {
            ids[result[i]._id]=result[i];
            id.push(Number(result[i]._id));
        }
        var Item = require('../models/Item');
        Item.find({_id:{$in:id}},function(err,result)
            {
                if(!err)
                {   var results=[]
                    for(i=0;i<result.length;i++)
                    {
                        //ids[result[i]._id].push(result[i]);
                        var r= JSON.parse(JSON.stringify(result[i]));
                        r["qty"]=ids[result[i]._id].qty;
                        console.log(typeof result[i]);
                        results.push(r);
                    }
                    res.send(results);
                }else{
                    res.send(err);
                }
            });
    }
}