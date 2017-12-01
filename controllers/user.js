var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

User = mongoose.model('User');


var bcrypt = require('bcrypt-nodejs');

exports.login = function(req, res) {
	
	 // find the user
  User.findOne({
    email: req.body.logemail
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

    	//Replace bottom section accocording to https://www.npmjs.com/package/bcrypt (as callback)

      // check if password matches 
      if (bcrypt.compare(req.body.logpassword, user.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
	    const payload = {
	      admin: false //To adapt
	    };
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });

};


exports.findAll = function(req, res) {
	 User.find({}, function(err, users) {
    	res.json(users);
  	});
};
exports.findById = function() {};
exports.add = function(req, res) {

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