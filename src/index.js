var ReactDOM = require('react-dom');
var React = require('react');
// mixin to improve the performance 
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Map = require('./Map');
React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <div className={this.props.className}>foo</div>;
  }
});
ReactDOM.render(
  <Map />,
  document.getElementById('app')
);
