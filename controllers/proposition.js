var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


Team = mongoose.model('Team');
Proposition = mongoose.model('Proposition');
TeamUser = mongoose.model('TeamUser');

emargements = require('./emargement');

//Underscore, our search tool for arrays
_ = require('underscore');

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
                    res.send({ success: false, message: 'Sorry, couldnt create the proposition.', potential_prop: new_proposition });    
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

exports.getResults = function (req, res) {
	Proposition.find({_id: req.params.propId}, function (err, prop) {
		if(!prop){
			res.send({ success: false, message: 'Sorry, couldnt find the proposition.'});
		} else if(prop){

			//Check is vote is over

			if(Date.now < prop.date){

				res.send({ success: false, message: 'Sorry, couldnt find the proposition.'});
			
			} else {

				//Check if results are present

				if (prop.results) {
					res.send({ success: true, results: prop.results});
				}

				else{
					//Delegate the votes that should be calculated
					TeamUser.find({
					    'delegation.category': prop.category ,
					    slug: req.params.teamId}, //Not sure this work
						function (err, delegaters) {
							if (err) {console.log(err);}

							if(!delegaters){
								console.log("There are no automated delegation in this team");
							} else if(delegaters){
								//Loop to make these guys vote. If they have already vote it, they won't do it again!

								for(var d=0; d<delegaters.length; d++){ 

									delegater = delegater[d];

									var categoryInfo = _.find(delegater.delegation, function(item){
										return item.category == prop.category;
									});
					
									var new_vote = {
										slug : req.params.teamId,
										propId : req.params.propId,
										email: req.body.email,
										voter: req.body.email,
										delegation : true,
										content: categoryInfo.delegate
									};

									emargements.automatedAdd(new_vote, function (err) {
										if (err) {
											console.log(err);
						                }
									});

								}    
							}
							//Compiling the votes
						}
					);
				}

			}
		}
	});
}

exports.update = function() {};
exports.delete = function() {};