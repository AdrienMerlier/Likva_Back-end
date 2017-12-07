var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


User = mongoose.model('User');


var bcrypt = require('bcrypt-nodejs');



exports.findAll = function(req, res) {
	 User.find({}, function(err, users) {
    	res.json(users);
  	});
};
exports.findById = function() {
	User.find({email: req.body.email}, function(err, user) {
    	res.json(user);
  	});
};
exports.add = function(req, res) {

	User.count({email: req.body.email}, function (err, count) {

		if (count != 0) {
					res.send("Sorry, this user already exists.");
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
						   	teams: {}
				};

			User.create(new_user);

			//req.session.userId = user._id;
			res.send(202);
		}
	});
	
};

exports.update = function(req, res) {};

exports.updatePassword = function(req, res) {

	User.findOne({ email: req.body.logemail}, function(err, user) {

        if (err) throw err;

        if (!user) {
         	res.json({ success: false, message: 'Change of password failed. User not found.' });
        } else if (user) {

              // check if old password matches 
        	if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

            	user.password = req.body.newPassword;

            	user.save(function (err){
            		if (err) {
            			res.json({ success: false, message: 'Error while saving the change.' });
            		}
            	});            
                
            }   

        }

    });
};
exports.delete = function() {};