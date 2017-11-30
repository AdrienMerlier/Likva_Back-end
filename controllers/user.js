var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

User = mongoose.model('User');


var bcrypt = require('bcrypt-nodejs');

exports.findAll = function() {};
exports.findById = function() {};
exports.add = function(req, res, dbusers) {

	User.count({email: req.body.email}, function (err, count) {

		if (count != 0) {
					res.send("Sorry, this user already exist.");
		}

		else{
					
			var username = req.body.name.toLowerCase() + "." + req.body.surname.toLowerCase();
			var hash = bcrypt.hashSync(req.body.pwd);
					

			var new_user = {
						   	_id: new ObjectID(),
						   	name : req.body.name,
						   	surname : req.body.surname,
						   	username : username,
						   	password : hash,
						   	email : req.body.email,
						   	delegations: null
				};

			User.create(new_user);
			res.send(202);
		}
	});
	
};
exports.update = function() {};
exports.delete = function() {};