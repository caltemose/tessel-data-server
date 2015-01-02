var mongoose = require('mongoose');
    express = require('express');

require('express-mongoose');

mongoose.connect('mongodb://localhost/tds', function (err) {
    if (err) throw err;

    var app = express();
    middleware(app);
    routes(app);

    app.listen(3000, function () {
        console.log('now listening on port 3000');
    });
});
