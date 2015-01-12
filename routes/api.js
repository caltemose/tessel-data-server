module.exports = function (app, db) {

    // get the weather collection
    var weather = db.collection("weather");

    app.get('/api', function(req, res) {
        // @TODO turn this into documentation of api functions?
        res.send('GET /api');
    });

    app.get('/api/weather', function (req, res) {
        // return most recent weather sorted by date
        // var weather = db.collection("weather");
        weather.find({}).sort({date:-1}).toArray(function(err, documents) {
            if (err) res.jsonp({err:err});
            else res.jsonp({result: documents});
        });
    });

    app.post('/api/weather', function (req, res) {
        // add/overwrite date here since Tessel dates cannot be trusted
        req.body.date = new Date();

        console.log(req.body.humid.toFixed(1) + '%RH', req.body.temp.f.toFixed(1) + 'F', req.body.temp.c.toFixed(1) + 'C', req.body.date.toLocaleString());
        
        // insert req.body into weather collection
        weather.insert(req.body, function (err, result) {
            // handle error results
            if (err) return res.jsonp({err:err});
            if (!result) return res.jsonp({err:'No data inserted into database.'});
            
            // return results
            res.jsonp({result:result[0]});
        });
    });

    app.get('/api/weather/testing', function (req, res) {
        // return some recent weather sorted by date
        weather.find({}).sort({date:-1}).limit(2000).toArray(function(err, documents) {
            if (err) res.jsonp({err:err});
            else res.jsonp({result: documents});
        });
    });

    app.get('/api/weather/date/range/:start/:end', function (req, res) {

    });
};
