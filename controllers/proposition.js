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

	Team.count({teamName: req.body.teamName}, function (err, count) {

		if (count != 1) {
					res.send("Sorry, this team doesn't exist.");
		}

		else{

			/*
			if (req.session.proposer) {
				That user can propose in this team
			}
			*/

			var new_proposition = {
				_id: new ObjectID(),
				team: req.body.team,
				category: req.body.team,
				title : req.body.title,
				author: req.body.author,
				authorLink: null,
				summary : req.body.summary,
				description : req.body.description,
				proposition : req.body.proposition,
				consequences : req.body.consequences,
				document1 : req.body.url1,
				document2 : req.body.url2,
				document3 : req.body.url3,
				document4 : req.body.url4,
				document5 : req.body.url5,
				information: req.body.information,
				quorum : req.body.quorum,
				type: req.body.typeOfVote,
				date : req.body.endDate
			};

			console.log(new_proposition);


			Proposition.create(new_proposition, function (err) {
				if (err) {
                    return res.json({ success: false, message: 'Sorry, couldnt create the team.' });    
                } else {
                	res.send(202);
                }
			});
		}
	});
	
};

exports.update = function() {};
exports.delete = function() {};