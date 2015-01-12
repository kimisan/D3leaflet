/**
 * Created by kimi on 2015/1/2.
 */
/**
 * Created by kimi on 14/12/15.
 */
/**
 * Created by kimi on 14/12/5.
 */

var Backbone = require('backbone');
//var AppView = require('./app-view');


module.exports =  function timeout(sec) {
    return function(notify) {
        console.log("test got tour");

        var tour = Backbone.Model.extend({
            defaults: {
                name: ''

            }
        });

        var tour_extend = Backbone.Collection.extend({
            model: tour
        });

        var tour_Collection = new tour_extend();



        var data = d3.json("./data/Tourism.json", function(error, data) {
            //console.log(data);

             data.forEach(function(d) {
                tour_Collection.add(new tour({
                    stitle:d.stitle,
                    lat:d.latitude,
                    lng:d.longitude,
                    cat2:d.cat2,
                    memo_time:d.memo_time,
                    xurl:d.xurl,
                    LatLng : new L.LatLng(d.latitude,d.longitude)




                }));
            });
            notify(null, tour_Collection);



            //window.appView = new AppView({ collection: station_Collection });

        });

        //notify(null, new Date().getTime());
        //notify(null, tour_Collection);
    };
};