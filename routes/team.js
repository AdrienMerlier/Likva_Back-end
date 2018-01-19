module.exports = function(app){

	require('../models/user');
	require('../models/teamUser');
	require('../models/team');
    require('../models/vote')
    var teams = require('../controllers/team');
    var teamUsers = require('../controllers/teamUser');

    app.get('/api/teams', teams.findAll);
    app.get('/api/teams/:teamId', teams.findById);
    app.get('/api/teams/:teamId/users', teamUsers.findTeamUsers);
    app.get('/api/teams/:teamId/delegates', teamUsers.findDelegates);
    app.get('/api/teams/:teamId/categories/', teams.findCategories);
    app.get('/api/teams/:teamId/categories/:categoryName/delegate', teamUsers.findDelegateForCategory);
    app.post('/api/teams/', teams.add);
    app.post('/api/teams/:teamId/join', teams.addSimpleUser);
    app.post('/api/teams/:teamId/admin/addUser', teams.addUserViaAdmin);
    app.post('/api/teams/:teamId/users/modify', teamUsers.updateRights);
    app.post('/api/teams/:teamId/users/modify', teamUsers.eraseUser);
    app.post('/api/teams/:teamId/categories/', teams.addCategory);
    app.post('/api/teams/:teamId/categories/:categoryName/delegate', teamUsers.addDelegate);
    app.post('/api/teams/:teamId/categories/removeDelegate', teamUsers.removeDelegate);
    app.post('/api/teams/:teamId/categories/:categoryName/becomeDelegate', teamUsers.becomeDelegate);
    app.post('/api/teams/:teamId/categories/:categoryName/removeDelegate', teamUsers.removeMyselfDelegate);
    app.put('/api/teams/:teamId', teams.updateTeam);
    app.put('/api/teams/:teamId/password', teams.updateTeamPassword);
    app.delete('/api/teams/:teamId', teams.delete);

}