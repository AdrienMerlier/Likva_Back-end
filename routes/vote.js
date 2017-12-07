module.exports = function(app){

	require('../models/vote');
    var votes = require('../controllers/vote');


    app.get('/api/teams/:teamId/proposition/:propId/votes', votes.findByProposition);
    app.post('/api/teams/:teamId/proposition/:propId/votes', votes.add);
}