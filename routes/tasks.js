var express = require('express'),
	router = express.Router(),
	tasks = require('../models/taskSchema');

router.get('/', (req, res) => {
	var where  = req.query.where ? JSON.parse(req.query.where) : {},
		sort   = req.query.sort ? JSON.parse(req.query.sort) : {},
		select = req.query.select ? JSON.parse(req.query.select) : {},
		skip   = req.query.skip ? JSON.parseInt(req.query.skip) : 0;

	var query  = tasks.find({}).where(where).sort(sort).select(select).skip(skip);
		
	if(req.query.limit) {
		query = query.limit(parseInt(req.query.limit));
	}	

	if(req.query.count === 'true') {
		query = query.count();
	}
		// console.log(query);
	query.exec({}, (err, res_tasks) => {
		if (err) {
			res.status(500).send({
				message: 'Server Error',
				data: []
			});
			return;
		} 
		res.status(200).send({
			message: 'OK',
			data: res_tasks,
		})
		
	})
});

router.post('/', function (req, res) {
    tasks.create(req.body, function(err, newtask) {
    	if (err) {
			res.status(500).send({
				message: err,
				data: []
			});
			return;
		} 
		res.status(201).send({
			message: 'OK',
			data: newtask,
		})
		
    })
});

router.get('/:id', function(req, res) {
	tasks.findOne({_id: req.params.id}, function(err, task) {
		if(err) {
			res.status(500).send({
				message: err,
				data: []
			});
			return;
		} 
		if(!task) {
			res.status(404).send({
				message: 'Task Not Found',
				data: []
			});
			return;
		}
		res.status(200).send({
			message: 'OK',
			data: task
		})
	})
});

router.put('/:id', function(req, res) {
	tasks.findOne({_id: req.params.id}, (err, res_tasks) => {
		if(err) {
			res.status(500).send({
				message: err,
				data: {}
			});
			return;
		} 
		if(!res_tasks) {
			res.status(404).send({
				message: 'Task Not Found',
				data: []
			});
			return;
		}

		tasks.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, (err, task) => {
			if(err) {
				res.status(500).send({
					message: err,
					data: {}
				});
			} else {
				res.status(200).send({
					message: 'Task Updated',
					data: task
				});
			}
		});			
	})
});

router.delete('/:id', function(req, res) {
	tasks.deleteOne({_id: req.params.id}, function(err, task) {
		if(err) {
			res.status(500).send({
				message: err,
				data: []
			});
			return;
		} 
		if(task.n === 0) {
			res.status(404).send({
				message: 'Task Not Found',
				data: []
			});
		} else {
			res.status(200).send({
				message: 'Task Deleted',
			})
		}	
	})
});

module.exports = router;