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

exports.findUsers = function(req, res) {

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
	
	TeamUser.find({slug: req.params.teamId, delegable: true}, function(err, delegates) {

		var delegatesClean = delegates.filter(function (el) {
			return el.email !== req.headers.useremail;
		});

		//Ask Leo to send me the email of the profile

	    res.send(
	    	{
	    	success: true,
			delegateList: delegatesClean
			});
  	});
};

exports.findDelegatesByCategory = function(req, res) {

	//To redo
	
	TeamUser.find({slug: req.params.teamId, delegable: true}, function(err, delegates) {

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

				var delegatesClean = delegates.filter(function (el) {
					return el.email !== req.headers.useremail;
				});

				console.log(currentDelegate)

				res.send({
			   		success: true,
			   		currentDelegate: currentDelegate[0].delegate,
					delegateList: delegatesClean
				});

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
				   	email: user.email,
				   	displayName: user.username,
					admin : true,
					proposer : true,
					status : "Voter",
					delegable: [],
					delegation : []
				};

				console.log(new_teamUser.username)

				console.log(new_teamUser);

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
				   	email: user.email,
				   	displayName: user.username,
					admin : false,
					proposer : false,
					status : "Voter",
					delegable: [],
					delegation : []
				};

				console.log(new_teamUser);

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

				console.log("The user is:" + user);

				var new_teamUser = {
				   	slug: req.params.teamId,
				   	email: user.email,
					admin : (req.body.admin =="Oui"),
					proposer : (req.body.proposer =="Oui"),
					status : req.body.type,
					delegable: [],
					delegation : [],
				};

				console.log(new_teamUser);

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

	console.log("I am going to add a delegate");
	
	TeamUser.findOne({ email: req.body.voter, slug: req.params.teamId}, function(err, teamUser) {

            if (err) throw err;

            if (!teamUser) {
            	res.send({
					success: false,
					message: "Your team member does't exist. Weird."
				});
            } else if (teamUser) {

				console.log("The TeamUser is:" + teamUser);

            	//Controle if user have already a delegate for the category

            	var delegateExist = teamUser.delegation.filter(function (item) {return item.categoryName == req.params.categoryName;}) 
				var emptyArray = [];

				console.log(delegateExist.length);

            	if (delegateExist.length){

            		console.log("There is already a delegate");

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

            		console.log("There is no delegate");

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

	console.log("I am going to remove a delegate");
	
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
