var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

Proposition = mongoose.model('Proposition');
Vote = mongoose.model('Vote');

async = require('async');


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
        } else {
           	console.log("Casted the vote of the delegater.");
            }
	});	
};

function _addWeightToVote(propId, specWeightVotes, callback) {
	// Add the weight d, aka the weight of a vote to the delegated voter
	Vote.findOneAndUpdate({propId: propId, voter: specWeightVotes[i].content }, { $inc: { 'weight': specWeightVotes[i].weight }}, function (err) {
		if (err) {
			console.log("Ca bug.");
		}
		console.log("Un vote augmenté.")
	});
	callback();
}

function _nulifyWeightToVote(propId, specWeightVotes, callback) {
	//Put weight as zero for the ones who have delegated
	Vote.findOneAndUpdate({_id: specWeightVotes[i]._id}, { $set: { 'weight': 0 }}, function (err) {
		if (err) {
	   		console.log("Ca bug 2.");
	            				}
	});
	callback();
}

exports.moveDelegations = function(req) {

	var teamId = req.params.teamId;
	var propId = req.params.propId;

	Vote.count({propId: propId, delegation: true}, function(err, voteNumber) {

		var maxDelegation = voteNumber;

		for(var d=1; d<maxDelegation; d++){

			console.log("On va déléguéer pour le poids:" + d);

			delegationLeft = 0; //Is calculated to see if someone delegates to a delegate

			Vote.find({propId: propId, delegation: true, weight: d}, function(err, specWeightVotes){
				
				for (var maxDelegationsForWeightX = maxDelegation; maxDelegationsForWeightX > 0; maxDelegationsForWeightX--){
					
					//On délégue une fois pour un poids donné
					for (var i = 0; i < specWeightVotes.length; i++) {

						async.series([
							_addWeightToVote(propId, specWeightVotes),
							_nulifyWeightToVote(propId, specWeightVotes)
						], function (error, success) {
							if (error) { alert('Something is wrong!'); }
       						 return alert('Done!');
						});

						console.log("Une délégation faite");

					}

					console.log("On a délégué une fois pour le poids:" + d);

					//On compte le nombre de voix restantes, et update maxDelegationsForWeightX

					Vote.count({propId: propId, delegation: true, weight: d}, function(err, countVotesLeft){
						console.log("Reduction de maxDelegationsForWeightX à: " + countVotesLeft);
						maxDelegationsForWeightX = countVotesLeft;
					});


				}
				
			});
		}
		console.log("I have delegated all votes");
  	});
};

