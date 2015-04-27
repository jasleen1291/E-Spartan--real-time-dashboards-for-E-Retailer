module.exports = function(router) {

    var accessDeniedMsg = "Access Denied! You need to be logged in to perform this operation.";
    var UserSchema = require('../models/User.js');

    router.post('/signup', function(req, res, next) {
        if(req.session.user) {
            res.json({
                type: false,
                data: "You have to sign out to perform this step!"
            });
        } else {
            var UserSchema = require('../models/User.js');

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
                    console.log('Creating new user');
                    var userModel = new UserSchema();
                    userModel.username = req.body.userName;
                    userModel.password = req.body.password;
                    userModel.firstname = req.body.firstName;
                    userModel.lastname = req.body.lastName;
                    if (req.body.role) {
                        userModel.role = req.body.role;
                    }
                    userModel.save(function(err, user) {
                        if (!err) {
                            res.json({
                                type: true,
                                data: user
                            });
                        } else {
                            res.json({
                                type: false,
                                data: "" + err
                            })
                        }
                    });
                }
            }
            });
        }
        
    });

    router.post('/login', function(req, res, next) {
        var UserSchema = require('../models/User');
        if(req.session.user) {
            res.json({
                type: false,
                data: "Error: User already signed in!"
            });
        } else {
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
                    req.session.user = user;
                    console.log(req.session.user.user_id);

                    res.json({
                        type: true,
                        data: user
                    });
                } else {
                    res.json({
                        type: false,
                        data: "Invalid login"
                    });
                }
            }
        });
        }
    });

    router.post('/logout', function(req, res) {
        if(!req.session.user) {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            try {
            console.log("logout api called Node.");
            req.session = null;
            res.json({
                type: true,
                data: "Sign Out successfull"
            });

        } catch (e) {
            console.log("Entering catch block: " + e);
        }
        }
        
    });
    
    router.post('/editProfile', function(req, res, next) {
        if(!req.session.user) {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
            var UserSchema = require('../models/User.js');

        UserSchema.findOne({
            username: req.body.userName
        }, function(err, user) {
            if (err) {
                console.log('err');
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    var userModel = user;
                    userModel.username = req.body.newUserName;
                    userModel.password = req.body.newPassword;
                    userModel.firstname = req.body.firstName;
                    userModel.lastname = req.body.lastName;
                    userModel.save(function(err, user) {
                        console.log("user: " + user);
                        res.json({
                            type: true,
                            data: user
                        });
                    });
                } else {
                    res.json({
                        type: false
                    });
                }
            }
        });
        }
    });
}