var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var userModelSchema = new Schema({
	_id: String,
	name : String,
	surname : String,
	username : String,
	password : String,
	email : String,
	delegations: [[]]
});

mongoose.model('User', userModelSchema);
