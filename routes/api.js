var moment = require('moment');

module.exports = function (app, db) {

    // get the weather collection
    var weather = db.collection("weather");

    app.get('/api', function(req, res) {
        var body = '/api/weather GET, POST\n';
        body += '/api/weather/date/range/:start/:end GET\n';
        res.send(body);
    });

    app.get('/api/weather', function (req, res) {
        weather.find({}).sort({date:-1}).limit(1).toArray(function(err, documents) {
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

    app.get('/api/weather/date/range/:start/:end', function (req, res) {
        // 2015-01-12T18:41
        // console.log(req.params.start, req.params.end);
        // console.log(new Date(req.params.start));
        var start = new Date(req.params.start); //new Date('2015-01-11T00:00:00');
        var end = req.params.end ? new Date(req.params.end) : new Date(); //('2015-01-12T00:00:00');
        var query = {'date' : {'$gte' : start, '$lte' : end}};
        console.log(start, end);
        weather.find(query).toArray(function(err, docs) {
            console.log(docs.length)
            if(err) res.jsonp({err:err});
            else res.jsonp({results: docs});
        });
        // return res.jsonp({start:req.params.start, end:req.params.end});
    });

    app.get('/api/weather/testing/:date/:count', function (req, res) {
        var datestring = req.params.date; // || '2015-02-04T00:00:00.000Z';
        var count = req.params.count;

        var endDate = moment(datestring);
        var startDate = moment(datestring).subtract(count, 'days');

        var query = {
            date: {
                $gte: new Date(startDate.format()),
                $lt: new Date(endDate.format())
            }
        }

        var data = [];
        var lastInsert;

        var cursor = weather.find(query);
        
        cursor.each(function (err, doc) {
            if (err) return;

            if (doc === null) {
                // done
                console.log('filtered result count:', data.length);
                return res.jsonp({results: data});
            }

            // first item
            if (!lastInsert) {
                data.push(doc);
                lastInsert = doc;

            } else {
                // if doc.date is in the next hour after the lastInsert.date
                //    push to data; update lastInsert
                if (docDateIsNextHourPlus(doc.date, lastInsert.date)) {
                    data.push(doc);
                    lastInsert = doc;
                }
            }
        });

    });

    // get the temperature each hour for a specified number of days
    app.get('/api/weather/days/:datetime', function (req, res) { // /:count
        var datetime = req.params.datetime;
        if (!datetime) return res.jsonp({err:"You must provide a datetime"});

        query = {'date' : {'$gte' : new Date(datetime)}};

        weather.findOne(query, function (err, doc) {
            res.jsonp({doc: doc});
            // day[inserted] = doc;
            // if (++inserted === 24) {
            //     console.log('day done', day);
            // }
        });

        // var inserted = 0;
        // var days = [];
        // var day = {};
        // var i, query, datetime;

        // for(i=0; i<24; i++) {
        //     // date query to find the data for this hour
        //     datetime = '2015-02-12T' + (i > 9 ? i : '0' + i) + ':00:00.000Z';
        //     query = {'date' : {'$gte' : new Date(datetime)}};
        //     weather.findOne(query, function (err, doc) {
        //         console.log(doc);
        //         day[inserted] = doc;
        //         if (++inserted === 24) {
        //             console.log('day done', day);
        //         }
        //     });
        // }

    });

};

// return current.date is in the hour following previous.date (or later)
function docDateIsNextHourPlus (current, previous) {
    var mCurrent = moment(current);
    var mPrevious = moment(previous);

    var startHour = mPrevious.clone().startOf('hour');
    startHour.add(1, 'hours');
    var endHour = startHour.clone().add(1, 'hours');

    var isBetween = mCurrent.isAfter(startHour);

    return isBetween;
}
