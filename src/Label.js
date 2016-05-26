var React = require('react');
var ReactDOM = require('react-dom');
var Map = require('./Map');

var Label = React.createClass({
  getInitialState: function() {
    return({
      location: this.props.location,
      label: this.props.label
    });
  },

  TxtOverlay: function(pos, txt, cls, map) {

    // Now initialize all properties.
    this.pos = pos;
    this.txt_ = txt;
    this.cls_ = cls;
    this.map_ = map;
    this.div_ = null;

    // Explicitly call setMap() on this overlay
    this.setMap(map);
  },

  plotLabels: function(location, label) {
    var marker = new google.maps.Marker({
      position: position,
      map: self.map,
      //  animation: google.maps.Animation.BOUNCE
    });
    customTxt = label;
    txt = new TxtOverlay(position, customTxt, "customBox", this.props.map);

    TxtOverlay.prototype = new google.maps.OverlayView();


    TxtOverlay.prototype.onAdd = function() {

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


      var position = overlayProjection.fromLatLngToDivPixel(this.pos);
      var div = this.div_;
      div.style.left = position.x + 'px';
      div.style.top = position.y + 'px';
    }
  },

  componentDidUpdate: function () {
    this.plotLabels(this.state.location, this.state.label);
  },

  componentDidMount: function () {
    this.plotLabels(this.state.location, this.state.label);
  },

  render: function () {
    return null;
  }

});

module.exports = Label;
