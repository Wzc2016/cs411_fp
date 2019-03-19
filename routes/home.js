var secrets = require('../config/secrets'),
	users = require('../models/userSchema'),
    tasks = require('../models/taskSchema');

module.exports = function (router) {

    var homeRoute = router.route('/');

    // the get function
    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    var userRoute = router.route('/users');

    // the delete function
    userRoute.delete(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    // the POST function
    userRoute.post(function (req, res) {
        users.create(req.body, function(err, newUser) {
        	if (err) {
				res.status(500).send({
					message: err.errors,
					data: []
				});
			} else {
				res.status(201).send({
					message: 'OK',
					data: newUser,
				})
			}
        })
    });

    var userIdRoute = router.route('/users/:id');

    userIdRoute.get(function(req, res) {
    	users.find({_id: req.params.id}).exec(function(err, users) {
    		if(err) {
    			res.status(500).send({
    				message: err,
    				data: []
    			});
    		} else {
    			if(users.length === 0) {
    				res.status(404).send({
    					message: 'Users Not Found',
    					data: []
    				});
    			} else {
    				res.status(200).send({
    					message: 'OK',
    					data: users[0]
    				})
    			}
    		}
    	})
    });

    // the PUT function
    homeRoute.put(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    return router;
}
