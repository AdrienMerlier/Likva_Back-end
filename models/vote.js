var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var voteModelSchema = new Schema({
	_id: String,
	team : String,
	propId : String,
	delegation : Boolean,
	content: String,
});

var Vote = mongoose.model('Vote', voteModelSchema);