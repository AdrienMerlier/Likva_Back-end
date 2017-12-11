var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var slug = require('slugify')


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

	console.log("I'm in the function. Request is: " +req.body);

	User.findOne({ email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
            	console.log('User not found');
              //res.send({ success: false, message: 'User not found.' });
            } else if (user) {

				console.log("The user is:" + user);

				var new_teamUser = {
				   	_id: user._id,
				   	slug: slug(req.body.teamName),
				   	email: req.body.email,
					admin : true,
					proposer : true,
					status : "Voter",
					delegable: true,
					delegation : [[]],
				};

				//A revoir
				TeamUser.create(new_teamUser, function (err) {
					if (err) {
		                    console.log("Error while adding TeamUser");    
	                } else {
						console.log("TeamUser should have been created");
					}
				});

				return 0;
            	
        	}   
    });
};

exports.add = function(req, res) {

};
exports.delete = function() {};