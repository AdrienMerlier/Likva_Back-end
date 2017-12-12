var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


Team = mongoose.model('Team');
Proposition = mongoose.model('Proposition');


exports.findAll = function(req, res) {
	Proposition.find({team: req.body.team}, function(err, props) {
    	res.json(props);
  	});
};

exports.findById = function(req, res) {
	Proposition.find({team: req.body.team, _id: req.body._id}, function(err, props) {
    	res.json(props);
  	});
};

exports.findByCategory = function(req, res) {
	Proposition.find({team: req.body.team, category: req.body.category}, function(err, props) {
    	res.json(props);
  	});
};

exports.add = function(req, res) {

	console.log("I am in the function. Request vote options are:" + req.body.votePossibilities);

	Team.count({slug: req.params.teamId}, function (err, count) {

		console.log("The count is " + count);

		if (count != 1) {
					res.send("Sorry, this team doesn't exist.");
		}

		else{

			/*
			if (req.session.proposer) {
				That user can propose in this team
			}
			*/

			var arrayOfPossibilities = String(req.body.votePossibilities).split(",");

			var new_proposition = {
				_id: new ObjectID(),
				slug: req.params.teamId,
				category: req.body.category,
				title : req.body.title,
				author: req.body.author,
				authorLink: null,
				summary : req.body.summary,
				description : req.body.description,
				proposition : req.body.proposition,
				consequences : req.body.consequences,
				information: req.body.information,
				quorum : req.body.quorum,
				type: req.body.typeOfVote,
				votePossibilities: arrayOfPossibilities,
				date : Date(req.body.endDate),
				verdict : "onGoing"
			};

			Proposition.create(new_proposition, function (err) {
				if (err) {
					console.log(err);
                    return res.json({ success: false, message: 'Sorry, couldnt create the proposition.', potential_prop: new_proposition });    
                } else {
                	res.send({ 
                		success: true, 
                		proposition: new_proposition
                	});
                }
			});
		}
	});
	
};

exports.update = function() {};
exports.delete = function() {};