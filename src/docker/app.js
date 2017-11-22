var express = require('express');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://mongo:27017/likva';

var dbvotes = "votesandpropositions";
var dbusers = "users";

//Database launched 


//Functions for users
app.post('/newUser', function(req, res, db) {
	
	MongoClient.connect(url, function(err, db){

		var binAdmin, binProposer;
		var username = req.body.name + "." + req.body.surname;

		//Dealing with the binary variables
		if (req.body.admin == "Yes") {
			binAdmin = true;
		} else binAdmin = false;
		if (req.body.proposer == "Yes") {
			binProposer = true;
		} else binProposer = false;


		//Ecriture dans la base user
		db.collection(dbusers).insertOne( {
		   	"name" : req.body.name,
		   	"surname" : req.body.surname,
		   	"username" : username,
		   	"password" : "pasadmin",
		   	"email" : req.body.email,
		   	"admin" : binAdmin,
		   	"proposer" : binProposer,
		   	"status" : req.body.status,
		 });

		//Creation of the user in the DB
		db.createUser( { 'user': username,
						 'pwd': "pasadmin",
						 roles: []

		});

		//Granting roles according to the status
		if (req.body.status == "voter") {
			if (binProposer) {
				if (binProposer) {
					db.grantsRolesToUser(username, ['teamAdmin', 'proposer', 'voter']);
				}
				else{
					db.grantsRolesToUser(username, ['teamAdmin', 'voter']);
				}
			}
			else{
				if (binProposer) {
					db.grantsRolesToUser(username, ['proposer', 'voter']);
				}
				else{
					db.grantsRolesToUser(username, ['voter']);
				}
			}
		} else if (req.body.status == "commentor") {
			if (binProposer) {
				if (binProposer) {
					db.grantsRolesToUser(username, ['teamAdmin', 'proposer', 'commentor']);
				}
				else{
					db.grantsRolesToUser(username, ['teamAdmin', 'commentor']);
				}
			}
			else{
				if (binProposer) {
					db.grantsRolesToUser(username, ['proposer', 'commentor']);
				}
				else{
					db.grantsRolesToUser(username, ['commentor']);
				}
			}
		} else if (req.body.status == "observator") {
			if (binProposer) {
				if (binProposer) {
					db.grantsRolesToUser(username, ['teamAdmin', 'proposer', 'observator']);
				}
				else{
					db.grantsRolesToUser(username, ['teamAdmin', 'observator']);
				}
			}
			else{
				if (binProposer) {
					db.grantsRolesToUser(username, ['proposer', 'observator']);
				}
				else{
					db.grantsRolesToUser(username, ['observator']);
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

