var q = require('q');
module.exports = function(router) {
    
    
    router.get('/user', function(req, res){
        var UserSchema = require('../models/User');
        
        console.log("Getting list of users");
          return UserSchema.find(function (err, users) {
            if (!err) {
              return res.send(users);
            } else {
              return console.log(err);
            }
          });

    });
    
    var findUserObj = {
        findUser: function(userid){
            var deffered = q.defer();
            console.log("finding user with userid " + userid);
            var UserSchema = require('../models/User');
            UserSchema.findOne({user_id:userid}, function(err, user){
                if(err){
                    console.log("Error occured: " + err);
                    deffered.resolve("Error");
                }else{
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
        findUserRequest.done(function(data){
            if(data=="Error"){
                res.json({
                    type:false,
                    data: "User not found"
                });
            }
            else{
                console.log('Creating Order');
                console.log(req.data);
                var orderModel = new OrderSchema();
                orderModel.userid = req.params.userid;
                orderModel.retailerid = req.body.retailerid;
                orderModel.itemid = req.body.itemid;
                orderModel.shippingAddress = req.body.shippingAddress;
                orderModel.receipientName = req.body.receipientName;
                orderModel.receipientPhoneNumber = req.body.receipientPhoneNumber;
                orderModel.quantity = req.body.quantity;
                orderModel.creditCard = req.body.creditCard;
                orderModel.status = "Pending";
                orderModel.save(function(err, order) {
                    res.json({
                        type: true,
                        data: order
                    });
                });
            }
            
        });
        
    });
    
    //Getting list of orders for user - userid
    router.get('/user/:userid/order', function(req, res){
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');
        
        var findUserRequest = findUserObj.findUser(req.params.userid);
        findUserRequest.done(function(data){
            if(data=="Error"){
                res.json({
                    type:false,
                    data: "User not found"
                });
            }
            else{
                console.log("User found");
                console.log("Finding orders for user " +  req.params.userid);
                OrderSchema.find({userid:req.params.userid},function(err, orders){
                    if(err){
                        res.json({
                            type: false,
                            data: null
                        });
                    }
                    else{
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
    router.get('/user/:userid/order/:orderid', function(req, res){
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');
        
        UserSchema.findOne({user_id:req.params.userid}, function(err, user){
            if(err){
                 res.json({
                        type: false,
                        data: "User not found"
                 });
            }
            else{
                if(user){
                    console.log("User found");
                    console.log("Finding orders for user " +  req.params.userid);
                    OrderSchema.findById(req.params.orderid,function(err, order){
                        if(err){
                            res.json({
                                type: false,
                                data: null
                            });
                        }
                        else{
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
    router.put('/user/:userid/order/cancel/:orderid', function(req, res){
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');
        
        UserSchema.findOne({user_id:req.params.userid}, function(err, user){
            if(err){
                 res.json({
                        type: false,
                        data: "User not found"
                 });
            }
            else{
                if(user){
                    console.log("User found");
                    console.log("Finding orders for user " +  req.params.userid);
                    OrderSchema.findById(req.params.orderid,function(err, order){
                        if(err){
                            res.json({
                                type: false,
                                data: "No order found for this id"
                            });
                        }
                        else{
                            order.status = "Cancelled";
                            order.save(function(err, order){
                                if(err){
                                    res.json({
                                        type: false,
                                        data: "Error Occurred :" + err
                                    });
                                }
                                else{
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
    router.put('/user/:userid/order/update/:orderid', function(req, res){
        var OrderSchema = require('../models/Order');
        var UserSchema = require('../models/User');
        
        var findUserRequest = findUserObj.findUser();
        findUserRequest.done(function(data){
            if(data="Error"){
                 res.json({
                        type: false,
                        data: "User not found"
                 });
            }
            else{
                console.log("User found");
                console.log("Finding orders for user " +  req.params.userid);
                OrderSchema.findById(req.params.orderid,function(err, order){
                    if(err){
                        res.json({
                            type: false,
                            data: "No order found for this id"
                        });
                    }
                    else{
                        order.status = "Cancelled";
                        order.save(function(err, order){
                            if(err){
                                res.json({
                                    type: false,
                                    data: "Error Occurred :" + err
                                });
                            }
                            else{
                                res.json({
                                    type: true,
                                    data: order
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}