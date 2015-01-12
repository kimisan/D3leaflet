/**
 * Created by kimi on 14/12/29.
 */
/**
 * Created by kimi on 14/11/10.
 */
var Backbone = require('backbone');

var d3 = require('d3');

var $ = require('jquery');

var py = require('./math/Pythagorean');

var _ = require('lodash');





Backbone.$ = $;




module.exports = Backbone.View.extend({
    tagName: 'ul',
    el: "#container-movieInput",

    initialize: function(){

        this.on('customEvent', this.doSomething, this);

        console.log(this.collection);
        //console.log(this.collection2);



        this.collection.on('change reset add remove', this.render2, this);




        var map = L.map('map').setView([25.076907, 121.573812], 14);
        mapLink =
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18,
            }).addTo(map);

        /* Initialize the SVG layer */
        map._initPathRoot();

        /* We simply pick up the SVG from the map object */
        var svg = d3.select("#map").select("svg"),
            g = svg.append("g");







        var data1 = d3.json("bike.json", function(error, data) {
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
            update();

            function update() {
                feature.attr("transform",
                    function(d) {
                        //console.log(d.LatLng);
                        //console.log(map.latLngToLayerPoint(d.LatLng).x);
                        return "translate("+
                            map.latLngToLayerPoint(d.LatLng).x +","+
                            map.latLngToLayerPoint(d.LatLng).y +")";
                    }
                )
            }







        });


        //this.render();
    },

    render2: function() {
        console.log("got pass");
    },

    doSomething: function(someData) {

        // this!
        console.log(someData);
        var x=document.getElementById('myTable').rows;
        console.log(x);
        var y=x[0];
        console.log(y.cells[0].innerHTML);
        y.cells[1].innerHTML = someData.sna;
        x[1].cells[1].innerHTML = someData.tot;
        x[2].cells[1].innerHTML = someData.sbi;
        x[3].cells[1].innerHTML = someData.sarea;
        x[4].cells[1].innerHTML = someData.ar;



        this.findnearsite(someData);



    },

    findnearsite: function(someData) {
        var nearsite=[];
        console.log(someData);
        console.log("111this.collection.length"+this.collection.length);
        this.collection.each(function(model){
            //console.log(model.get("sna"));
            var a = parseFloat(model.get("lat")) - parseFloat(someData.lat);
            var b = parseFloat(model.get("lng")) - parseFloat(someData.lng);
            var c = py(a,b);
            nearsite.push({
                sitename:model.get("sna"),
                distance: c,
                sbi:model.get("sbi"),
                tot:model.get("tot")
            });

        });
        console.log(nearsite);
        _.sortBy(nearsite, 'distance');
        console.log(_.sortBy(nearsite, 'distance')[1]);
        var x=document.getElementById('nearsite').rows;
        x[1].cells[0].innerHTML = "1." +_.sortBy(nearsite, 'distance')[1].sitename;
        x[2].cells[0].innerHTML = "2." +_.sortBy(nearsite, 'distance')[2].sitename;
        x[3].cells[0].innerHTML = "3." +_.sortBy(nearsite, 'distance')[3].sitename;
        x[4].cells[0].innerHTML = "4." +_.sortBy(nearsite, 'distance')[4].sitename;


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


    events: {
        "keyup #txtMovieTitle": "titleChange"
        //"change input": "titleChange"
    },



    render: function(){

        /*
         var colorScale = d3.scale.quantile()
         //.domain([0, buckets - 1, d3.max(myArray, function (d) { return d.value; })])
         .domain([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10])
         .range(colors);
         */
        //console.log(myArray);
        console.log("render start");




    }
});




