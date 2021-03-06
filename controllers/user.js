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
	User.find({email: req.params._id}, function(err, user) {
    	res.json(user);
  	});
};

exports.add = function(req, res) {

	User.count({email: req.body.email}, function (err, count) {

		if (count != 0) {
					res.send("Sorry, this user already exists.");
		}

		else{
					
			var username = req.body.name + " " + req.body.surname;
			var hash = bcrypt.hashSync(req.body.pwd);
			console.log(username);
					

			var new_user = {
						   	_id: new ObjectID(),
						   	name : req.body.name,
						   	surname : req.body.surname,
						   	username : username,
						   	password : hash,
						   	email : req.body.email,
				};

			User.create(new_user);

			//req.session.userId = user._id;
			res.send({
				success: true,
				user: new_user
			});
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

            	var hash = bcrypt.hashSync(req.body.newPassword);
            	user.password = hash;

            	user.save(function (err){
            		if (err) {
            			res.json({ success: false, message: 'Error while saving the change.' });
            		}
            	});            
                
            }   

        }

    });
};
exports.delete = function() {
	var id = req.params.id;
  	User.remove({'_id':id},function(result) {
    	return res.send(result);
  });
};