var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


Team = mongoose.model('Team');
User = mongoose.model('User');

var teamusers = require('./teamUser')


var bcrypt = require('bcrypt-nodejs');



exports.findAll = function(req, res) {
	 Team.find({}, function(err, teams) {
    	res.json(teams);
  	});
};
exports.findById = function() {
	Team.find({teamName: req.body.teamName}, function(err, team) {
    	res.json(team);
  	});
};
exports.add = function(req, res) {

	Team.count({teamName: req.body.teamName}, function (err, count) {

		if (count != 0) {
					res.send("Sorry, this team name is already taken.");
		}

		else{

			//Review how to insert the first user once token management is done by front
					
			var hash = bcrypt.hashSync(req.body.pwd);

			var new_team = {
				_id: new ObjectID(),
			   	teamName : req.body.teamName,
				displayName: req.body.teamName,
				type: req.body.type,
				password : hash,
				categories: {}
			};

			Team.create(new_team, function (err) {
				if (err) {
                    return res.json({ success: false, message: 'Sorry, couldnt create the team.' });    
                } else {

                	//Add user in teamUsers collection
                	teamusers.addFirstUser(req, function (err) {
                		if (err) throw err;
                	});

                	//Update the user with the information about his account;

                	var permission = {
                		teamName: req.body.teamName,
                		admin: true,
                		proposer: true,
                		role: "Voter"
                	}

                	User.findOneAndUpdate({email: req.body.email}, {$push: {teams: permission}}, function (err) {
                		if (err) throw err;
                	});

                	res.send(202);
                }
			});
		}
	});
	
};

exports.updateTeam = function() {};
exports.updateTeamPassword = function() {};
exports.delete = function() {};