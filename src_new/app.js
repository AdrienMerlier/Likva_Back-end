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
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var dbvotes = "votesandpropositions";
var dbusers = db.collection('users');

//Hashing parameters
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 12;


//Database launched 


var Schema = mongoose.Schema;

var teamUserModelSchema = new Schema({
	_id: String,
	name : String,
	category: String,
	users : [[]]
});

var teamPropositionsModelSchema = new Schema({
	_id: String,
	name: String,
	categories: [[]]
});

var teamVotesModelSchema = new Schema ({
	_id: String,
	name: String,
	emargement: [[]],
	votes: [[]]
});

var userModelSchema = new Schema({
	_id: String,
	name : String,
	surname : String,
	username : String,
	password : String,
	email : String,
	admin : Boolean,
	proposer : Boolean,
	status : String,
	delegations: [[]]
});



var propositionModelSchema = new Schema({
	_id: String,
	title : String,
	summary : String,
	description : String,
	proposition : String,
	consequences : String,
	document1 : String,
	document2 : String,
	document3 : String,
	document4 : String,
	document5 : String,
	proposer : Boolean,
	information: String,
	quorum : [Number],
	type: String,
	date : Date
});

var TeamUser = mongoose.model('TeamUser', teamUserModelSchema);
var TeamPropositions = mongoose.model('TeamPropositions', teamPropositionsModelSchema)
var TeamVotes = mongoose.model('TeamVotes', teamVotesModelSchema);
var User = mongoose.model('User', userModelSchema);
var Proposition = mongoose.model('Proposition', propositionModelSchema);

//Creating a team
app.post('/newTeam', function(req, res, db) {

	dbusers.count({name: req.body.team}, function (err, count) {
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
				   	delegations: [[]]
				}
			};
			/*
			var new_teamPropositions = {
				_id: teamID,
				name: req.body.team,
				categories: [[]]
			};

			var new_teamVotes = {

			}
	*/

		dbusers.insert(new_teamUsers);

   		console.log("The team was created!");
   		res.send("Your team is created! Let's explore Likva now.");

		}
	});
});

//Functions for users
app.post('/newUser', function(req, res, db) {

	dbusers.count({name: req.body.team}, function (err, count) {

		console.log(count);

		//If the team doesn't exist
		if (count != 1) {
			console.log("The team doesn't exist");
			res.send("Sorry, this team doesn't exist.");
		} else {

			console.log("The team exist!");
			dbusers.find({name: req.body.team}).count({"users.email": req.body.email}, function (err, count2) {

				console.log(count2);

				if (count2 > 0) {
					console.log("Sorry, the user already exists");
					res.send("Sorry, this user already exist.");
				}

				else{
					console.log("The user doesn't exist, let's create it!");
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

	dbusers.insert(new_user);

   	console.log("Inserted a new user in the database.");
   	res.send("User added. Click precedent to add a new user.");
});




app.listen(3000, function(){
  console.log('Likva is listening to you on port 3000!');
});

