var express = require('express'),
	router = express.Router(),
	users = require('../models/userSchema');

router.get('/', function(req, res) {
	var where  = req.query.where ? JSON.parse(req.query.where) : {},
		sort   = req.query.sort ? JSON.parse(req.query.sort) : {},
		select = req.query.select ? JSON.parse(req.query.select) : {},
		skip   = req.query.skip ? JSON.parseInt(req.query.skip) : 0;

	var query  = users.find({}).where(where).sort(sort).select(select).skip(skip);
	
	if(req.query.limit) {
		query = query.limit(parseInt(req.query.limit));
	}	

	if(req.query.count === 'true') {
		query = query.count();
	}

		// console.log(query);
	query.exec({}, (err, res_users) => {
		if (err) {
			res.status(500).send({
				message: 'Server Error',
				data: []
			});
			return;
		} 
		res.status(200).send({
			message: 'OK',
			data: res_users,
		})
		
	})
});

router.post('/', function (req, res) {
    users.create(req.body, function(err, newUser) {
    	if (err) {
			res.status(500).send({
				message: err,
				data: []
			});
			return;
		}
		res.status(201).send({
			message: 'OK',
			data: newUser,
		})
		
    })
});

router.get('/:id', function(req, res) {
	users.findOne({_id: req.params.id}, function(err, user) {
		if(err) {
			res.status(500).send({
				message: err,
				data: []
			});
			return;
		} 
		if(!user) {
			res.status(404).send({
				message: 'User Not Found',
				data: []
			});
			return;
		} 
		res.status(200).send({
			message: 'OK',
			data: user
		})
		
		
	})
});

router.put('/:id', function(req, res) {
	users.findOne({_id: req.params.id}, (err, res_users) => {
		if(err) {
			res.status(500).send({
				message: err,
				data: {}
			});
			return;
		} 
		if(!res_users) {
			res.status(404).send({
				message: 'User Not Found',
				data: []
			});
			return;
		}
		users.findOne({email: req.body.email}, (err, res_user) => {
			// console.log(res_user._id);
			// console.log(req.params.id);
			if(err) {
	            res.status(500).send({
	                message: err,
	                data: {}
	            });
	            return;
	        }
	        // console.log(res_user.length);
	        if(res_user){
				if(res_user._id != req.params.id) {
					res.status(400).send({
						message: 'Email already exists',
						data: {}
				});
				return;
			} 
		} 
			console.log(req.body);
			users.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, (err, user) => {
				if(err) {
					res.status(500).send({
						message: err,
						data: {}
					});
					return;
				}  
				res.status(200).send({
					message: 'User Updated',
					data: user
				});
				
			})
			
		})
		
		
	})
});

router.delete('/:id', function(req, res) {
	users.deleteOne({_id: req.params.id}, function(err, user) {
		if(err) {
			res.status(500).send({
				message: err,
				data: []
			});
			return;
		}
		if(user.n === 0) {
			res.status(404).send({
				message: 'User Not Found',
				data: []
			});
			return;
		} 
		res.status(200).send({
			message: 'User Deleted',
		})
	})
});

module.exports = router;