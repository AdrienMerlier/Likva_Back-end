var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

var slug = require('slugify')
_ = require('underscore');



Teamuser = mongoose.model('TeamUser');
User = mongoose.model('User');


exports.findAll = function(req, res) {
	TeamUser.find({}, function(err, users) {
    	res.json(users);
  	});

};

exports.findTeamUsers = function(req, res) {

	console.log(req.params.teamId);
	
	TeamUser.find({slug: req.params.teamId}, function(err, users) {

	    res.send(
	    	{
	    	success: true,
			users: users
			});
  	});
};

exports.findDelegates = function(req, res) {

	Proposition.find({_id: req.headers.idproposition}, function(err, prop) {

		if(prop[0].category == undefined){

			res.send(
	    	{
	    	success: true,
			delegateList: []
			});
		}

		else{

			TeamUser.find({slug: req.params.teamId}).elemMatch("delegable", {"categoryName":prop[0].category}).exec(function(err, delegates) {

				var delegatesClean = delegates.filter(function (el) {
					return el.email !== req.headers.useremail;
				});

			    res.send(
			    	{
			    	success: true,
					delegateList: delegatesClean
				});
		  	});
		}
    	
  	});
};

exports.findDelegatesByCategory = function(req, res) {

	//To redo
	
	TeamUser.find({slug: req.params.teamId}).elemMatch("delegable", {"categoryName":req.params.categoryName}).exec(function(err, delegates) {

		var delegatesClean = delegates.filter(function (el) {
			return el.email !== req.headers.useremail;
		});

	    res.send(
	    	{
	    	success: true,
			delegateList: delegatesClean
		});
  	});
};

exports.findById = function() {
};

exports.findDelegateForCategory = function (req, res) {

	var currentDelegate = null;

	//Find current delegate for a given category
	TeamUser.find({slug: req.params.teamId, email: req.headers.useremail}, function (err, teamUser) {
		if (!teamUser) {
			res.send({success: false, message: "The teamUser doesn't exist"});
		}
		else{

			if (teamUser[0].delegation.length == 0) {
				currentDelegate = [{
					delegate : null
				}];

			}
			else{
				currentDelegate = teamUser[0].delegation.filter(function (el) {
					return el.categoryName == req.params.categoryName;
				});
				if(currentDelegate == undefined){
					currentDelegate = [{
					delegate : null
				}];
				}
			}

			//Get list of all delegates
			TeamUser.find({slug: req.params.teamId, delegable: true}, function(err, delegates) {

				if (delegates == undefined) {
					res.send({
				   		success: true,
				   		currentDelegate: currentDelegate[0].delegate,
						delegateList: []
					});
				}

				else{
					var delegatesClean = delegates.filter(function (el) {
						return el.email !== req.headers.useremail;
					});

					res.send({
				   		success: true,
				   		currentDelegate: currentDelegate[0].delegate,
						delegateList: delegatesClean
					});
				}

	  		});
		}

	});
};

exports.becomeDelegate = function (req, res) {

	TeamUser.find({slug: req.params.teamId, userId: req.body.userId}, function (err, teamUser) {
		if (!teamUser) {
			res.send({success: false, message: "The teamUser doesn't exist"});
		}
		else{
			//Check if the user is already a delegate

			var delegableForCategory = _.find(teamUser[0].delegable, function(val){ 
				return val.categoryName == req.params.category;
			});

			if(delegableForCategory != undefined){
				res.send({success: false, message: "The user is already delegate"});
			}
			else{
				
				Teamuser.findOneAndUpdate({slug: req.params.teamId, userId: req.body.userId}, {$push: {delegable: {categoryName: req.params.categoryName, delegable: true}}}, function (err, teamUser) {
            		if (err) throw err;

            		res.send({success: true});

            	});
			}	
		}

	});

};

exports.removeMyselfDelegate = function (req, res) {

	TeamUser.find({slug: req.params.teamId, userId: req.body.userId}, function (err, teamUser) {
		if (!teamUser) {
			res.send({success: false, message: "The teamUser doesn't exist"});
		}
		else{
			//Check if the user is already a delegate
				
			Teamuser.findOneAndUpdate({slug: req.params.teamId, userId: req.body.userId}, {$pull: {delegable: {categoryName: req.params.categoryName}}}, function (err, teamUser) {
            	if (err) throw err;

            	res.send({success: true});

            });
		}

	});

};


exports.addFirstUser = function(req, res) {

	User.findOne({ email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
            	console.log('User not found');
              //res.send({ success: false, message: 'User not found.' });
            } else if (user) {

				var new_teamUser = {
				   	slug: slug(req.body.teamName),
				   	userId: user._id,
				   	email: user.email,
				   	displayName: user.username,
					admin : true,
					proposer : true,
					status : "Voter",
					description: "Bienvenue sur mon profil!",
					delegable: [],
					delegation : []
				}

				//A revoir
				Teamuser.create(new_teamUser, function (err, teamUser) {
					if (err) {
		                    console.log("Error while adding TeamUser: " + teamUser);    
	                } 
				});

				return 0;
            	
        	}   
    });
};

exports.addSimpleUser = function(req, res) {

	User.findOne({ email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
            	res.send({
					success: false,
					message: "The user doesn't exist."
				}); 

            } else if (user) {

				var new_teamUser = {
				   	slug: req.params.teamId,
				   	userId: user._id,
				   	email: user.email,
				   	displayName: user.username,
					admin : false,
					proposer : true,
					status : "Voter",
					description: "Bienvenue sur mon profil!",
					delegable: [],
					delegation : []
				};

				//A revoir
				Teamuser.create(new_teamUser, function (err, teamUser) {
					if (err) {
						console.log("Error while adding the teamUser.");   
	                }
				});
            	
        	}   
    });
};

exports.addUserViaAdmin = function(req, res) {

	User.findOne({ email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
            	console.log('User not found');

            } else if (user) {

				var new_teamUser = {
				   	slug: req.params.teamId,
				   	email: user.email,
					admin : (req.body.admin =="Oui"),
					proposer : (req.body.proposer =="Oui"),
					status : req.body.type,
					delegable: [],
					delegation : [],
				};

				//A revoir
				Teamuser.create(new_teamUser, function (err, teamUser) {
					if (err) {
		                    console.log("Error while adding TeamUser via admin: " + teamUser);    
	                } else {
						console.log("TeamUser should have been created");
					}
				});

				return 0;
            	
        	}   
    });
};


exports.addDelegate = function(req, res) {
	
	TeamUser.findOne({ email: req.body.voter, slug: req.params.teamId}, function(err, teamUser) {

            if (err) throw err;

            if (!teamUser) {
            	res.send({
					success: false,
					message: "Your team member does't exist. Weird."
				});
            } else if (teamUser) {

            	//Controle if user have already a delegate for the category

            	var delegateExist = teamUser.delegation.filter(function (item) {return item.categoryName == req.params.categoryName;}) 
				var emptyArray = [];

            	if (delegateExist.length){

            		//Add review of the delegate
            		TeamUser.update(
            			{_id: teamUser._id, 'delegation.category': req.params.categoryId},
            			{'$set': {
            				'delegation.$.delegate': req.body.delegate
            			}},
            			function (err) {
            				if (err) {
            					res.send({
									success: false,
									message: "Error while updating the delegate."
								});
            				}
            				else{
            					res.send({
									success: true,
								});
            				}
            			}

            		);
            		
            	}
            	

            	else{

            		var new_delegate = {
				   		categoryName: req.params.categoryName,
				   		delegate: req.body.delegate
					};

					console.log(new_delegate);

					TeamUser.update(
					    { _id: teamUser._id }, 
					    { $push: { delegation: new_delegate } },
					    function (err) {
            				if (err) {
            					res.send({
									success: false,
									message: "Error while adding a delegate."
								});
            				}
            				else{
            					res.send({
									success: true,
								});
            				}
            			}
					);		
            	}
        	}   
    });
};

exports.removeDelegate = function(req, res) {
	
	TeamUser.findOne({ email: req.body.voter, slug: req.params.teamId}, function(err, teamUser) {

            if (err) throw err;

            if (!teamUser) {
            	res.send({
					success: false,
					message: "Your team member does't exist. Weird."
				});


            } else if (teamUser) {

            	console.log(req.body.categoryName);

            	TeamUser.update({ email: req.body.voter, slug: req.params.teamId}, { "$pull": { "delegation": { "categoryName": req.body.categoryName } }}, { safe: true, multi:true }, function(err, obj) {

				     if(err){
				     	console.log(err)
				     }
				     else{
				     	res.send({success: true})
				     }
				});
            }   
    });
};

exports.delete = function() {};
