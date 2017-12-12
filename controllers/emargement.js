var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

require('../models/vote');
require('../models/teamUser');
Proposition = mongoose.model('Proposition');
Vote = mongoose.model('Vote');
TeamUser = mongoose.model('TeamUser');

var votes = require('../controllers/vote');



exports.findByProposition = function(req, res) {

	//To add, protect it: if the deadline is not passed, return too early
	Emargement.find({team: req.params.teamId, propId: req.params.propId}, function(err, emargements) {
		console.log(emargements);
    	res.json(emargements);
  	});
};

exports.add = function(req, res) {

	Proposition.find({_id: req.params.propId}, function (err, proposition) {

		//Check that proposition exists
		if (!proposition) {
					res.send("Sorry, this proposition doesn't exist.");
		}

		else{

			//Check that user 
			Teamuser.find({slug: req.params.teamId, email: req.body.email}, function (err, teamUser) {
				if(!teamUser){
					console.log('TeamUser is not found.');
				}

				if (teamUser) {
					if (teamUser.type != "Voter") {
						console.log('TeamUser is not found.');
					} else {

						/* To recheck later, when this matters
						inTimeToVote = (Date.now()<Date.parse(proposition.date);
						*/
						
						//Check that user didn't vote on proposition yet
						Emargement.count({_id: req.params.propId, email: req.body.email}, function (err, count1) {

						if (count != 0) {
							res.send("Sorry, the vote has already been registered.");
						}

						else{

							console.log('Notre premier emargement va avoir lieu!');
							//A revoir une fois qu'on sait gérér le token, vérifier que l'utilisateur est présent dans Teamusers, et peut voter

							Emargement.create({
								_id: new ObjectID(),
								slug : req.params.teamId,
								propId : req.params.propId,
								email: req.body.email
							}, function (err) {
								if (err) {
				                    return res.json({ success: false, message: 'Sorry, couldnt create the vote.' });    
				                } else {
				                	votes.add(req);
				                	res.send(202);
				                }
							});
						}
						});

					}
				}
			});
		}
	});
	
};