var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

require('../models/vote');
require('../models/teamUser');
require('../models/emargement');

Proposition = mongoose.model('Proposition');
Vote = mongoose.model('Vote');
TeamUser = mongoose.model('TeamUser');
Emargement = mongoose.model('Emargement');


var votes = require('../controllers/vote');




exports.findByProposition = function(req, res) {
	console.log('I got a request: ' + JSON.stringify(req.body, null, 2));
	//To add, protect it: if the deadline is not passed, return too early
	Emargement.find({team: req.params.teamId, email:req.body.email, propId: req.params.propId}, function(err, emargements) {
		console.log("La taille de émargement est: "+ emargements.length);
		if(emargements.length==0){
			res.send({success:false});
		} else {
			res.send({ success:true });
		}
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
			TeamUser.find({slug: req.params.teamId, email: req.body.voter}, function (err, teamUser) {
				if(!teamUser){
					res.send({ success: false, message: 'Sorry, we couldnt find you in teamUser.' });
				}

				if (teamUser) {
					console.log('La longueur de teamUser est:' + teamUser.length);
					console.log("Le Teamuser est:" + teamUser[0].status);

					if (teamUser[0].status != "Voter") {
						res.send({ success: false, message: 'Sorry, we dont consider you a voter.' });
					} else {

						/* To recheck later, when this matters
						inTimeToVote = (Date.now()<Date.parse(proposition.date);
						*/
						
						//Check that user didn't vote on proposition yet
						Emargement.count({propId: req.params.propId, email: req.body.voter}, function (err, count1) {



						if (count1 != 0) {
							res.send({success: false, message: "Sorry, the vote has already been registered."});
						}

						else if(req.body.voter == req.body.content){
							res.send({success: false, message: "Sorry, you can't delegate a vote to yourself"});
						}

						else{

							console.log('Notre premier emargement va avoir lieu!' + req.body.voter);
							//A revoir une fois qu'on sait gérér le token, vérifier que l'utilisateur est présent dans Teamusers, et peut voter

							Emargement.create({
								_id: new ObjectID(),
								slug : req.params.teamId,
								propId : req.params.propId,
								email: req.body.voter
							}, function (err) {
								if (err) {
				                    res.send({ success: false, message: 'Sorry, couldnt create the vote.' });    
				                } else {

				                	//Ajoute le nom du voter s'il est un délégué potentiel
									if(teamUser[0].delegable==false){
										req.body.voter=false;
									}

				                	votes.add(req, res, function (err) {
				                		if (err) {
				                    		res.send({ success: false, message: 'Sorry, couldnt cast your vote after emargement.' });    
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
					if (teamUser[0].status != "Voter") {
						console.log('This teamUser cant vote.');
					} else {

						/* To recheck later, when this matters
						inTimeToVote = (Date.now()<Date.parse(proposition.date);
						*/
						
						//Check that user didn't vote on proposition yet
						Emargement.count({_id: req.body.propId, email: req.body.voter}, function (err, count1) {

						if (count != 0) {
							console.log("A vote has already been registered.");
						}

						else{


							Emargement.create({
								_id: new ObjectID(),
								slug : req.body.teamId,
								propId : req.body.propId,
								email: req.body.voter
							}, function (err, emargement) {
								if (err) {
				                    console.log("couldnt emarge the delegater: " + err);    
				                } else {

				                	//Ajoute le nom du voter s'il est un délégué potentiel
										if(teamUser[0].delegable==false){
											req.body.voter=false;
										}

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
