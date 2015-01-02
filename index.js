var express = require('express'),
    MongoClient = require('mongodb').MongoClient;

var middleware = require('./middleware'),
    routes = require('./routes');

MongoClient.connect('mongodb://localhost:27017/tessel', function (err, db) {
    if (err) throw err;

    var app = express();
    middleware(app);
    routes(app, db);

    app.listen(3000, function () {
        console.log('now listening on port 3000');
    });
});
