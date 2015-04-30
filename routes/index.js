module.exports = function(router) {
    var accessDeniedMsg = "Access Denied! You need to be logged in to perform this operation.";

    router.get('/', function(req, res) {
        if(req.session.user) {
            res.render('index',req);
        } else {
            res.render('index');    
        }
        
    });

    router.get('/index', function(req, res) {
        if(req.session.user) {
            res.render('index',req);
        } else {
            res.render('index');    
        }
        
    });

    router.get('/cart', function(req, res) {
        if(req.session.user) {
            res.render('cart',req);
        } else {
            res.render('login');
        }
    });

    router.get('/checkout', function(req, res) {
        if(req.session.user) {
            res.render('checkout',req);
        } else {
            res.render('login');
        }
    });

    router.get('/product-details', function(req, res) {
        if(req.session.user) {
            res.render('product-details',req);
        } else {
            res.render('product-details');
        }
    });

    router.get('/shop', function(req, res) {
        if(req.session.user) {
            res.render('shop',req);    
        } else {
            res.render('shop');
        }
    });

    router.get('/login', function(req, res) {
        if(req.session.user) {
            res.render('login',req);
        } else {
            res.render('login');
        }
    });

    router.get('/contact-us', function(req, res) {
        if(req.session.user) {
            res.render('contact-us',req);
        } else {
            res.render('contact-us');
        }
    });

    router.get('/retailerhome', function(req, res) {
        if(!req.session.user || req.session.user.role != "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
          res.render('retailer_home',req);
        }
        
    });

    
}