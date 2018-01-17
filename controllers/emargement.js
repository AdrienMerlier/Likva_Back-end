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

	console.log(req.headers.id);

	//To add, protect it: if the deadline is not passed, return too early
	Emargement.find({slug: req.params.teamId, voter:req.headers.id, propId: req.params.propId}, function(err, emargements) {
	
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
			console.log(req.body.voter);
			TeamUser.find({slug: req.params.teamId, userId: req.body.voter}, function (err, teamUser) {
				if(!teamUser){
					res.send({ success: false, message: 'Sorry, we couldnt find you in teamUser.' });
				}

				if (teamUser) {
					console.log('La longueur de teamUser est:' + teamUser.length);
					console.log("Le Teamuser est:" + teamUser[0].status);

					if (teamUser[0].status != "Voter") {
						res.send({ success: false, message: 'Sorry, we dont consider you a voter.' });
					} else {

						
						inTimeToVote = (Date.now()-Date.parse(proposition[0].date) < 0);
						
						
						//Check that user didn't vote on proposition yet
						Emargement.count({propId: req.params.propId, email: req.body.voter}, function (err, count1) {



						if (count1 != 0 && inTimeToVote) {
							res.send({success: false, message: "Sorry, the vote has already been registered, or it is too late to vote."});
						}

						else if(req.body.voter == req.body.content){
							res.send({success: false, message: "Sorry, you can't delegate a vote to yourself"});
						}

						else{

							console.log('Notre premier emargement va avoir lieu!' + req.body.voter);
							//A revoir une fois qu'on sait gérér le token, vérifier que l'utilisateur est présent dans Teamusers, et peut voter

							console.log(req.body);
							console.log("---");

							Emargement.create({
								_id: new ObjectID(),
								slug : req.params.teamId,
								propId : req.params.propId,
								voter: req.body.voter
							}, function (err) {
								if (err) {
				                    res.send({ success: false, message: 'Sorry, couldnt create the vote.' });    
				                } else {

				                	//Enlève le nom du voter si il n'est pas délégable ou délégant son vote
									if(teamUser[0].delegable.filter(a => a.categoryName == proposition[0].category).length==0 
										&& !req.body.delegation){
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

exports.automatedAdd = function(newVote) {

			//Check that user 
			Teamuser.find({slug: newVote.teamId, email: newVote.email}, function (err, teamUser) {
				if(!teamUser){
					console.log('This teamUser is not found.');
				}

				if (teamUser) {
						
						//Check that user didn't vote on proposition yet
						Emargement.count({propId: newVote.propId, email: newVote.voter}, function (err, count1) {

						console.log(count1);

						if (count1 != 0) {
							console.log("A vote has already been registered.");
						}

						else{


							Emargement.create({
								_id: new ObjectID(),
								slug : newVote.teamId,
								propId : newVote.propId,
								voter: newVote.voter
							}, function (err, emargement) {
								if (err) {
				                    console.log("couldnt emarge the delegater: " + err);    
				                } else {

				                	//Ajoute le nom du voter s'il est un délégué potentiel
										if(teamUser.delegable==false){
											newVote.voter=false;
										}

				                	votes.automatedAdd(newVote, function (err) {
				                		if (err) {
				                    		console.log("couldnt register the vote from the delegater: " + err);    
				                		} else {
				                			return 1;
				                		}
				                	});
				                }
							});
						}
					});

				}
			});	
};
