/**
 * Created by kimi on 14/12/29.
 */

/**
 * Created by kimi on 14/11/10.
 */
var $ = require('jquery');

var AppView = require('./app-view');
//var circlerect= require('./circle_rect');

var bike_collection = require('./js/generator/bike_collection.js');
var tour_collection = require('./js/generator/tour_collection.js');
var air_collection = require('./js/generator/air_collection.js');



var d3 = require('d3');//

var moment = require('moment');
moment().format();

var Backbone = require('backbone');


//var p1 = require('./js/generator/p1.js');


var $ = require('jquery');//

var L = require('leaflet');//

//var _ = require('underscore');//

window.heatmap =function() {

    var station = Backbone.Model.extend({
        defaults: {
            name: ''

        }
    });

    var station_extend = Backbone.Collection.extend({
        model: station
    });

    var station_Collection = new station_extend();


    /*

     var data1 = d3.json("bike.json", function(error, data) {
     //console.log(data.retVal);
     data.retVal.forEach(function(d) {
     station_Collection.add(new station({
     ar:d.ar,
     lat:d.lat,
     lng:d.lng,
     sarea:d.sarea,
     sbi:d.sbi,
     sna:d.sna,
     tot:d.tot


     }));
     });

     //window.appView = new AppView({ collection: station_Collection });

     });

     */

    //window.appView = new AppView({ collection: station_Collection });

//appView.trigger('customEvent', "someDataHere");
    function viewcontrol(a,b,air_data) {

        return function(notify) {
            //console.log("test got");



            //notify(null, new Date().getTime());
            window.appView = new AppView({ collection: a,collection2: b,air_data: air_data});
            notify(null, "1");
        };

    }

      function trigger_init(bike_data) {

        return function(notify) {
            //console.log("test got");


                    console.log(bike_data.get("c7").attributes);
                  var qq =appView.trigger('customEvent2',bike_data.get("c7").attributes);

            notify(null, "1");
        };

    }




    function co(gen) {
        var g = gen();
        function next(err, data) {
            var res;
            if(err) {
                return g.throw(err);
            } else {
                res = g.next(data);
            }
            if(!res.done) {
                res.value(next)
            }
        }
        next();
    }

    function * withYield() {

        var bike_data = yield bike_collection(1);
        //console.log('Collectiuonm'+a);
        var b = yield tour_collection();
        //console.log('Tour');
        //console.log(b);
        var air_data = yield air_collection();

        var a1 = yield viewcontrol(bike_data,b,air_data);
        //console.log('Collectiuonm'+a);

        var a2 = yield trigger_init(bike_data);
        //console.log('Collectiuonm'+a);
        //var qq =appView.trigger('customEvent2');





    }
    co(withYield);


};

