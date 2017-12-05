module.exports = function(app){

	require('../models/user');
	require('../models/teamUsers');
	require('../models/team');
    var teams = require('../controllers/team');

    app.get('/api/teams', teams.findAll);
    app.get('/api/teams/:id', teams.findById);
    app.post('/api/teams/', teams.add);
    app.put('/api/teams/:id', teams.updateTeam);
    app.delete('/api/teams/:id', teams.delete);

}