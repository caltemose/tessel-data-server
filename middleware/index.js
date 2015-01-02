var express = require('express'),
    bodyParser = require('body-parser');

module.exports = function (app) {
    // app.use(express.logger('dev'));
    
    app.use(bodyParser.json());

    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
};
