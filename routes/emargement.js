module.exports = function(app){

    var emargements = require('../controllers/emargement');
    require('../models/vote');


    app.get('/api/teams/:teamId/proposition/:propId/emargement', emargements.findByProposition);
    app.post('/api/teams/:teamId/proposition/:propId/vote', emargements.add);
}