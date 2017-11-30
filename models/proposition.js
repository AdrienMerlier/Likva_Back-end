var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var propositionModelSchema = new Schema({
	_id: String,
	title : String,
	summary : String,
	description : String,
	proposition : String,
	consequences : String,
	document1 : String,
	document2 : String,
	document3 : String,
	document4 : String,
	document5 : String,
	proposer : Boolean,
	information: String,
	quorum : [Number],
	type: String,
	date : Date
});

var Proposition = mongoose.model('Proposition', propositionModelSchema);