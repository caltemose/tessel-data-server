var api = require('./api');
// var errors = require('./errors');

module.exports = function (app) {

    // home
    app.get('/', function (req, res, next) {
        res.send('/');
    })

    // api
    api(app);

    // errors
    app.use(function(err, req, res, next) {
        res.status(500);
        res.jsonp({ err: err });
    });
};
