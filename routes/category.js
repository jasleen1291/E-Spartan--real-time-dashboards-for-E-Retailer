//create category
module.exports = function(router) {

    var CategorySchema = require('../models/Category');
    
    /* Get list of all categories */
    router.get('/category', function(req, res, next) {
        var CategorySchema = require('../models/Category');
        CategorySchema.find(function(err, categories) {
            if (!err) {
                res.json({
                    type: true,
                    data: categories
                });
            } else {
                console.log(err);
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            }
        });
    });

    router.get('/ui/categoryParents', function(req, res, next) {
        var CategorySchema = require('../models/Category');
        CategorySchema.find({ parent_id: 0, isDeleted: false }, function(err, categories) {
            if (!err) {
                res.json({
                    type: true,
                    data: categories
                });
            } else {
                console.log(err);
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            }
        });
    });

    router.get('/ui/categoryChildren', function(req, res, next) {
        var CategorySchema = require('../models/Category');
        CategorySchema.find({ parent_id: {$gt : 0}, isDeleted: false }, function(err, categories) {
            if (!err) {
                res.json({
                    type: true,
                    data: categories
                });
            } else {
                console.log(err);
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            }
        });
    });
    router.post('/category/create', function(req, res, next) {
        var CategorySchema = require('../models/Category');

        CategorySchema.findOne({
            name: req.body.name
        }, function(err, category) {
            if (err) {
                console.log('err');
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (category) {
                    console.log('exists');
                    res.json({
                        type: false,
                        data: "The Category already exists!"
                    });
                } else {
                    console.log('new');
                    var categoryModel = new CategorySchema();
                    console.log("data: " + req.body.name);
                    categoryModel.name = req.body.name;
                    categoryModel.description = req.body.description;
                    if (req.body.parentId != "" || req.body.parentId != null) {
                        categoryModel.parent_id = req.body.parentId;
                    } else {
                        categoryModel.parent_id = 0;
                    }
                    try {
                        categoryModel.features = (JSON.parse(req.body.features));
                        categoryModel.save(function(err, category) {
                            res.json({
                                type: true,
                                data: category
                            });
                        });
                    } catch (e) {
                        res.json({
                            type: false,
                            data: "Invalid json"
                        });
                    }

                }
            }
        });
    });

    // get category by Id.
    router.get('/category/:id', function(req, res) {
        var CategorySchema = require('../models/Category');
        return CategorySchema.findById(req.params.id, function(err, category) {
            if (!err) {
                if (category.isDeleted == false) {
                    return res.send(category);
                } else {
                    res.json({
                        type: false,
                        data: "Category does not exist."
                    });
                    return console.log("Category does not exist.");
                }
            } else {
                return console.log(err);
            }
        });
    });

    // update category by Id
    router.put('/category/:id', function(req, res) {
        var CategorySchema = require('../models/Category');
        return CategorySchema.findById(req.params.id, function(err, category) {
            if (category.isDeleted == false) {
                category.name = req.body.name;
                category.description = req.body.description;
                if (req.body.parentId != "" || req.body.parentId != null) {
                    category.parent_id = req.body.parentId;
                } else {
                    category.parent_id = 0;
                }
                try {
                    category.features = (JSON.parse(req.body.features));
                    category.save(function(err, category) {
                        if (!err) {
                            res.json({
                                type: true,
                                data: category
                            });
                        } else {
                            res.json({
                                type: false,
                                data: err
                            });
                        }

                    });
                } catch (e) {
                    res.json({
                        type: false,
                        data: "Invalid json"
                    });
                }
            } else {
                res.json({
                    type: false,
                    data: "Category does not exist."
                });
                return console.log("Category does not exist.");
            }
        });
    });


    // delete category by Id
    router.delete('/category/:id', function(req, res) {
        var CategorySchema = require('../models/Category');
        return CategorySchema.findById(req.params.id, function(err, category) {
            if (category.isDeleted == false) {
                category.isDeleted = true;
                return category.save(function(err) {
                    if (!err) {
                        console.log("deleted");
                    } else {
                        console.log(err);
                    }
                    return res.send(category);
                });
            } else {
                res.json({
                    type: false,
                    data: "Category does not exist."
                });
                return console.log("Category does not exist.");
            }
        });
    });

}