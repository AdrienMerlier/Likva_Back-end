var express = require('express');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://mongo:27017/likva';

var dbvotes = "votesandpropositions";
var dbusers = "users";

//Hashing parameters
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 12;


//Database launched 


//Functions for users
app.post('/newUser', function(req, res, db) {
	
	MongoClient.connect(url, function(err, db){

		var binAdmin, binProposer;
		var username = req.body.name.toLowerCase() + "." + req.body.surname.toLowerCase();

		//Hash password



		//Dealing with the binary variables
		if (req.body.admin == "Yes") {
			binAdmin = true;
		} else binAdmin = false;
		if (req.body.proposer == "Yes") {
			binProposer = true;
		} else binProposer = false;

		var hash = bcrypt.hashSync("bacon");

		//Ecriture dans la base user
		db.collection(dbusers).insertOne( {
				   	"name" : req.body.name,
				   	"surname" : req.body.surname,
				   	"username" : username,
				   	"password" : hash,
				   	"email" : req.body.email,
				   	"admin" : binAdmin,
				   	"proposer" : binProposer,
				   	"status" : req.body.status,
		});

		//Granting roles according to the status
		console.log("Gonna create some user");
		if (req.body.status == "Voter") {
			console.log("I'm talking voter");
			if (binAdmin) {
				console.log("I'm talking admin");
				if (binProposer) {
					console.log("I'm talking proposer");
					db.addUser(username, "pasadmin", { roles: [ 'teamAdmin', 'proposer', 'voter' ] });
					console.log("APV");
				}
				else{
					console.log("Ntt a proposer.");
					db.addUser(username, "pasadmin", { roles: [ 'teamAdmin', 'voter' ] });
					console.log("AP");
				}
			}
			else{
				console.log("Not an admin");
				if (binProposer) {
					console.log("I'm talking proposer");
					db.addUser(username, "pasadmin", { roles: [ 'proposer', 'voter' ] });
					console.log("PV");
				}
				else{
					console.log("Not a proposer");
					db.addUser(username, "pasadmin", { roles: [ 'voter' ] });
					console.log("V");
				}
			}
		} else if (req.body.status == "Commentator") {
			if (binAdmin) {
				if (binProposer) {
					db.addUser(username, "pasadmin", { roles: [ 'teamAdmin', 'proposer', 'commenattor' ] });
					console.log("APC");
				}
				else{
					db.addUser(username, "pasadmin", { roles: [ 'teamAdmin', 'commentator' ] });
					console.log("AC");
				}
			}
			else{
				if (binProposer) {
					db.addUser(username, "pasadmin", { roles: [ 'proposer', 'commentator' ] });
					console.log("PC");
				}
				else{
					db.addUser(username, "pasadmin", { roles: [ 'commentator' ] });
					console.log("C");
				}
			}
		} else if (req.body.status == "Observer") {
			if (binAdmin) {
				if (binProposer) {
					db.addUser(username, "pasadmin", { roles: ['teamAdmin', 'proposer', 'observator'] });
					console.log("APO");
				}
				else{
					db.addUser(username, "pasadmin", { roles: ['teamAdmin', 'observator'] });
					console.log("AO");
				}
			}
			else{
				if (binProposer) {
					db.addUser(username, "pasadmin", { roles: ['proposer', 'observator'] });
					console.log("PO");
				}
				else{
					db.addUser(username, "pasadmin", { roles: ['observator'] });
					console.log("O");
				}
			}
		}

		db.close();
   		});
   	console.log("Inserted a new user in the database.");
   	res.send("User added. Click precedent to add a new user.");
});

app.post('/deleteUser', function(req, res, db) {
	
	res.send('You asked me to remove a user(' + req.body.name + " " + req.body.surname +').');
	MongoClient.connect(url, function(err, db){
		db.collection('users').delete(req.body, (err, result) => {
			if (err) return console.log(err);
			console.log('saved to database');
		});
		
	})
	//TO ADD: returning on adding user page
});


app.post('/newProposition', function(req, res, db) {
	
	MongoClient.connect(url, function(err, db){
		db.collection('votesandpropositions').save(req.body, (err, result) => {
			if (err) return console.log(err);
			console.log('saved to database');
		});
		
	})
	//TO ADD: returning on adding user page
    res.redirect('/newUser');
});




app.listen(3000, function(){
  console.log('Likva is listening to you on port 3000!');
});

