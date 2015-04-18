module.exports = function(router) {
    
    
    router.post('/addToCart', function(req, res, next) {
            var Cart=require("../models/Cart");
            Cart.findOne({user_id:req.body.userid},function (err, doc) {
                if(err)
                {
                    res.send({type:false,message:"Error"+err});
                }
                else
                {
                    if(doc)
                    {
                        callback(doc);
                    }
                    else{
                        var cart=new Cart({user_id:req.body.userid,items:[]});
                        cart.save(function(err,doc){
                            if(err)
                                res.send({type:false,message:"Error"+err});
                            else
                                callback(doc);
                        });
                    }
                }
                function callback(cart)
                {
                    var items=cart.items;
                    var item={};
                    item.itemId=req.body.itemId;
                    item.qty=req.body.qty;
                    item.price=req.body.price;
                    items.push(item);
                    cart.total=cart.total+(req.body.price*req.body.qty);
                    cart.save(function(err,doc){
                        if(err)
                            res.send({type:false,message:"Error"+err});
                        else
                            res.send({type:true,message:"Ok"});
                    });

                }
            });

        });
    
}