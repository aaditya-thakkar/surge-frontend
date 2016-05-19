var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({

  // google map api parameters
  getInitialState: function() {
      return (myParams= {
        center: new google.maps.LatLng(37.7621, -122.4350),
        zoom: 14,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        scaleControl: true
      });
  },
  componentDidMount: function() {
    var map;
    var llOffset = 0.00666666666666667*2;         //using for making grids into the map
    var points = [];                              // center points of the grids
    var bounds = new google.maps.LatLngBounds();
    var topLat = 0;
    var rightLong = 0;
    var bottomLat = 0;
    var leftLong = 0;
    var ps_data=[];
    var car_data=[];
    var heatmap_data=[];


        map = new google.maps.Map(document.getElementById('app'), myParams);

        // everytime makes the partitions of map while zooming in or out or changing the bounds
        google.maps.event.addListener(map, 'bounds_changed', function() {
          createGridLines(map.getBounds());
        });



      function createGridLines(bounds) {

        // getting end points' latitudes and longitudes
        var north = bounds.getNorthEast().lat();
        var east = bounds.getNorthEast().lng();
        var south = bounds.getSouthWest().lat();
        var west = bounds.getSouthWest().lng();

        // define the size of the grid

        topLat = Math.ceil(north / llOffset) * llOffset;
        rightLong = Math.ceil(east / llOffset) * llOffset;

        bottomLat = Math.floor(south / llOffset) * llOffset;
        leftLong = Math.floor(west / llOffset) * llOffset;

        for (var latitude = bottomLat; latitude <= topLat; latitude += llOffset) {
          for(var longitude=leftLong; longitude<=rightLong;longitude+=llOffset) {
          // marker points of an area.
            points.push({
                lat: latitude,
                long: longitude,
                location: new google.maps.LatLng(latitude, longitude),
                ds_mul: 0.0,
                num_ps: 0,
                num_car: 0
            });
          }
        }
        for (var i=0; i<points.length;i++){
          var marker=new google.maps.Marker({
            position: points[i].location,
          });
          //marker.setMap(map);
        }
        createRandomLatLong();
        heatmap_create();
    }

    function createRandomLatLong() {

        var i=0;
        // generating random data for passengers
        while(i<200){
          var rn_long=getRandomInRange(leftLong,rightLong,4);
          var rn_lat=getRandomInRange(bottomLat,topLat,4);
          //alert(rn_long);
          ps_data.push({
            lat: rn_lat,
            long: rn_long
          });
          i++;
        }

        var j=0;
        // generating random data for cars
        while(j<100){
          var rn_long=getRandomInRange(leftLong,rightLong,4);
          var rn_lat=getRandomInRange(bottomLat,topLat,4);
          //alert(rn_long);
          car_data.push({
            lat: rn_lat,
            long: rn_long
          });
          j++;
        }

        getSurgePricing(ps_data, car_data);

    }

    // random generator within bounds
    function getRandomInRange(from, to, fixed) {
        return ((Math.random() * (to - from) + from).toFixed(fixed));
    }

    function getSurgePricing(ps_data, car_data) {
        getNumOfPassenger(ps_data);
        getNumOfCars(car_data);
        for (var i=0; i<points.length; i++){
            points[i].ds_mul = points[i].num_ps/points[i].num_car;
            if(points[i].num_car==0){
              points[i].ds_mul=7;
            }
            alert(points[i].ds_mul);
            heatmap_data.push({
                lat: points[i].lat,
                lng: points[i].long,
                count: points[i].ds_mul
            });
        }
    }

    function getNumOfPassenger(ps_data) {
        for (var i=0; i<points.length; i++) {
            for (var j=0; j<ps_data.length; j++) {
                var up_left = {
                  lat: points[i].lat+llOffset/2,
                  long: points[i].long-llOffset/2
                };
                var low_right = {
                  lat: points[i].lat-llOffset/2,
                  long: points[i].long+llOffset/2
                };

                /*alert(up_left.long);
                alert(low_right.lat);
                alert(low_right.long);*/
                if (ps_data[j].lat<=up_left.lat && ps_data[j].lat>=low_right.lat && ps_data[j].long<=low_right.long && ps_data[j].long>=up_left.long) {
                    // if passenger is bounded within the square area.

                    points[i].num_ps++;
                }
            }

        }
    }

    function getNumOfCars(car_data) {
        for (var i=0; i<points.length; i++) {
            for (var j=0; j<car_data.length; j++) {
                var up_left = {
                  lat: points[i].lat+llOffset/2,
                  long: points[i].long-llOffset/2
                };
                var low_right = {
                  lat: points[i].lat-llOffset/2,
                  long: points[i].long+llOffset/2
                };
                if (car_data[j].lat<=up_left.lat && car_data[j].lat>=low_right.lat && car_data[j].long<=low_right.long && car_data[j].long>=up_left.long) {
                    // if passenger is bounded within the square area.
                    points[i].num_car++;
                }
            }
        }
    }

    // heatmap implementation
    function heatmap_create(){
        var heatmap = new HeatmapOverlay(map,
          {
            "radius": 0.01,
            "maxOpacity": 0.5,
            "scaleRadius": true,
            "useLocalExtrema": true,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count'
          }
        );

        // heatmap test data object
        var testData = {
            max: 7,
            data: heatmap_data
        };

        heatmap.setData(testData);
     }
  },
  render: function() {
    return (<div>I shoud be a map</div>);        // if map is not rendering successfully!
  }
});
