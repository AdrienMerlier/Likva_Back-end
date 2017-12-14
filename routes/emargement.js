module.exports = function(app){

    var emargements = require('../controllers/emargement');
    require('../models/vote');


    app.get('/api/teams/:teamId/propositions/:propId/emargement', emargements.findByProposition);
    app.post('/api/teams/:teamId/propositions/:propId/vote', emargements.add);
}