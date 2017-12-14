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

exports.add = function(req, res) {

	Proposition.count({_id: req.params.propId}, function (err, count) {

		if (count != 1) {
					res.send("Sorry, this proposition doesn't exist.");
		}

		else{

			console.log('Notre premier vote va avoir lieu!');
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

exports.automatedAdd = function(req) {

	Vote.create({
		_id: new ObjectID(),
		slug : req.body.teamId,
		propId : req.body.propId,
		voter: req.body.voter,
		delegation : req.body.delegation,
		content: req.body.content,
		weight: 1
	}, function (err) {
		if (err) {
            console.log("Couldn't cast the vote of the delegater:" + err);    
        } else {
           	console.log("Casted the vote of the delegater.");
            }
	});	
};
