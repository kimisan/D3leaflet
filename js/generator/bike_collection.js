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
        //console.log("test got");

        var station = Backbone.Model.extend({
            defaults: {
                name: ''

            }
        });

        var station_extend = Backbone.Collection.extend({
            model: station
        });

        var station_Collection = new station_extend();



        var data1 = d3.json("./data/bike.json", function(error, data) {
            //console.log(data.retVal);
            data.retVal.forEach(function(d) {
                station_Collection.add(new station({
                    ar:d.ar,
                    lat:d.lat,
                    lng:d.lng,
                    mday:d.mday,
                    sarea:d.sarea,
                    sbi:d.sbi,
                    sna:d.sna,
                    tot:d.tot


                }));
            });
            notify(null, station_Collection);

            //window.appView = new AppView({ collection: station_Collection });

        });

        //notify(null, new Date().getTime());
        //notify(null, station_Collection);
    };
};