var React = require('react');
var ReactDOM = require('react-dom');
var Map = require('./Map')
var Point = React.createClass({
  getInitialState: function() {
      return({
        lat: this.props.lat,
        long: this.props.long,
        location: this.props.location,
        up_left: this.props.up_left,
        up_right: this.props.up_right,
        low_left: this.props.low_left,
        low_right: this.props.low_right,
        surge_price: this.props.surge_price,
        num_d: this.props.num_d,
        num_s: this.props.num_s,
        color: this.props.color,
        label: this.props.label
      });
  },
  componentDidUpdate: function() {
    this.plotGrid();
  },
  componentDidMount: function() {
    this.plotGrid();
  },
  plotGrid: function() {
    var polyCoords = [
      this.state.up_left,
      this.state.up_right,
      this.state.low_right,
      this.state.low_left
    ];
    var heatmap = new google.maps.Polygon({
      paths: polyCoords,
      strokeColor: this.state.color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: this.state.color,
      fillOpacity: 0.15
    });
    heatmap.setMap(this.props.map);
  },

  render: function() {
    alert(2);
    return null;
  }
});

module.exports = Point;
