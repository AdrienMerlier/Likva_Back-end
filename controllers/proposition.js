var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


Team = mongoose.model('Team');
Proposition = mongoose.model('Proposition');
TeamUser = mongoose.model('TeamUser');
Vote = mongoose.model('Vote');
Comment = mongoose.model('Comment');

emargements = require('./emargement');
votes = require('./vote');

//Underscore, our search tool for arrays
_ = require('underscore');
var Promise = require("bluebird");


exports.findAll = function(req, res) {
	Proposition.find({slug: req.params.teamId}, function(err, props) {
    	res.send({success:true, props: props});
  	});
};

exports.findById = function(req, res) {

	console.log("Je suis dans la proposition");
	Proposition.find({slug: req.params.teamId, _id: req.params.propId}, function(err, prop) {

    	res.send({success:true, props: prop});
  	});
};

exports.findByAuthor = function(req, res) {
	Proposition.find({authorLink: req.headers.authorid}, function(err, prop) {
    	res.send({success:true, props: prop});
  	});
};

exports.findByCategory = function(req, res) {

	var isDelegate = false

	Proposition.find({slug: req.params.teamId, category: req.params.category}, function(err, props) {

		TeamUser.find({slug: req.params.teamId, userId: req.headers.userid}, function (err, teamUser) {
			
			var delegableForCategory = _.find(teamUser[0].delegable, function(val){ 
				return val.categoryName == req.params.category;
			});

			if(delegableForCategory != undefined){
				isDelegate = true; //The person is a delegate for this category
				console.log("Je suis délégué!");
			}

			res.send({
				success: true,
				isDelegate: isDelegate,
				props: props
			});

		});
  	});
};

exports.findDelegations = function(req, res) {
	Proposition.find({team: req.body.team, category: req.body.category}, function(err, props) {
    	res.json(props);
  	});
};

exports.add = function(req, res) {

	Team.count({slug: req.params.teamId}, function (err, count) {

		if (count != 1) {
					res.send("Sorry, this team doesn't exist.");
		}

		else{

			/*
			if (req.session.proposer) {
				That user can propose in this team
			}
			*/
			console.log(req.body);

			var arrayOfPossibilities = String(req.body.votePossibilities).split(",");

			if (req.body.type == "MostVotesSeveralWinners") {
				var numberOfWinners = req.body.numberOfWinners:
			} else {
				var numberOfWinners = undefined;
			}

			var new_proposition = {
				_id: new ObjectID(),
				slug: req.params.teamId,
				category: req.body.category,
				title : req.body.title,
				author: req.body.author,
				authorLink: req.body.authorLink,
				summary : req.body.summary,
				description : req.body.description,
				change : req.body.change,
				consequences : req.body.consequences,
				information: req.body.information,
				type: req.body.type,
				numberOfWinners: numberOfWinners,
				numberOfVotes: 0,
				votePossibilities: arrayOfPossibilities,
				date : Date.parse(req.body.endDate),
				comments: [],
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

exports.delegatFinale = function(req, res){

	Proposition.find({_id: req.params.propId}, function (err, prop) {

		if(!prop){

			res.send({ success: false, message: 'Sorry, couldnt find the proposition.'});

		} else if(prop){

			//Check is vote is over

			if(Date.now()-Date.parse(prop[0].date) > 0){

				console.log("La date limite n'est pas passé.");

				res.send({ success: false, message: "Désolé, la date limite de vote n'est pas passé."});
			
			} else {

				console.log("La date limite est passé.");

				//Check if results are present

				if (prop[0].data.length > 0) {
					console.log("J'envoie les résultats direct.");
					res.send({ success: true, labels: prop[0].labels, data:prop[0].data, verdict: prop[0].verdict});
				}

				else{

					//Delegate the votes that should be calculated
					TeamUser.find({
					    'delegation.category': prop.category ,
					    slug: req.params.teamId}, //Not sure this work
						function (err, delegatersList) {
							if (err) {console.log(err);}

							if(!delegatersList){
								


							} else if(delegatersList){
								//Loop to make these guys vote. If they have already vote it, they won't do it again!

								delegateByCategory(req, delegatersList, prop).then(function () {
									
									//Renvoie requete true

									res.send({ success: true, message: 'Delegates were updated.'});
								});

							}
						}
					);

			}

			}
		}
	});
}

exports.delegateGeneral = function(req, res){

	Proposition.find({_id: req.params.propId}, function (err, prop) {

		if(!prop){

			res.send({ success: false, message: 'Sorry, couldnt find the proposition.'});

		} else if(prop){

			//Check is vote is over

			if(false){

				res.send({ success: false, message: 'Sorry, couldnt find the proposition.'});
			
			} else {

				//Check if results are present

				moveDelegations(req, res);

			}
		}
	});
}

//Function called to delegate votes by category
function delegateByCategory(req, delegatersList, prop) {

	return new Promise(function(resolve, reject) {

	    for(var d=0; d<delegatersList.length; d++){ 

			delegater = delegatersList[d];

			var categoryInfo = _.find(delegater.delegation, function(item){
				return item.category == prop.category;
			});
				
			var new_vote = {
				teamId : req.params.teamId,
				propId : req.params.propId,
				voter: delegater.email,
				delegation : true,
				content: categoryInfo.delegate
			};

			emargements.automatedAdd(new_vote, function (err) {
				if (err) {
					console.log(err);
		        }
			});
			console.log("Mon vote de catégorie à été fait.");
		} 

	    if (true) {
	      resolve("Hi");
	    } else {
	      reject(new Error('User cancelled'));
	    }
  });
}
	

function calculateResults(proposition, req, res) {

	TeamUser.count({slug: proposition.slug}, function (totalVoters) {
		
		Vote.find({propId: req.params.propId}, function(err, votesToCount) {

		//If pour le type de vote

		var holder = {};

		votesToCount.forEach(function(d){
			if (holder.hasOwnProperty(d.content)) {
				holder[d.content] = holder[d.content] + d.weight;
			}
			else{
				holder[d.content] = d.weight;
			}
		});

		var finalLabels = [];
		var finalData = [];
		var finalVerdict = null;

		console.log("Going to sum it up.");

		if (proposition.type == "MostVotes") {

			var bestScore=0;

			for (var prop in holder) {

				if(holder[prop]>0 && proposition.votePossibilities.indexOf(prop) > -1){

					console.log("Le duo est: " + prop + "&" + holder[prop]);

					finalLabels.push(prop);
					finalData.push(holder[prop]);
					if (holder[prop]>bestScore) {
						bestScore=holder[prop];
						finalVerdict=prop;
					}
					else if(holder[prop]==bestScore){
						finalVerdict="Egalité!";
					}
				}

			}

		}

		else if (proposition.type == "AbsoluteMajority") {

			for (var prop in holder) {

				if(holder[prop]>0 && proposition.votePossibilities.indexOf(prop) > -1){

					console.log("Le duo est: " + prop + "&" + holder[prop]);

					finalLabels.push(prop);
					finalData.push(holder[prop]);
				}

			}

			var totalValidVotes = finalData.reduce((a, b) => a + b, 0);

			//Vérifie qu'une majorité a été atteinte

			for (var s in finalData){
				if (finalData[s] > totalValidVotes/2) {
					finalVerdict = finalLabels[s];
				}
			}


			//Si on n'a pas trouvé de majorité 

			if (finalVerdict == "onGoing") {
				finalVerdict = "Pas de majorité";
			}

		}


		console.log("La liste final de labels est: " + finalLabels);
		console.log("La liste final de data est: " + finalData);


		Proposition.update({ _id: req.params.propId }, { $set: { labels: finalLabels, data: finalData, verdict: finalVerdict, numberOfVotes: totalValidVotes, potentialVoters: totalVoters }}, function (err) {
			if(err){
				res.send({success: false, message:"Sorry, there was an error while updating the results."});
			}
			else{
				res.send({success: true, labels: finalLabels, data: finalData, verdict: finalVerdict});
			}
		});

	});

	});

}

function moveDelegations (req, res) {

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
  	});

  	res.send({success: true});
}

exports.getResults = function (req, res) {
	Proposition.find({_id: req.params.propId}, function (err, prop) {
		if(!prop){
			res.send({ success: false, message: 'Sorry, couldnt find the proposition.'});
		} else if(prop){

			//Check is vote is over

			if(false){

				res.send({ success: false, message: 'Sorry, couldnt find the proposition.'});
			
			} else {

				//Check if results are present
				console.log(prop[0].data.length);

				if (prop[0].data.length > 0) {
					console.log("J'envoie les résultats direct.");
					res.send({ success: true, labels: prop[0].labels, data:prop[0].data, verdict: prop[0].verdict});
				}

				else{

					calculateResults(prop[0], req, res);

				}

			}
		}
	});
}

exports.update = function(req, res) {

	Proposition.count({_id: req.params.propId}, function (err, count) {

		if (count = 1) {
					console.log("Je suis dans la bonne proposition");
		}


	const doc = {
	    title: req.body.proposition.title,
		summary : req.body.proposition.summary,
		description : req.body.proposition.description,
		change : req.body.proposition.change,
		consequences : req.body.proposition.consequences
  	};

	Proposition.update(
		{_id: req.params.propId}, //query
		doc,
		function (err, raw) {
			if (err) return handleError(err);
			else{
				console.log("Message suivant: "+ raw);
				res.send({success: true});
			}
		});
	});
};

exports.addComment = function(req, res) {

	console.log(Date.parse(req.body.date));

	Proposition.count({_id: req.params.propId}, function (err, count) {

		if (count != 1) {
			res.send({success:false, message:"Sorry couldn't find your proposition"});
		}
		else{

			var newComment = new Comment({
				content: req.body.content,
      			authorDisplay: req.body.authorDisplay,
      			authorId: req.headers.authorid,
      			date: req.body.date,
      			subcomments: []
			});

			console.log(newComment);

			Proposition.update(
				{_id: req.params.propId}, 
				{ $push: { comments: newComment } }, 
				{ 'new': true},
				function (err, prop) {
					console.log(prop);
					res.send({success:true, updatedProp: prop});
			})

		}
	});

};

exports.addSubcomment = function() {};

exports.delete = function() {};
