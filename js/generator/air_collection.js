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

        var air= Backbone.Model.extend({
            defaults: {
                name: ''

            }
        });

        var air_extend = Backbone.Collection.extend({
            model: air
        });

        var air_Collection = new air_extend();



        var data = d3.json("./data/air.json", function(error, data) {
            //console.log(data);

             data.forEach(function(d) {
                air_Collection.add(new air({
                    SiteName:d.SiteName,
                    County:d.County,
                    PSI:d.PSI,
                    MajorPollutant:d.MajorPollutant,
                    Status:d.Status,
                    SO2:d.SO2,
                    CO:d.CO,
                    O3:d.O3,
                    PM10:d.PM10,
                    NO2:d.NO2,
                    WindSpeed:d.WindSpeed,
                    WindDirec:d.WindDirec,
                    FPMI:d.FPMI
                }));
            });
            notify(null, air_Collection);


            //window.appView = new AppView({ collection: station_Collection });

        });

        //notify(null, new Date().getTime());
        //notify(null, tour_Collection);
    };
};