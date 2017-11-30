var mongoose = require('mongoose'),
Schema = mongoose.Schema;

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

mongoose.model('User', userModelSchema);
