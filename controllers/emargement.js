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
					res.send({ success: false, message: 'Sorry, we couldnt find this proposition.' });
		}

		else{

			//Check that user 
			Teamuser.find({slug: req.params.teamId, email: req.body.email}, function (err, teamUser) {
				if(!teamUser){
					res.send({ success: false, message: 'Sorry, we couldnt find you in teamUser.' });
				}

				if (teamUser) {
					if (teamUser.type != "Voter") {
						res.send({ success: false, message: 'Sorry, we dont consider you a voter.' });
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

							//Ajoute le nom du voter s'il est un délégué potentiel
							if(teamUser.delegable==false && req.body.anonymous==true){
								req.body.voter=false;
							} else {
								req.body.voter=req.body.email;
							}

							console.log('Notre premier emargement va avoir lieu!');
							//A revoir une fois qu'on sait gérér le token, vérifier que l'utilisateur est présent dans Teamusers, et peut voter

							Emargement.create({
								_id: new ObjectID(),
								slug : req.params.teamId,
								propId : req.params.propId,
								email: req.body.email
							}, function (err) {
								if (err) {
				                    res.send({ success: false, message: 'Sorry, couldnt create the vote.' });    
				                } else {
				                	votes.add(req, function (err) {
				                		if (err) {
				                    		return res.json({ success: false, message: 'Sorry, couldnt cast your vote after emargement.' });    
				                		} else {
				                			res.send({ success: true, emargement: emargement});;
				                		}
				                	});
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

exports.automatedAdd = function(req, res) {

			//Check that user 
			Teamuser.find({slug: req.body.teamId, email: req.body.email}, function (err, teamUser) {
				if(!teamUser){
					console.log('This teamUser is not found.');
				}

				if (teamUser) {
					if (teamUser.type != "Voter") {
						console.log('This teamUser cant vote.');
					} else {

						/* To recheck later, when this matters
						inTimeToVote = (Date.now()<Date.parse(proposition.date);
						*/
						
						//Check that user didn't vote on proposition yet
						Emargement.count({_id: req.body.propId, email: req.body.email}, function (err, count1) {

						if (count != 0) {
							console.log("A vote has already been registered.");
						}

						else{

							//Ajoute le nom du voter s'il est un délégué potentiel
							if(teamUser.delegable==false && req.body.anonymous==true){
								req.body.voter=false;
							} else {
								req.body.voter=req.body.email;
							}


							Emargement.create({
								_id: new ObjectID(),
								slug : req.body.teamId,
								propId : req.body.propId,
								email: req.body.email
							}, function (err, emargement) {
								if (err) {
				                    console.log("couldnt emarge the delegater: " + err);    
				                } else {
				                	votes.add(req, function (err) {
				                		if (err) {
				                    		console.log("couldnt register the vote from the delegater: " + err);    
				                		} else {
				                			res.send({ success: true, emargement: emargement});;
				                		}
				                	});
				                }
							});
						}
						});

					}
				}
			});	
};

exports.compile = function (req) {
	// body...
}