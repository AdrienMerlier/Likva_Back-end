var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//To finish: https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/

User = mongoose.model('User');


var bcrypt = require('bcrypt-nodejs');

exports.login = function(req, res) {
	var id = req.body.logemail;
	var pwd = req.body.logpassword;
	var sess = req.session;


	User.authenticate(id, pwd, function (error, user) {
		if(error || !user ){
			var err = new Error('Wrong email or password.');
			err.status = 401;
			return next(err);
		} else {
			sess.userId = user._id;
			return res.reditect('profile');
		}
	});
};


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
				};

			User.create(new_user);

			req.session.userId = user._id;
			res.send(202);
		}
	});
	
};
exports.update = function() {};
exports.delete = function() {};