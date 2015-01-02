var api = require('./api');

module.exports = function (app, db) {

    // home
    app.get('/', function (req, res, next) {
        res.send('/');
    })

    // api
    api(app, db);

    // errors
    app.use(function(err, req, res, next) {
        res.status(500);
        res.jsonp({ err: err });
    });
};
