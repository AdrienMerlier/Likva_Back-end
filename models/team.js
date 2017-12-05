var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamModelSchema = new Schema({
	_id: String,
	teamName : String,
	displayName: String,
	type: String,
	password : String,
	users: [[]]
});

mongoose.model('Team', teamModelSchema);
