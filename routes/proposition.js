module.exports = function(app){

	require('../models/proposition');
	require('../models/team');
    var propositions = require('../controllers/proposition');

    app.get('/api/teams/proposition', propositions.findAll);
    app.get('/api/teams/proposition/:id', propositions.findById);
    app.post('/api/teams/proposition', propositions.add);
    app.put('/api/teams/proposition/:id', propositions.updateTeam);
    app.delete('/api/teams/proposition/:id', propositions.delete);

}