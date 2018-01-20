var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var Comment = new Schema({
	content: String,
	authorDisplay : String,
	authorId : String,
	date: Date,
	subcomments:[{
		content: String,
        authorDisplay: String,
        authorId: String,
        date: Date
	}
	]
});

var propositionModelSchema = new Schema({
	_id: String,
	slug: String,
	category: String,
	title : String,
	author: String,
	authorLink: String,
	summary : String,
	description : String,
	change : String,
	consequences : String,
	document1 : String,
	document2 : String,
	document3 : String,
	document4 : String,
	document5 : String,
	information: String,
	type: String,
	date : Date,
	numberOfVotes: Number,
	votePossibilities: [String],
	labels: [String],
	data: [Number],
	verdict: String,
	comments: [Comment]
});

var Proposition = mongoose.model('Proposition', propositionModelSchema);
var Comment = mongoose.model('Comment', Comment);