var React = require('react');
var ReactDOM = require('react-dom');
var Point = require('./Point');
var llOffset = 0.00666666666666667*2;
var Map = React.createClass({

  getInitialState: function() {
    var self=this;
    return ({
      myParams: {
        center: new google.maps.LatLng(37.7421, -122.4350),
        zoom: 14,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true
      },
      map: null,
      points: [],

    });
  },

  createGridLines: function(bounds) {
    var north = bounds.getNorthEast().lat();
    var south = bounds.getSouthWest().lat();
    var east = bounds.getNorthEast().lng();
    var west = bounds.getSouthWest().lng();

    // define the size of the grid

    var topLat = Math.ceil(north / llOffset) * llOffset;
    var rightLong = Math.ceil(east / llOffset) * llOffset;

    var bottomLat = Math.floor(south / llOffset) * llOffset;
    var leftLong = Math.floor(west / llOffset) * llOffset;

    for (var latitude = bottomLat; latitude <= topLat; latitude += llOffset) {
      for(var longitude = leftLong; longitude<= rightLong; longitude += llOffset) {
        // marker points of an area.
        var arr = this.state.points;

        arr.push({
          lat: latitude,
          long: longitude,
          location: new google.maps.LatLng(latitude, longitude),
          up_left: {
            lat: latitude + llOffset/2,
            lng: longitude - llOffset/2
          },
          up_right: {
            lat: latitude + llOffset/2,
            lng: longitude + llOffset/2
          },
          low_left: {
            lat: latitude - llOffset/2,
            lng: longitude - llOffset/2
          },
          low_right: {
            lat: latitude - llOffset/2,
            lng: longitude + llOffset/2
          },
          surge_price: 0.0,
          num_d: 0,
          num_s: 0,
          color: "#FF0000",
          label: "A"
        });
      }
    }

    this.setState({
      points: arr
    });
    /*alert(this.state.points.length);
    alert("grid lines created");*/
    this.getDataFromAppbase();
  },

  componentDidMount: function() {
    alert("mounted");
    var self = this;
    var map = new google.maps.Map(document.getElementById('app'), this.state.myParams);
    this.setState({
      map: map
    });
    alert("5");
    google.maps.event.addListenerOnce(map, 'idle', function(){
      alert("going to create grid lines");
      self.createGridLines(map.getBounds());
    });
  },

  eachPoint: function(single_point, i) {
    return (
      <Point key={i} index={i} lat={this.state.points[i].lat}
            long={this.state.points[i].long}
            location={this.state.points[i].location}
            up_left={this.state.points[i].up_left}
            up_right={this.state.points[i].up_right}
            low_left={this.state.points[i].low_left}
            low_right={this.state.points[i].low_right}
            surge_price={this.state.points[i].surge_price}
            num_d={this.state.points[i].num_d}
            num_s={this.state.points[i].num_s}
            color={this.state.points[i].color}
            label={this.state.points[i].label}
            map={this.state.map}
      ></Point>
    );
  },

  render: function() {
    var points = this.state.points.map(this.eachPoint);
    return (<div>{points}</div>);        // if map is not rendering successfully!
  }
});

module.exports = Map;
