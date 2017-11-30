var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamUserModelSchema = new Schema({
	_id: String,
	username : String,
	admin : Boolean,
	proposer : Boolean,
	status : String,
	delegation : [[]],
});

mongoose.model('TeamUser', teamUserModelSchema);
