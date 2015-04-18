module.exports = function(router) {
    
    var UserSchema = require('../models/User.js');
    router.post('/addToCart', function(req, res, next) {
        var UserSchema = require('../models/User.js');

        UserSchema.findOne({
            user_id: req.body.user_id
        }, function(err, user) {
            if (err) {
                console.log('err');
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    callback();
                } else {
                    callback();
                }
            }
            function callback()
            {
                res.json("callback");
            }
        });
    });
    
}