var mongoose = require('mongoose');


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