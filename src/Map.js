var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../config.json');
var helper = require('./helper.js');
var GridCreator = require('./GridCreator.js');
var Evaluator = require('./Evaluator.js');
var LabelCreator = require('./LabelCreator.js');

// Latitude and Longitude for San Francisco center
var mapCenterLocation = new google.maps.LatLng(37.7421, -122.4450);

var appbaseRef = helper.appbaseRef;
var Map = React.createClass({
  getInitialState: function() {
    return ({
      // initial map parameters
      mapParams: {
        center: mapCenterLocation,
        zoom: 14,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true
      },
      map: null,
      // array to store the center locations of each grid the map is divided into
      gridCenterPoints: []
    });
  },

  // stream the updates happening in the grid, i.e new demander comes, new suppiler comes, etc. and according to new surge price change the color of grid heatmap
  subscribeGridUpdates: function(gridPointsIndex) {
    var index = gridPointsIndex;
    var self = this;
    var gridCenterPoints = this.state.gridCenterPoints;
    var requestObject = helper.buildRequestObject(gridCenterPoints[index].long, gridCenterPoints[index].lat)

    // appbase search stream query
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
    // push the map on the DOM
    var map = new google.maps.Map(document.getElementById('app'), this.state.mapParams);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('over_map'));
    this.setState({
      map: map
    });

    // triggers gridcreator, labelcreator, heatmapcreator when the map is in idle state
    google.maps.event.addListenerOnce(map, 'idle', function(){
      var gridCenterPointsArray = [];
      gridCenterPointsArray = GridCreator.createGridLines(map.getBounds());

      for (var index = 0; index < gridCenterPointsArray.length; index++) {
        gridCenterPointsArray[index].heatmap.setMap(self.state.map);
        //LabelCreator.createLabel(self.state.map, gridCenterPointsArray[index].location, index*70, gridCenterPointsArray[index].label);
      }

      // sets the state of grid array and in the callback, calls for the updates heppening in the grids
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
