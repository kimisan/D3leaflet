/**
 * Created by kimi on 15/1/12.
 */

var request = require('request');
var fs = require('fs');
//var schedule = require('node-schedule');


//var rule = new schedule.RecurrenceRule();
//rule.minute = 1;




var cron = require('cron');
var cronJob = cron.job("0 */3 * * * *", function(){
    // perform operation e.g. GET request http.get() etc.
    request
        .get('http://opendata.dot.taipei.gov.tw/opendata/gwjs_cityhall.json')
        .on('error', function(err) {
            console.log(err)
        })
        .pipe(fs.createWriteStream('bike.json'));

    request
        .get('http://opendata.epa.gov.tw/ws/Data/AQX/?$orderby=SiteName&$skip=0&$top=1000&format=json')
        .on('error', function(err) {
            console.log(err)
        })
        .pipe(fs.createWriteStream('air.json'));


    console.info('cron job completed');
});

cronJob.start();

