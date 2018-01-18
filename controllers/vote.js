var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

Proposition = mongoose.model('Proposition');
Vote = mongoose.model('Vote');


exports.findByProposition = function(req, res) {

	//To add, protect it: if the deadline is not passed, return too early
	Vote.find({team: req.params.teamId, propId: req.params.propId}, function(err, votes) {
		console.log(votes);
    	res.json(votes);
  	});
};

exports.getVotesInfosForUserProfile = function(req, res) {

	Vote.find({voter: req.headers.voterid}, function(err, votesForUser) {
    	
    	var propsInVotes = votesForUser.map(x => x.propId);

    	Proposition.find({_id: {$in:  propsInVotes}}, function (err, props) {
    		if (err) throw err;

    		var votes = [];

    		votesForUser.forEach(function (vote) {
    			var thatProp = props.filter(x => x._id == vote.propId);
    			console.log(thatProp);
    			votes.push({
    				content: vote.content,
				    proposition: {
				        title: thatProp[0].title,
				        category: thatProp[0].category,
				        teamSlug: thatProp[0].slug,
				        date: thatProp[0].date
				    }
    			});
    			console.log(votes);
    		});

    		res.send({
    			success: true,
    			votes: votes
    		});

    	});

    });

};

exports.add = function(req, res) {

	Proposition.count({_id: req.params.propId}, function (err, count) {

		if (count !== 1) {
					res.send("Sorry, this proposition doesn't exist.");
		}

		else{

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

                	Proposition.findOneAndUpdate({ _id: req.params.propId }, { $inc: { numberOfVotes: 1 }}, {new: true}, function (err, propUpdated) {
						if (err) {
            				console.log("Ca bug.");
        				}

						res.send({ success: true});

					});
                }
			});
		}
	});
	
};

exports.automatedAdd = function(req) {

	Vote.create({
		_id: new ObjectID(),
		slug : req.teamId,
		propId : req.propId,
		voter: req.voter,
		delegation : req.delegation,
		content: req.content,
		weight: 1
	}, function (err) {
		if (err) {
            console.log("Couldn't cast the vote of the delegater:" + err);    
        } else {

        	Proposition.findOneAndUpdate({ _id: req.params.propId }, { $inc: { numberOfVotes: 1 }}, {new: true}, function (err, propUpdated) {
				if (err) {
            		console.log("Ca bug.");
        		}

				console.log("Casted the vote of the delegater.");

				});

           	
            }
	});	
};

exports.moveDelegations = function(req) {

	var teamId = req.params.teamId;
	var propId = req.params.propId;

	Vote.count({propId: propId, delegation: true}, function(err, voteNumber) {

		var maxDelegation = voteNumber;

		for(var d=1; d<maxDelegation+1; d++){

			Vote.find({propId: propId, delegation: true, weight: d}, function(err, specWeightVotes){
				
				for (var i = 0; i < specWeightVotes.length; i++) {

					// Add the weight d, aka the weight of a vote to the delegated voter
					Vote.findOneAndUpdate({propId: propId, voter: specWeightVotes[i].content }, { $inc: { 'weight': specWeightVotes[i].weight }}, function (err) {
						if (err) {
            				console.log("Ca bug.");
        				}
					});

					//Put weight as zero for the ones who have delegated
					Vote.findOneAndUpdate({_id: specWeightVotes[i]._id}, { $set: { 'weight': 0 }}, function (err) {
            				if (err) {
            					console.log("Ca bug 2.");
            				}
            		});
				}
			});
		}
		console.log("I have delegated all votes");

		return;
  	});
};

