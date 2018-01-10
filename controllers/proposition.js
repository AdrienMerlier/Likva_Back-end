var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


Team = mongoose.model('Team');
Proposition = mongoose.model('Proposition');
TeamUser = mongoose.model('TeamUser');
Vote = mongoose.model('Vote');

emargements = require('./emargement');
votes = require('./vote');

//Underscore, our search tool for arrays
_ = require('underscore');

exports.findAll = function(req, res) {
	Proposition.find({slug: req.params.teamId}, function(err, props) {
    	res.send({success:true, props: props});
  	});
};

exports.findById = function(req, res) {
	Proposition.find({slug: req.params.teamId, _id: req.params.propId}, function(err, prop) {
    	res.send({success:true, props: prop});
  	});
};

exports.findByAuthor = function(req, res) {
	Proposition.find({authorLink: req.params.email}, function(err, prop) {
    	res.send({success:true, props: prop});
  	});
};

exports.findByCategory = function(req, res) {
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

			console.log("La catégorie est: "+ req.body.category);

			var arrayOfPossibilities = String(req.body.votePossibilities).split(",");

			var new_proposition = {
				_id: new ObjectID(),
				slug: req.params.teamId,
				category: req.body.category,
				title : req.body.title,
				author: req.body.author,
				authorLink: req.body.email,
				summary : req.body.summary,
				description : req.body.description,
				change : req.body.change,
				consequences : req.body.consequences,
				information: req.body.information,
				type: req.body.typeOfVote,
				votePossibilities: arrayOfPossibilities,
				date : Date(req.body.endDate),
				verdict : "onGoing"
			};

			console.log(new_proposition.slug);

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

					console.log("Going to calculate.");
					//Delegate the votes that should be calculated
					TeamUser.find({
					    'delegation.category': prop.category ,
					    slug: req.params.teamId}, //Not sure this work
						function (err, delegatersList) {
							if (err) {console.log(err);}

							if(!delegatersList){
								console.log("There are no automated delegation in this team");

								//Caldul des délégations

								votes.moveDelegations(req, function (err) {
									if (err) {
										console.log(err);
									}

									//Calcul des résultats
									Vote.find({propId: req.params.propId}, function(err, votesToCount) {
										var holder = {};

										console.log("Going to sum it up.");

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
										var bestScore=0;
										var finalVerdict = null;

										for (var prop in holder) {
											if(holder[prop]>0){

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

										console.log("La liste final de labels est: " + finalLabels);
										console.log("La liste final de data est: " + finalData);


										Proposition.update({ _id: req.params.propId }, { $set: { labels: finalLabels, data: finalData, verdict: finalVerdict }}, function (err) {
											if(err){
												res.send({success: false, message:"Sorry, there was an error while updating the results."});
											}
											else{
												res.send({success: true, labels: finalLabels, data: finalData, verdict: finalVerdict});
											}
										});

								});

								});

							} else if(delegatersList){
								//Loop to make these guys vote. If they have already vote it, they won't do it again!

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



								}  

								console.log("I am done with delegating votes for categories.");

								votes.moveDelegations(req, function (err) {
									if (err) {
										console.log(err);
									}

									//Calcul des résultats
									Vote.find({propId: req.params.propId}, function(err, votesToCount) {
										var holder = {};

										console.log("Going to sum it up.");

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
										var bestScore=0;
										var finalVerdict = null;

										for (var prop in holder) {
											if(holder[prop]>0){

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

										console.log("La liste final de labels est: " + finalLabels);
										console.log("La liste final de data est: " + finalData);


										Proposition.update({ _id: req.params.propId }, { $set: { labels: finalLabels, data: finalData, verdict: finalVerdict }}, function (err) {
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
						}
					);

			}

			}
		}
	});
}

exports.update = function(req, res) {

	console.log("PropID: " + JSON.stringify(req.params));

	Proposition.count({_id: req.params.propId}, function (err, count) {

		if (count = 1) {
					console.log("Je suis dans la bonne proposition");
		}

	console.log("update: " + JSON.stringify(req.body));


	const doc = {
	    title: req.body.proposition.title,
		summary : req.body.proposition.summary,
		description : req.body.proposition.description,
		change : req.body.proposition.change,
		consequences : req.body.proposition.consequences
  	};

  	console.log(doc);


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

exports.delete = function() {};