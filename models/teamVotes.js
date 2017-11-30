var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamVotesModelSchema = new Schema ({
	_id: String,
	name: String,
	propositions: [[]]
});

var TeamVotes = mongoose.model('TeamVotes', teamVotesModelSchema);
