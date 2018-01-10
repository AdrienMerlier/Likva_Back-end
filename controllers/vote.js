var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

Proposition = mongoose.model('Proposition');
Vote = mongoose.model('Vote');

Promise = require("bluebird");


exports.findByProposition = function(req, res) {

	//To add, protect it: if the deadline is not passed, return too early
	Vote.find({team: req.params.teamId, propId: req.params.propId}, function(err, votes) {
		console.log(votes);
    	res.json(votes);
  	});
};

exports.add = function(req, res) {

	Proposition.count({_id: req.params.propId}, function (err, count) {

		if (count != 1) {
					res.send("Sorry, this proposition doesn't exist.");
		}

		else{

			console.log('Notre premier vote va avoir lieu!:' + req.params.teamId);
			//A revoir une fois qu'on sait gérér le token, vérifier que l'utilisateur est présent dans Teamusers, et peut voter

			Vote.create({
				_id: new ObjectID(),
				slug : req.params.teamId,
				propId : req.params.propId,
				voter: req.body.voter,
				delegation : req.body.delegation,
				content: req.body.content,
				weight: 1
			}, function (err) {
				if (err) {
                    res.send({ success: false, message: 'Sorry, couldnt cast your vote after emargement.' });  
                    //Add to erase the Emargement
                } else {
                	res.send({ success: true});
                }
			});
		}
	});
	
};

exports.automatedAdd = function(newVote) {

	return new Promise(function(resolve, reject) {

				Vote.create({
				_id: new ObjectID(),
				slug : newVote.teamId,
				propId : newVote.propId,
				voter: newVote.voter,
				delegation : newVote.delegation,
				content: newVote.content,
				weight: 1
			}, function (err) {
				if (err) {
		            console.log("Couldn't cast the vote of the delegater:" + err);    
		        } 
			});	

	    if (true) {
	      resolve(1);
	    } else {
	      reject(new Error('User cancelled'));
	    }
 	});
};

function moveDelegationsForWeightXRound(propId, weight, specWeightVotes) {

	return new Promise(function(resolve, reject) {

		for (var i = 0; i < specWeightVotes.length; i++) {
			// Add the weight d, aka the weight of a vote to the delegated voter
			Vote.findOneAndUpdate({propId: propId, voter: specWeightVotes[i].content }, { $inc: { 'weight': specWeightVotes[i].weight }}, function (err) {
				if (err) {
	        		console.log("Ca bug.");
	        	}
	        	console.log("Vote de poids " + weight + "augmenté!");
			});

			//Put weight as zero for the ones who have delegated
			Vote.findOneAndUpdate({_id: specWeightVotes[i]._id}, { $set: { 'weight': 0 }}, function (err) {
	        	if (err) {
	        		console.log("Ca bug 2.");
	        	}
	        	console.log("Delegation de poids " + weight + "passée à 0!");
	        });


				console.log("Une délégation faite");

			}

			console.log("On a délégué une fois pour le poids:" + weight);
	    
	    if (true) {
	      resolve(1);
	    } else {
	      reject(new Error('User cancelled'));
	    }
 	});

}

function moveDelegationsForWeightX(propId, weight, maxDelegation) {

	return new Promise(function(resolve, reject) {

		console.log("On va déléguéer pour le poids:" + weight);

			delegationLeft = 0; //Is calculated to see if someone delegates to a delegate

			Vote.find({propId: propId, delegation: true, weight: weight}, function(err, specWeightVotes){
				
				for (var maxDelegationsForWeightX = maxDelegation; maxDelegationsForWeightX > 0; maxDelegationsForWeightX--){
					
					//On délégue une fois pour un poids donné
					moveDelegationsForWeightXRound(propId, weight, specWeightVotes).then(function () {

						Vote.count({propId: propId, delegation: true, weight: weight}, function(err, countVotesLeft){
							console.log("Reduction de maxDelegationsForWeightX à: " + countVotesLeft);
							maxDelegationsForWeightX = countVotesLeft;
						});
					});
				}
				
			});
	    
	    if (true) {
	      resolve(1);
	    } else {
	      reject(new Error('User cancelled'));
	    }
 	});

}

exports.moveDelegations = function(req) {

	console.log("On va commercer à déléguer les votes.");

	var teamId = req.params.teamId;
	var propId = req.params.propId;

	Vote.count({propId: propId, delegation: true}, function(err, voteNumber) {

		var maxDelegation = voteNumber;

		for(var d=1; d<maxDelegation+1; d++){

			moveDelegationsForWeightX(propId, d, maxDelegation).then(function () {
				console.log("On a fini de déléguer pour le poids " + d);
			});
			
		}
		console.log("I have delegated all votes");

		return status=true;
  	});
};

