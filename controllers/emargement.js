var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

require('../models/vote');
Proposition = mongoose.model('Proposition');
Vote = mongoose.model('Vote');
var votes = require('../controllers/vote');



exports.findByProposition = function(req, res) {

	//To add, protect it: if the deadline is not passed, return too early
	Emargement.find({team: req.params.teamId, propId: req.params.propId}, function(err, emargements) {
		console.log(emargements);
    	res.json(emargements);
  	});
};

exports.add = function(req, res) {

	Proposition.count({_id: req.params.propId}, function (err, count) {

		//Check that proposition exists
		if (count != 1) {
					res.send("Sorry, this proposition doesn't exist.");
		}

		else{

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
	});
	
};
