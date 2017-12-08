var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var voteModelSchema = new Schema({
	_id: String,
	team : String,
	propId : String,
	voter: String,
	delegation : Boolean,
	content: String,
	weight: Number
});

var Vote = mongoose.model('Vote', voteModelSchema);