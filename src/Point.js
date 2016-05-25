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
    console.log(this.props.color);

    try {
        this.props.map.setMap(null);
    }
    catch(e) {}
    // heatmap.setMap(null);
    setTimeout(function() {
        this.props.heatmap.setMap(this.props.map);
    }.bind(this), 2000);

  },

  render: function() {
    //alert(2);
    return null;
  }
});

module.exports = Point;
