var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({

  // google map api parameters
  getInitialState: function() {
    return (myParams= {
      center: new google.maps.LatLng(37.7421, -122.4350),
      zoom: 14,
      streetViewControl: true,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      scaleControl: true
    });
  },
  createLabels: function(){
    for (var i=0; i<this.points.length;i++){
          addMarkerWithTimeout(this.points[i].location, i * 70, this.points[i].label);
    }

      var markers = [];
      var self=this;
      function addMarkerWithTimeout(position, timeout, label) {

          window.setTimeout(function() {
            markers.push(new google.maps.Marker({
              position: position,
              map: self.map,
            //  animation: google.maps.Animation.BOUNCE
            }));
            customTxt = label;
            txt = new TxtOverlay(position, customTxt, "customBox", self.map);
          }, timeout);


      }

      function TxtOverlay(pos, txt, cls, map) {

        // Now initialize all properties.
        this.pos = pos;
        this.txt_ = txt;
        this.cls_ = cls;
        this.map_ = map;
        this.div_ = null;

        // Explicitly call setMap() on this overlay
        this.setMap(map);
      }

      TxtOverlay.prototype = new google.maps.OverlayView();


      TxtOverlay.prototype.onAdd = function() {

        // Note: an overlay's receipt of onAdd() indicates that
        // the map's panes are now available for attaching
        // the overlay to the map via the DOM.

        // Create the DIV and set some basic attributes.
        var div = document.createElement('DIV');
        div.className = this.cls_;

        div.innerHTML = this.txt_;

        // Set the overlay's div_ property to this DIV
        this.div_ = div;
        var overlayProjection = this.getProjection();
        var position = overlayProjection.fromLatLngToDivPixel(this.pos);
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
        // We add an overlay to a map via one of the map's panes.

        var panes = this.getPanes();
        panes.floatPane.appendChild(div);
      }
      TxtOverlay.prototype.draw = function() {
          var overlayProjection = this.getProjection();

          // Retrieve the southwest and northeast coordinates of this overlay
          // in latlngs and convert them to pixels coordinates.
          // We'll use these coordinates to resize the DIV.
          var position = overlayProjection.fromLatLngToDivPixel(this.pos);
          var div = this.div_;
          div.style.left = position.x + 'px';
          div.style.top = position.y + 'px';
        }
  },
  getNumOfPassenger: function(ps_data) {
    for (var i=0; i<this.points.length; i++) {
      for (var j=0; j<ps_data.length; j++) {
        var up_left = {
          lat: this.points[i].lat+this.llOffset/2,
          long: this.points[i].long-this.llOffset/2
        };
        var low_right = {
          lat: this.points[i].lat-this.llOffset/2,
          long: this.points[i].long+this.llOffset/2
        };

        if (ps_data[j].lat<=up_left.lat && ps_data[j].lat>=low_right.lat && ps_data[j].long<=low_right.long && ps_data[j].long>=up_left.long) {
          // if passenger is bounded within the square area.

          this.points[i].num_ps++;
        }
      }

    }
  },

  getNumOfCars: function(car_data) {
    for (var i=0; i<this.points.length; i++) {
      for (var j=0; j<car_data.length; j++) {
        var up_left = {
          lat: this.points[i].lat+this.llOffset/2,
          long: this.points[i].long-this.llOffset/2
        };
        var low_right = {
          lat: this.points[i].lat-this.llOffset/2,
          long: this.points[i].long+this.llOffset/2
        };
        if (car_data[j].lat<=up_left.lat && car_data[j].lat>=low_right.lat && car_data[j].long<=low_right.long && car_data[j].long>=up_left.long) {
          // if passenger is bounded within the square area.
          this.points[i].num_car++;
        }
      }
    }
  },
  getSurgePricing: function(ps_data, car_data) {
    this.getNumOfPassenger(ps_data);
    this.getNumOfCars(car_data);
    for (var i=0; i<this.points.length; i++){
      this.points[i].ds_mul = this.points[i].num_ps/this.points[i].num_car;
      if(this.points[i].num_car==0){
        this.points[i].ds_mul=7;
      }
      //alert(this.points[i].ds_mul);

    if(this.points[i].ds_mul<=2.0){
      this.points[i].color="#0000FF";
    }
    else if(this.points[i].ds_mul<=3.5){
      this.points[i].color="#00FF00";
    }
    else if(this.points[i].ds_mul<=5.0){
      this.points[i].color="#FFFF00";
    }
    else{
      this.points[i].color="#FF0000";
    }

    if(this.points[i].ds_mul<=2.0)
        this.points[i].label="1.0x";
    else if(this.points[i].ds_mul<=3.5)
        this.points[i].label="1.5x";
    else if(this.points[i].ds_mul<=5.0)
        this.points[i].label="2.0x";
    else
        this.points[i].label="2.5x";
    var polyCoords = [
      this.points[i].up_left,
      this.points[i].up_right,
      this.points[i].low_right,
      this.points[i].low_left
    ];

 // Construct the polygon.
 var heatmap = new google.maps.Polygon({
   paths: polyCoords,
   strokeColor: this.points[i].color,
   strokeOpacity: 0.8,
   strokeWeight: 2,
   fillColor: this.points[i].color,
   fillOpacity: 0.15
 });
 heatmap.setMap(this.map);
 this.createLabels();




}
// return this.heatmap_create();

},

getRandomInRange: function(from, to, fixed) {
  return ((Math.random() * (to - from) + from).toFixed(fixed));
},
createRandomLatLong: function() {
  var i=0;
  // generating random data for passengers
  while(i<200){
    var rn_long=this.getRandomInRange(this.leftLong,this.rightLong,4);
    var rn_lat=this.getRandomInRange(this.bottomLat,this.topLat,4);
    //alert(rn_long);
    this.ps_data.push({
      lat: rn_lat,
      long: rn_long
    });
    i++;
  }

  var j=0;
  // generating random data for cars
  while(j<100){
    var rn_long=this.getRandomInRange(this.leftLong,this.rightLong,4);
    var rn_lat=this.getRandomInRange(this.bottomLat,this.topLat,4);
    //alert(rn_long);
    this.car_data.push({
      lat: rn_lat,
      long: rn_long
    });
    j++;
  }

  return this.getSurgePricing(this.ps_data, this.car_data);

},
createGridLines: function(bounds) {
  // getting end points' latitudes and longitudes
  var north = bounds.getNorthEast().lat();
  var south = bounds.getSouthWest().lat();
  var east = bounds.getNorthEast().lng();
  var west = bounds.getSouthWest().lng();

  // define the size of the grid

  this.topLat = Math.ceil(north / this.llOffset) * this.llOffset;
  this.rightLong = Math.ceil(east / this.llOffset) * this.llOffset;

  this.bottomLat = Math.floor(south / this.llOffset) * this.llOffset;
  this.leftLong = Math.floor(west / this.llOffset) * this.llOffset;

  for (var latitude = this.bottomLat; latitude <= this.topLat; latitude += this.llOffset) {
    for(var longitude= this.leftLong; longitude<= this.rightLong;longitude+=this.llOffset) {
      // marker points of an area.
      this.points.push({
        lat: latitude,
        long: longitude,
        location: new google.maps.LatLng(latitude, longitude),
        up_left: {
          lat: latitude+this.llOffset/2,
          lng: longitude-this.llOffset/2
        },
        up_right: {
          lat: latitude+this.llOffset/2,
          lng: longitude+this.llOffset/2
        },
        low_left: {
          lat: latitude-this.llOffset/2,
          lng: longitude-this.llOffset/2
        },
        low_right: {
          lat: latitude-this.llOffset/2,
          lng: longitude+this.llOffset/2
        },
        ds_mul: 0.0,
        num_ps: 0,
        num_car: 0,
        color: "#000000",
        label: "A"
      });
    }
  }

  return this.createRandomLatLong();

},
componentDidMount: function() {
  this.map;
  this.llOffset = 0.00666666666666667*2;         //using for making grids into the map
  this.points = [];                              // center points of the grids
  this.bounds = new google.maps.LatLngBounds();
  this.topLat = 0;
  this.rightLong = 0;
  this.bottomLat = 0;
  this.leftLong = 0;
  this.ps_data=[];
  this.car_data=[];
  this.heatmap_data=[];
  this.bermudaTriangle;
  this.polygons=[];
  //var path = new google.maps.MVCArray;

  this.map = new google.maps.Map(document.getElementById('app'), myParams);
  var self=this;
  // everytime makes the partitions of map while zooming in or out or changing the bounds
  google.maps.event.addListenerOnce(this.map, 'idle', function(){
    //console.log(self);
    self.createGridLines(self.map.getBounds());
  });
},
render: function() {
  return (<div>I shoud be a map</div>);        // if map is not rendering successfully!
}
});
