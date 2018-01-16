var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
require('../models/teamUser');
require('../models/team');



User = mongoose.model('User');
TeamUser = mongoose.model('TeamUser');
Team = mongoose.model('Team');

_ = require('underscore');

var bcrypt = require('bcrypt-nodejs');



exports.findAll = function(req, res) {
	 User.find({}, function(err, users) {
    	res.json(users);
  	});
};

function hasDelegate(teamUsers, teamName, categoryName) {
	
	var teamUser =_.find(teamUsers, function(val){ 
		return val.slug == teamName;
	});

	var delegable = _.find(teamUser.delegable, function(val){ 
		return val.categoryName == categoryName;
	});

	if(delegable == undefined){
		return false;
	}
	else {
		return true;
	}
}

exports.findById = function(req, res) {

	User.find({_id: req.params._id}, 'name surname email teams', function(err, user) {
		if(!user){
			res.send({success:false, message:"User not found"});
		}
		else{
			TeamUser.find({userId: req.params._id}, 'slug userId email displayName admin proposer status delegation delegable', function (err, teamUsersList) {

				var userTeams = user[0].teams.map(a => a.slug);

				Team.find({slug: {$in: userTeams}}, function (err, teams) {

					//On boucle autour des équipes dont l'utilisateur fait partie

					var teamUsers = [];

					teams.forEach( function (team){


					    var categories = [];

					    team.categories.forEach( function (category){

					    	categories.push({
					    		categoryName: category.categoryName,
					    		delegable: hasDelegate(teamUsersList, team.slug, category.categoryName)
					    	});


						});

						teamUsers.push({
							displayName: team.displayName,
							categories: categories
						})

					});

					res.send({
						success: true,
						user: {
							_id: user[0]._id,
							name: user[0].name,
							surname: user[0].surname,
							biography: "This is my biography",
							email: user[0].email,
							teams: teamUsers
						}
					});
				})

			});
		}
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