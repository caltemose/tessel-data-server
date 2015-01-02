// var mongoose = require('mongoose');
// var ingredients = require('./api/ingredients');

module.exports = function (app) {
    
    app.get('/api', function(req, res) {
        res.send('/api');
    });
    
    // ingredients(app);
}
