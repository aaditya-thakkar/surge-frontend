var ReactDOM = require('react-dom');
var React = require('react');
// mixin to improve the performance
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Map = require('./Map');
var MapSim = require('./Map-simulation');
React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <div className={this.props.className}>foo</div>;
  }
});
if(window.location.href == "http://localhost:3001/index.html"){
  ReactDOM.render(
    <Map />,
    document.getElementById('app')
  );
}
else{
  ReactDOM.render(
    <MapSim />,
    document.getElementById('app')
  );
}
