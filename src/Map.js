var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  componentDidMount: function() {
    var myLatlng = new google.maps.LatLng(37.7621, -122.4350);
    // map options,
    var myOptions = {
      zoom: 14,
      center: myLatlng
    };
    // standard map
    this.map = new google.maps.Map(document.getElementById("app"), myOptions);

    var heatmap = new HeatmapOverlay(this.map,
      {
        "radius": 0.005,
        "maxOpacity": 1,
        "scaleRadius": true,
        "useLocalExtrema": true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count'
      }
    );

    var testData = {
        max: 4,
        data: [{
            lat: 37.7621,
            lng: -122.4350,
            count: 1
        }, {
            lat: 37.7721,
            lng: -122.4345,
            count: 2
        }, {
            lat: 37.7521,
            lng: -122.4200,
            count: 3
        }, {
          lat: 37.7421,
          lng: -122.4100,
          count: 4
        }]
    };

    heatmap.setData(testData);
  },
  render: function() {
    return (<div>I shoud be a map</div>);
  }
});
