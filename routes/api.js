module.exports = function (app, db) {

    app.get('/api', function(req, res) {
        // @TODO turn this into documentation of api functions?
        res.send('GET /api');
    });

    app.get('/api/weather', function (req, res) {
        // return most recent weather sorted by date
        var weather = db.collection("weather");
        weather.find({}).sort({date:-1}).toArray(function(err, documents) {
            if (err) res.jsonp({err:err});
            else res.jsonp({result: documents});
        });
    });

    app.post('/api/weather', function (req, res) {
        console.log('/api/weather POST', req.body);

        // require a date property
        if (!req.body.date) res.jsonp({err:'You must supply a date property.'});

        // reformat the date string to a date obj
        req.body.date = new Date(req.body.date);
        
        // get the weather collection
        var collection = db.collection("weather");
        
        // insert req.body into weather collection
        collection.insert(req.body, function (err, result) {
            // handle error results
            if (err) return res.jsonp({err:err});
            if (!result) return res.jsonp({err:'No data inserted into database.'});
            
            // return results
            console.log(result[0]);
            res.jsonp({result:result[0]});
        });
    });
};
