var express = require('express');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

//Database setup
var url = 'mongodb://mongo:27017/likva';
mongoose.connect(url, {
  useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var dbvotes = db.collection('votesAndEmargements');
var dbpropositions = db.collection('categoriesAndPropositions');
var dbteams = db.collection('teams');
var dbusers = db.collection('users');

 

//Hashing parameters
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 12;

require('./models/user.js');
require('./models/proposition.js');
require('./models/teamUsers.js');
require('./models/teamPropositions.js');
require('./models/teamVotes.js');
require('./routes')(app);


//Creating a team
app.post('/newTeam', function(req, res, dbteams) {

	dbteams.count({name: req.body.team}, function (err, count) {
		if(count>0){
			console.log(count);
			res.send("Sorry, this team name already exists.");
		} else {

			var username = req.body.name.toLowerCase() + "." + req.body.surname.toLowerCase();
			var hash = bcrypt.hashSync(req.body.pwd);
			var teamID = new ObjectID();

			var new_teamUsers = {
				_id: teamID,
				name : req.body.team,
				category : req.body.category,
				users : {
				   	_id: new ObjectID(),
				   	name : req.body.name,
				   	surname : req.body.surname,
				   	username : username,
				   	password : hash,
				   	email : req.body.email,
				   	admin : true,
				   	proposer : true,
				   	status : "voter",
				   	delegations: null
				}
			};
			
			var new_teamPropositions = {
				_id: teamID,
				name: req.body.team,
				categories: null
			};

			var new_teamVotes = {
				_id: teamID,
				name: req.body.team,
				propositions: null
			}
		

		dbteams.insert(new_teamUsers);
		dbpropositions.insert(new_teamPropositions);
		dbvotes.insert(new_teamVotes);

   		console.log("The team was created!");
   		res.send("Your team is created! Let's explore Likva now.");

		}
	});
});

//Functions for users
app.post('/api/controller/user', function(req, res, db) {

	dbteams.count({name: req.body.team}, function (err, count) {

		//If the team doesn't exist
		if (count != 1) {
			res.send("Sorry, this team doesn't exist.");
		} else {

			dbteams.find({name: req.body.team}).count({"users.email": req.body.email}, function (err, count2) {

				console.log(count2);

				if (count2 > 0) {
					res.send("Sorry, this user already exist.");
				}

				else{
					var username = req.body.name.toLowerCase() + "." + req.body.surname.toLowerCase();
					var hash = bcrypt.hashSync(req.body.pwd);
					

					var new_user = {
								   	_id: new ObjectID(),
								   	name : req.body.name,
								   	surname : req.body.surname,
								   	username : username,
								   	password : hash,
								   	email : req.body.email,
								   	admin : false,
								   	proposer : false,
								   	status : "observator",
								   	delegations: [[]]
						};

					TeamUser.update(
						{name: req.body.team},
						{$push: {users: new_user}}
					);

					req.session.userId = new_user._id;

				   	console.log("Inserted a new user in the database.");
				   	res.send("User added. Click precedent to add a new user.");
				}
			});
			
		}
	});

});


app.post('/deleteUser', function(req, res, db) {
	//TO REDO
	res.send('You asked me to remove a user(' + req.body.name + " " + req.body.surname +').');
	MongoClient.connect(url, function(err, db){
		db.collection('users').delete(req.body, (err, result) => {
			if (err) return console.log(err);
			console.log('saved to database');
		});
		
	})
});


app.post('/newProposition', function(req, res, db) {

	var new_propositions = {
				   	_id: new ObjectID(),
				   	name : req.body.name,
				   	surname : req.body.surname,
				   	username : username,
				   	password : hash,
				   	email : req.body.email,
				   	admin : false,
				   	proposer : false,
				   	status : "observator"
		};

   	console.log("Inserted a new user in the database.");
   	res.send("User added. Click precedent to add a new user.");
});




app.listen(3000, function(){
  console.log('Likva is listening to you on port 3000!');
});

