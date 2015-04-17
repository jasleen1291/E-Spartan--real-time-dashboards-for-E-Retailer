module.exports = function(router) {
    var Counters = require('../app/models/counters');

    function getNextSequence(name) {
        // get the user starlord55
        console.log(name);
    }
    var UserSchema = require('../app/models/user/user');
    router.post('/signup', function(req, res, next) {
        var UserSchema = require('../app/models/user/user');

        UserSchema.findOne({
            username: req.body.userName,
            password: req.body.password
        }, function(err, user) {
            if (err) {
                console.log('err');
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    console.log('exists');
                    res.json({
                        type: false,
                        data: "User already exists!"
                    });
                } else {
                    console.log('new');
                    var userModel = new UserSchema();
                    console.log("data: " + req.body.userName);
                    userModel.username = req.body.userName;
                    userModel.password = req.body.password;
                    userModel.firstname = req.body.firstName;
                    userModel.lastname = req.body.lastName;
                    getNextSequence("user");
                    userModel.save(function(err, user) {
                        res.json({
                            type: true,
                            data: user
                        });
                    })
                }
            }
        });
    });
    

}