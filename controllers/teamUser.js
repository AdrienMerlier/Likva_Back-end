var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


TeamUser = mongoose.model('TeamUser');
User = mongoose.model('User');


exports.findAll = function(req, res) {
	TeamUser.find({}, function(err, users) {
    	res.json(users);
  	});

};
exports.findById = function() {
};

exports.addFirstUser = function(req, res) {

	console.log("I'm in the function");

	User.findOne({ email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
              res.json({ success: false, message: 'User not found.' });
            } else if (user) {

				console.log("The user is:" + user);

				var new_teamUser = {
				   	_id: user._id,
				   	team: req.body.teamName,
				   	email: req.body.email,
					admin : true,
					proposer : true,
					status : "Voter",
					delegable: true,
					delegation : [[]],
				};

				TeamUser.create(new_teamUser);

				return 0;
            }   

    });
};

exports.add = function(req, res) {

};
exports.delete = function() {};