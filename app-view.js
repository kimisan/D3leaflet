/**
 * Created by kimi on 14/12/29.
 */
/**
 * Created by kimi on 14/11/10.
 */
var Backbone = require('backbone');

var d3 = require('d3');

var $ = require('jquery');

var py = require('./js/math/Pythagorean');

var getDistanceFromLatLonInKm= require('./js/math/getDistanceFromLatLonInKm');

var _ = require('lodash');





Backbone.$ = $;




module.exports = Backbone.View.extend({
    tagName: 'ul',
    el: "#container-movieInput",

    initialize: function(options){

        this.collection2 = options.collection2;
        this.air_data_collection = options.air_data;
        //this.collection = options.collection;





        this.on('customEvent', this.doSomething, this);
        this.on('customEvent2', this.doSomething, this);

        //console.log(this.collection);
        //this.collection.on('change reset add remove', this.render2, this);




        map = L.map('map').setView([25.076907, 121.573812], 14);
        mapLink =
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://api.tiles.mapbox.com/v4/examples.map-zr0njcqy/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ29kd2lsbGhlbHB5b3UiLCJhIjoiZHR6TGdLNCJ9.qr1qhFrRKAVGfdSB8eCz_A', {
            //'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18,
            }).addTo(map);

        /* Initialize the SVG layer */
        map._initPathRoot();

        /* We simply pick up the SVG from the map object */
        var svg = d3.select("#map").select("svg");
        g = svg.append("g");

        g1 = g
            .append("g")
            .attr("class", "tour");






        var data1 = d3.json("./data/bike.json", function(error, data) {
            //console.log(data.retVal[0]);
            data.retVal.forEach(function(d) {
                //console.log("d.dat : " +d.lat);
                //console.log("d.lng : " +d.lng);

                d.LatLng = new L.LatLng(d.lat,d.lng);
                //console.log(d);
            });

            //console.log(data);

            var feature = g.selectAll("circle")
                .data(data.retVal)
                .enter().append("circle")
                .style("stroke", "black")
                .style("opacity", .6)
                .on("click", function(d) {
                    console.log(d);
                    //appView.trigger('customEvent', "someDataHere");
                    appView.trigger('customEvent', d);
                })
                //.style("fill", "red")
                .attr("fill", function(d) {
                    //console.log(data[d].ddd);
                    var available_bike_percen_per_station  = d3.scale.linear()
                        .domain([0, d.tot])
                        .range([0,115]);
                    a1 = tinycolor("hsv("+available_bike_percen_per_station(d.sbi)+", 100%, 100%)");
                    a2 = a1.toHexString();
                    return a2; })
                .attr("r", function(d) {
                    //return d.sbi/2;
                    if (d.sbi == 0)
                        return 5;
                    else
                        return Math.sqrt(d.sbi*30/3.14);
                })
                .attr("transform", function(d) {
                    //console.log(d);
                    //console.log(map.latLngToLayerPoint(d.LatLng).x);
                    return "translate("+
                        map.latLngToLayerPoint(d.LatLng).x +","+
                        map.latLngToLayerPoint(d.LatLng).y +")";
                });

            map.on("viewreset", update);
            //update();

            function update() {
                feature.attr("transform",
                    function(d) {
                        //console.log(d.LatLng);
                        //console.log(map.latLngToLayerPoint(d.LatLng).x);
                        return "translate("+
                            map.latLngToLayerPoint(d.LatLng).x +","+
                            map.latLngToLayerPoint(d.LatLng).y +")";
                    }


                );

                //g1.selectAll("circle")
                g1.selectAll("image")
                    .attr("transform", function(d) {
                        //console.log(d);
                        //console.log(map.latLngToLayerPoint(d.LatLng).x);
                        return "translate("+
                            map.latLngToLayerPoint(d.LatLng).x +","+
                            map.latLngToLayerPoint(d.LatLng).y +")";
                    });

                g1.selectAll("text")
                    .attr("transform", function(d) {
                        //console.log(d);
                        //console.log(map.latLngToLayerPoint(d.LatLng).x);
                        return "translate("+
                            map.latLngToLayerPoint(d.LatLng).x +","+
                            map.latLngToLayerPoint(d.LatLng).y +")";
                    });




            }

        });






        this.render();
    },

    render2: function() {

        //console.log("Actttt");
        //console.log(this.collection);

    },

    doSomething: function(someData) {





        // this!
        console.log(someData);
        //console.log("111this.collection.length"+this.collection.length);
        //console.log(this.collection2.length);
        var x=document.getElementById('myTable').rows;
        //console.log(x);
        x[0].cells[1].innerHTML = someData.sna;
        x[1].cells[1].innerHTML = someData.mday;
        x[2].cells[1].innerHTML = someData.tot;
        x[3].cells[1].innerHTML = someData.sbi;

        d3.select("#select_side_available_rate")
            .selectAll("*").remove();

        var col11 = d3.select("#select_side_available_rate")
            .append("svg")
            .attr("width", 200).attr("height", 20);

        col11.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .style("fill", "#E8E8E8");

        col11.append("rect")
            .attr("x", 0)
            .attr("y", 3)
            .attr("width", 200*(parseFloat(someData.sbi)/parseFloat(someData.tot)))
            .attr("height", 14)
            .style("fill", "green");


        x[5].cells[1].innerHTML = someData.sarea;
        x[6].cells[1].innerHTML = someData.ar;
        //y[0].innerHTML="NEW CONTENT";






        this.findnearsite(someData);
        this.findneartour(someData);
        this.weather_report(someData);



    },

    findnearsite: function(someData) {
        var nearsite=[];
        //console.log(someData);
        //console.log(this.collection.length);
        this.collection.each(function(model){
            //console.log(model.get("sna"));
            var a = parseFloat(model.get("lat")) - parseFloat(someData.lat);
            var b = parseFloat(model.get("lng")) - parseFloat(someData.lng);
            var c = py(a,b);
            var d = getDistanceFromLatLonInKm(parseFloat(model.get("lat")),parseFloat(model.get("lng")),parseFloat(someData.lat),parseFloat(someData.lng));
            nearsite.push({
                sitename:model.get("sna"),
                distance: c,
                distance_km:d,
                sbi:model.get("sbi"),
                tot:model.get("tot")
            });


        });
        //console.log(nearsite);
        _.sortBy(nearsite, 'distance');
        //console.log(_.sortBy(nearsite, 'distance')[1]);
        var x=document.getElementById('nearsite').rows;
        x[1].cells[0].innerHTML = "1. " +_.sortBy(nearsite, 'distance_km')[1].sitename;
        x[2].cells[0].innerHTML = "2. " +_.sortBy(nearsite, 'distance_km')[2].sitename;
        x[3].cells[0].innerHTML = "3. " +_.sortBy(nearsite, 'distance_km')[3].sitename;
        x[4].cells[0].innerHTML = "4. " +_.sortBy(nearsite, 'distance_km')[4].sitename;

        x[1].cells[2].innerHTML = _.sortBy(nearsite, 'distance_km')[1].distance_km.toFixed(2)+"km";
        x[2].cells[2].innerHTML = _.sortBy(nearsite, 'distance_km')[2].distance_km.toFixed(2)+"km";
        x[3].cells[2].innerHTML = _.sortBy(nearsite, 'distance_km')[3].distance_km.toFixed(2)+"km";
        x[4].cells[2].innerHTML = _.sortBy(nearsite, 'distance_km')[4].distance_km.toFixed(2)+"km";






        d3.select("#col1")
            .selectAll("*").remove();

        var col1 = d3.select("#col1")
            .append("svg")
            .attr("width", 200).attr("height", 20);

        col1.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .style("fill", "#E8E8E8");

        col1.append("rect")
            .attr("x", 0)
            .attr("y", 3)
            .attr("width", 200*(parseFloat(_.sortBy(nearsite, 'distance')[1].sbi)/parseFloat(_.sortBy(nearsite, 'distance')[1].tot)))
            .attr("height", 14)
            .style("fill", "green");

        d3.select("#col2")
            .selectAll("*").remove();

        var col2 = d3.select("#col2")
            .append("svg")
            .attr("width", 200).attr("height", 20);

        col2.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .style("fill", "#E8E8E8");

        col2.append("rect")
            .attr("x", 0)
            .attr("y", 3)
            .attr("width", 200*(parseFloat(_.sortBy(nearsite, 'distance')[2].sbi)/parseFloat(_.sortBy(nearsite, 'distance')[2].tot)))
            .attr("height", 14)
            .style("fill", "green");

        d3.select("#col3")
            .selectAll("*").remove();

        var col3 = d3.select("#col3")
            .append("svg")
            .attr("width", 200).attr("height", 20);

        col3.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .style("fill", "#E8E8E8");

        col3.append("rect")
            .attr("x", 0)
            .attr("y", 3)
            .attr("width", 200*(parseFloat(_.sortBy(nearsite, 'distance')[3].sbi)/parseFloat(_.sortBy(nearsite, 'distance')[3].tot)))
            .attr("height", 14)
            .style("fill", "green");

        d3.select("#col4")
            .selectAll("*").remove();

        var col4 = d3.select("#col4")
            .append("svg")
            .attr("width", 200).attr("height", 20);

        col4.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .style("fill", "#E8E8E8");

        col4.append("rect")
            .attr("x", 0)
            .attr("y", 3)
            .attr("width", 200*(parseFloat(_.sortBy(nearsite, 'distance')[4].sbi)/parseFloat(_.sortBy(nearsite, 'distance')[3].tot)))
            .attr("height", 14)
            .style("fill", "green");





        /*
         for (i=0;i<this.collection.length;i++){
         console.log(py(someData.lng,3))
         }
         */

    },

    findneartour: function(someData) {
        var neartour=[];
        //console.log("找最近景");
        //console.log(someData);
        //console.log(this.collection.length);
        this.collection2.each(function(model){
            //console.log(model.get("stitle"));
            var a = parseFloat(model.get("lat")) - parseFloat(someData.lat);
            var b = parseFloat(model.get("lng")) - parseFloat(someData.lng);
            var c = py(a,b);
            var d = getDistanceFromLatLonInKm(parseFloat(model.get("lat")),parseFloat(model.get("lng")),parseFloat(someData.lat),parseFloat(someData.lng));
            neartour.push({
                tourname:model.get("stitle"),
                cat2:model.get("cat2"),
                memo_time:model.get("memo_time"),
                distance: c,
                distance_km:d,
                LatLng:model.get("LatLng"),
                xurl:model.get("xurl")
                //tot:model.get("tot")
            });

        });





        var x=document.getElementById('neartour').rows;
        x[1].cells[0].innerHTML = "1. " +_.sortBy(neartour, 'distance_km')[0].tourname;
        x[2].cells[0].innerHTML = "2. " +_.sortBy(neartour, 'distance_km')[1].tourname;
        x[3].cells[0].innerHTML = "3. " +_.sortBy(neartour, 'distance_km')[2].tourname;
        x[4].cells[0].innerHTML = "4. " +_.sortBy(neartour, 'distance_km')[3].tourname;

        x[1].cells[1].innerHTML = _.sortBy(neartour, 'distance_km')[0].distance_km.toFixed(2)+"km";
        x[2].cells[1].innerHTML = _.sortBy(neartour, 'distance_km')[1].distance_km.toFixed(2)+"km";
        x[3].cells[1].innerHTML = _.sortBy(neartour, 'distance_km')[2].distance_km.toFixed(2)+"km";
        x[4].cells[1].innerHTML = _.sortBy(neartour, 'distance_km')[3].distance_km.toFixed(2)+"km";

        x[1].cells[2].innerHTML = _.sortBy(neartour, 'distance_km')[0].cat2;
        x[2].cells[2].innerHTML = _.sortBy(neartour, 'distance_km')[1].cat2;
        x[3].cells[2].innerHTML = _.sortBy(neartour, 'distance_km')[2].cat2;
        x[4].cells[2].innerHTML = _.sortBy(neartour, 'distance_km')[3].cat2;

        x[1].cells[3].innerHTML = _.sortBy(neartour, 'distance_km')[0].memo_time;
        x[2].cells[3].innerHTML = _.sortBy(neartour, 'distance_km')[1].memo_time;
        x[3].cells[3].innerHTML = _.sortBy(neartour, 'distance_km')[2].memo_time;
        x[4].cells[3].innerHTML = _.sortBy(neartour, 'distance_km')[3].memo_time;

        //Plot near site cycle----------------

        //console.log(this.collection2.at(1).get('stitle'));
        //console.log(this.collection2.at(1).get('LatLng'));
        cc2 = _.sortBy(neartour, 'distance_km')[0].LatLng;
        cc3 = _.sortBy(neartour, 'distance_km')[0].tourname;

        /*

        console.log(
            //_.sortBy(neartour, 'distance_km')
            _.chain(neartour)
                .sortBy('distance_km')
                .first(3)
                .value()

        );
        */



        g1.selectAll("*")
            .remove();


        g1.selectAll("image")
            .data(_.chain(neartour)
                .sortBy('distance_km')
                .first(4)
                .value())
            //.data(this.collection2.at(1))
            .enter()
            .append("svg:image")
            .attr("xlink:href", "svg/photo147.svg")
            .attr("width", 40)
            .attr("height", 40)

        .attr("transform", function(d) {
            //console.log(d);
            //console.log(map.latLngToLayerPoint(d.LatLng).x);
            return "translate("+
                map.latLngToLayerPoint(d.LatLng).x +","+
                map.latLngToLayerPoint(d.LatLng).y +")";
        });


        /*

         g1.selectAll("circle")
         .data(_.chain(neartour)
         .sortBy('distance_km')
         .first(3)
         .value())
         //.data(this.collection2.at(1))
         .enter()
         .append("circle")
         .style("stroke", "black")
         .style("opacity", .3)
         //.style("fill", "red")
         .attr("fill", "black")
         .attr("r", 10)
         .attr("transform", function(d) {
         //console.log(d);
         //console.log(map.latLngToLayerPoint(d.LatLng).x);
         return "translate("+
         map.latLngToLayerPoint(d.LatLng).x +","+
         map.latLngToLayerPoint(d.LatLng).y +")";
         });

         */


        /*

         g1
         //.data(data.retVal)
         //.data(this.collection2.at(1))
         //.enter()
         .append("circle")
         .style("stroke", "black")
         .style("opacity", .3)
         //.style("fill", "red")
         .attr("fill", "black")
         .attr("r", 10)
         .attr("transform", function(d) {
         //console.log(d);
         //console.log(map.latLngToLayerPoint(d.LatLng).x);
         return "translate("+
         map.latLngToLayerPoint(cc2).x +","+
         map.latLngToLayerPoint(cc2).y +")";
         });

         */

         g1.selectAll("text")
         .data(_.chain(neartour)
                .sortBy('distance_km')
                .first(4)
                .value())
         //.data(this.collection2.at(1))
         .enter()
         .append("text")
         .text(function(d) {
            //console.log(d);
            //console.log(map.latLngToLayerPoint(d.LatLng).x);
            return d.tourname;
        })
         .style("fill","red")
         .style("font-size","20px")
         .attr("transform", function(d) {
         //console.log(d);
         //console.log(map.latLngToLayerPoint(d.LatLng).x);
         return "translate("+
         map.latLngToLayerPoint(d.LatLng).x +","+
         map.latLngToLayerPoint(d.LatLng).y +")";
         });





        /*
         x[1].cells[1].innerHTML = '';
         var img = document.createElement('img');
         img.src = "http://www.tenda.cz/sites/default/files/Small_Dogs_Picture.jpg";
         x[1].cells[1].appendChild(img);
         */

        /*

         x[1].cells[1].innerHTML = '';
         var img = document.createElement('A');
         img.src = "http://www.tenda.cz/sites/default/files/Small_Dogs_Picture.jpg";
         x[1].cells[1].appendChild(img);

         x[1].cells[1].innerHTML = "2." +_.sortBy(neartour, 'distance')[1].xurl;
         x[2].cells[1].innerHTML = "2." +_.sortBy(neartour, 'distance')[2].xurl;
         x[3].cells[1].innerHTML = "3." +_.sortBy(neartour, 'distance')[3].xurl;
         x[4].cells[1].innerHTML = "4." +_.sortBy(neartour, 'distance')[4].xurl;
         */








        /*
         for (i=0;i<this.collection.length;i++){
         console.log(py(someData.lng,3))
         }
         */

    },

    weather_report:function(){
        //console.log(this.air_data_collection);
        var a1 = this.air_data_collection.find(function(model) {
            return model.get('SiteName') == '中山';
        });
        //console.log(a1.get('PSI'));

        var air_Scale_PSI = d3.scale.linear()
            .domain([0,300])
            .range([115,0]);


        d3.select("#air_pollution")
            .selectAll("*").remove();

        var col1 = d3.select("#air_pollution")
            .append("svg")
            .attr("width", 200).attr("height", 20);

        col1.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", function(d) {
                //console.log(data[d].ddd);
                var a111 = tinycolor("hsv("+air_Scale_PSI(parseInt(a1.get('PSI')))+", 50%, 100%)");
                var a222 = a111.toHexString();
                return a222; });

        col1.append("text")
            .text(a1.get('Status'))
            .attr("x", 80)
            .attr("y", 15)
            .attr("font-family", "sans-serif")
            .attr("font-size", "18px");

        d3.select("#air_pollution_2")
            .selectAll("*").remove();

        var col1 = d3.select("#air_pollution_2")
            .append("svg")
            .attr("width", 200).attr("height", 20);

        var air_Scale_FPMI = d3.scale.linear()
            .domain([1,10])
            .range([115,0]);


        col1.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", function(d) {
                //console.log(data[d].ddd);
                var a111 = tinycolor("hsv("+air_Scale_FPMI(parseInt(a1.get('FPMI')))+", 50%, 100%)");
                var a222 = a111.toHexString();
                return a222; });

        col1.append("text")
            .text(a1.get('FPMI'))
            .attr("x", 90)
            .attr("y", 15)
            .attr("font-family", "sans-serif")
            .attr("font-size", "18px");

        // UV -----------

        d3.select("#UV")
            .selectAll("*").remove();

        var col1 = d3.select("#UV")
            .append("svg")
            .attr("width", 200).attr("height", 20);

        var Scale_UV = d3.scale.linear()
            .domain([1,10])
            .range([0,115]);


        col1.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", function(d) {
                //console.log(data[d].ddd);
                var a111 = tinycolor("hsv("+Scale_UV(parseInt(a1.get('FPMI')))+", 50%, 100%)");
                var a222 = a111.toHexString();
                return a222; });

        col1.append("text")
            .text(a1.get('FPMI'))
            .attr("x", 90)
            .attr("y", 15)
            .attr("font-family", "sans-serif")
            .attr("font-size", "18px");




    },


    events: {
        "keyup #txtMovieTitle": "titleChange"
        //"change input": "titleChange"
    },



    render: function(option){

        /*
         var colorScale = d3.scale.quantile()
         //.domain([0, buckets - 1, d3.max(myArray, function (d) { return d.value; })])
         .domain([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10])
         .range(colors);
         */
        //console.log(myArray);
        //console.log("render start2");



        //console.log(this.collection.get("c7").get("sna"));
        //console.log(this.collection);
        //var somedata = [{sna:"dd",tot:11,sbi:1}];
        //this.doSomething(somedata);




    }
});




