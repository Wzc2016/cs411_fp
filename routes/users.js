var express = require('express'),
	router = express.Router(),
	users = require('../models/userSchema');
mongoose = require('mongoose');

router.get('/', function(req, res) {
	var where  = req.query.where ? JSON.parse(req.query.where) : {},
		sort   = req.query.sort ? JSON.parse(req.query.sort) : {},
		select = req.query.select ? JSON.parse(req.query.select) : {},
		skip   = req.query.skip ? JSON.parseInt(req.query.skip) : 0;

	var query  = users.find({}).where(where).sort(sort).select(select).skip(skip);
		query  = req.query.limit ? query.limit(parseInt(req.query.limit)) : query;
		query  = req.query.count === 'true' ? query.count() : query;

		// console.log(query);
	query.exec({}, (err, res_users) => {
		if (err) {
			res.status(500).send({
				message: 'Server Error',
				data: []
			});
		} else {
			res.status(200).send({
				message: 'OK',
				data: res_users,
			})
		}
	})
});

router.post('/', function (req, res) {
    users.create(req.body, function(err, newUser) {
    	if (err) {
			res.status(500).send({
				message: err,
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

router.get('/:id', function(req, res) {
	users.findOne({_id: req.params.id}).exec(function(err, user) {
		if(err) {
			res.status(500).send({
				message: err,
				data: []
			});
		} else {
			if(!user) {
				res.status(404).send({
					message: 'User Not Found',
					data: []
				});
			} else {
				res.status(200).send({
					message: 'OK',
					data: user
				})
			}
		}
	})
});

router.put('/:id', function(req, res) {
	users.findOne({_id: req.params.id}).exec((err, res_users) => {
		if(err) {
			res.status(500).send({
				message: err,
				data: {}
			});
		} else {
			if(!res_users) {
				res.status(404).send({
					message: 'User Not Found',
					data: []
				});
			} else {
				users.findOne({email: req.body.email}).exec((err, res_user) => {
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
						} else {
							res.status(200).send({
								message: 'User Information Updated',
								data: user
							});
						}
					})
					
				})
			}
		}
	})
});

router.delete('/:id', function(req, res) {
	users.deleteOne({_id: req.params.id}).exec(function(err, user) {
		if(err) {
			res.status(500).send({
				message: err,
				data: []
			});
		} else {
			if(user.n === 0) {
				res.status(404).send({
					message: 'User Not Found',
					data: []
				});
			} else {
				res.status(200).send({
					message: 'User Deleted',
				})
			}
		}
	})
});

module.exports = router;