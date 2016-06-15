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
//console.log(window.location.pathname);
if(window.location.pathname == "/index.html"){
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
