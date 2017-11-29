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

		var username = req.body.name.toLowerCase() + "." + req.body.surname.toLowerCase();

		var hash = bcrypt.hashSync(req.body.pwd);

		//Ecriture dans la base user
		db.collection(dbusers).insertOne( {
				   	"name" : req.body.name,
				   	"surname" : req.body.surname,
				   	"username" : username,
				   	"password" : hash,
				   	"email" : req.body.email,
				   	"admin" : false,
				   	"proposer" : false,
				   	"status" : "observator",
		});

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

