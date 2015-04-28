module.exports = function(router) {
    var accessDeniedMsg = "Access Denied! You need to be logged in to perform this operation.";

    router.get('/', function(req, res) {
        res.render('index');
    });

    router.get('/cart', function(req, res) {
        res.render('cart');
    });

    router.get('/checkout', function(req, res) {
        res.render('checkout');
    });

    router.get('/product-details', function(req, res) {
        res.render('product-details');
    });

    router.get('/shop', function(req, res) {
        res.render('shop');
    });

    router.get('/login', function(req, res) {
        res.render('login');
    });

    router.get('/contact-us', function(req, res) {
        res.render('contact-us');
    });

    router.get('/retailerhome', function(req, res) {
        if(!req.session.user || req.session.user.role != "retailer") {
            res.json({
                type: false,
                data: accessDeniedMsg
            });
        } else {
          res.render('retailer_home');
        }
        
    });

    
}