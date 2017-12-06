var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamUserModelSchema = new Schema({
	_id: String,
	team: String,
	email : String,
	admin : Boolean,
	proposer : Boolean,
	status : String,
	description: String,
	delegation : [[]],
});

mongoose.model('TeamUser', teamUserModelSchema);
