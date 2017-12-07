module.exports = function(app){

	require('../models/user');
	require('../models/teamUsers');
	require('../models/team');
    var teams = require('../controllers/team');

    app.get('/api/teams', teams.findAll);
    app.get('/api/teams/:teamId', teams.findById);
    app.post('/api/teams/', teams.add);
    app.put('/api/teams/:teamId', teams.updateTeam);
    app.put('/api/teams/:teamId/password', teams.updateTeamPassword);
    app.delete('/api/teams/:teamId', teams.delete);

}