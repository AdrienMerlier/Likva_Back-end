var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var slug = require('slugify')


Teamuser = mongoose.model('TeamUser');
User = mongoose.model('User');


exports.findAll = function(req, res) {
	TeamUser.find({}, function(err, users) {
    	res.json(users);
  	});

};

exports.findDelegates = function(req, res) {
	TeamUser.find({slug: req.params.teamId, delegable: true}, function(err, delegates) {
    	res.send({sucess: true,
		  delegateList: delegates});
  	});
};

exports.findById = function() {
};

exports.addFirstUser = function(req, res) {

	console.log("I'm in the function. Request is: " +req.body);

	User.findOne({ email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
            	console.log('User not found');
              //res.send({ success: false, message: 'User not found.' });
            } else if (user) {

				console.log("The user is:" + user);

				var new_teamUser = {
				   	slug: slug(req.body.teamName),
				   	email: user.email,
				   	displayName: user.username,
					admin : true,
					proposer : true,
					status : "Voter",
					delegable: true,
					delegation : [],
				};

				console.log(new_teamUser);

				//A revoir
				Teamuser.create(new_teamUser, function (err, teamUser) {
					if (err) {
		                    console.log("Error while adding TeamUser: " + teamUser);    
	                } else {
						console.log("TeamUser should have been created");
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

				console.log("The user is:" + user);

				var new_teamUser = {
				   	slug: req.params.teamId,
				   	email: user.email,
					admin : false,
					proposer : false,
					status : "Voter",
					delegable: true,
					delegation : [],
				};

				console.log(new_teamUser);

				//A revoir
				Teamuser.create(new_teamUser, function (err, teamUser) {
					if (err) {
						console.log("Error while adding the teamUser.");   
	                } else {
						console.log("Teamuser has been added.");
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
					delegable: (req.body.delegable =="Oui"),
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
	
	TeamUser.findOne({ email: req.body.email, slug: req.params.teamId}, function(err, teamUser) {

            if (err) throw err;

            if (!teamUser) {
            	res.send({
					success: false,
					message: "Your team member does't exist. Weird."
				});
            } else if (teamUser) {

				console.log("The TeamUser is:" + teamUser);

            	//Controle if user have already a delegate for the category

            	var delegateExist = teamUser.delegation.filter(function (item) {return item.category == categoryId;}) 
				
            	if (delegateExist != null){
            		//Add review of the delegate
            		TeamUser.update(
            			{_id: teamUser._id, 'delegation.category': req.params.categoryId},
            			{'$set': {
            				'delegation.$.delegateId': req.body.delegateId
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
				   		category: req.params.categoryId,
				   		delegate: req.body.delegateId
					};

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

exports.delete = function() {};
