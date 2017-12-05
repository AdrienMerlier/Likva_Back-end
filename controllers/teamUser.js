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
	TeamUser.count({email: req.body.email}, function (err, count) {

		if (count != 0) {
					res.send("Sorry, this team user already exists.");
		}

		else{

			var userInDB = User.findOne({ email: req.body.email});

			var new_teamUser = {
						   	_id: userInDB.email,
							admin : true,
							proposer : true,
							status : "Voter",
							description: null,
							delegation : [[]],
				};

			TeamUser.create(new_teamUser);

			return new_teamUser;
		}
	});
};

exports.add = function(req, res) {

};
exports.delete = function() {};