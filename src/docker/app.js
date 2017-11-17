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

app.post('/newUser', function(req, res, db) {
	
	MongoClient.connect(url, function(err, db){

		//Ecriture
		db.collection(dbusers).insertOne( {
		    	"name" : req.body.name,
		    	"surname" : req.body.surname,
		    	"email" : req.body.email,
		    	"admin" : req.body.admin,
		    	"proposer" : req.body.proposer,
		    	"status" : req.body.status,
		 	});
		db.close();
   		});
   	console.log("Inserted a new user in the database.");
   	window.location.href = "new_user_added.html";
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


app.listen(3000, function(){
  console.log('Likva is listening to you on port 3000!');
});

