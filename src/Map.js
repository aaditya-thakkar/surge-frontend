var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../config.json');
var helper = require('./helper.js');
var GridCreator = require('./GridCreator.js');
var Evaluator = require('./Evaluator.js');
var LabelCreator = require('./LabelCreator.js');

// constant lat-long offset
var llOffset = 0.00666666666666667*2;

// Latitude and Longitude for San Francisco center
var mapCenterLocation = new google.maps.LatLng(37.7421, -122.4350)

var heatmapArray = [];
var appbaseRef = helper.appbaseRef;
var Map = React.createClass({
  getInitialState: function() {
    return ({
      mapParams: {
        center: mapCenterLocation,
        zoom: 14,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true
      },
      map: null,
      gridCenterPoints: []
    });
  },

  subscribeGridUpdates: function(gridPointsIndex) {
    var index = gridPointsIndex;
    var self = this;
    var gridCenterPoints = this.state.gridCenterPoints;
    var requestObject = helper.buildRequestObject(gridCenterPoints[index].long, gridCenterPoints[index].lat)
    appbaseRef.searchStream(requestObject).on('data', function(stream) {
      var detectedPoint= Evaluator.findSurgePrice(stream, gridCenterPoints, index);
      gridCenterPoints[detectedPoint.index].heatmap.setOptions({ fillColor:  detectedPoint.gridCenterPoints[index].color});
      gridCenterPoints[detectedPoint.index].heatmap.setOptions({ strokeColor:  detectedPoint.gridCenterPoints[index].color});
    }).on('error', function(stream) {
      console.log(stream)
    });
  },

  componentDidMount: function() {
    var self = this;
    var map = new google.maps.Map(document.getElementById('app'), this.state.mapParams);
    
    this.setState({
      map: map
    });

    google.maps.event.addListenerOnce(map, 'idle', function(){
      var gridCenterPointsArray = [];
      gridCenterPointsArray = GridCreator.createGridLines(map.getBounds());
      
      for (var index = 0; index < gridCenterPointsArray.length; index++) {
        gridCenterPointsArray[index].heatmap.setMap(self.state.map);
        LabelCreator.createLabel(self.state.map, gridCenterPointsArray[index].location, index*70, gridCenterPointsArray[index].label);
      }

      self.setState({
        gridCenterPoints: gridCenterPointsArray
      }, function(){
        for (var index = 0; index < gridCenterPointsArray.length; index++) {
          self.subscribeGridUpdates(index);
        }
      });
    });
  },

  render: function() {
    return (<div>Error Displaying the map!</div>);
  }
});

module.exports = Map;
