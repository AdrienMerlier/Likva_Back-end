var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var emargementModelSchema = new Schema({
	_id: String,
	team : String,
	propId : String,
	username: String,
});

var Emargement = mongoose.model('Emargement', emargementModelSchema);