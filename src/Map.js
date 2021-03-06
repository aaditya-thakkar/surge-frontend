var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../config.json');
var helper = require('./helper.js');
var HeatmapCreator = require('./HeatmapCreator.js');
var MapController = require('./MapController.js');
var Simulator = require('../simulator/index.js');
var markersArray = [];
// Latitude and Longitude for San Francisco center
var mapCenterLocation = new google.maps.LatLng(37.7441, -122.4450);
var gridCenterPointsArray = [];
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

  componentDidMount: function() {
    var self = this;
    // push the map on the DOM
    var map = new google.maps.Map(document.getElementById('app'), this.state.mapParams);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('over_map'));
    this.setState({
      map: map
    });
    this.createShowSimulationButton()
    // when the map is initialized, we set grid bounds and start listening for data updates
    google.maps.event.addListenerOnce(map, 'idle', function(){
      gridCenterPointsArray = HeatmapCreator.createGridLines(map.getBounds(), 0);
      for (var index = 0; index < gridCenterPointsArray.length; index++) {
        self.callStaticUpdates(map, gridCenterPointsArray, index);
      }
      self.setState({
        gridCenterPoints: gridCenterPointsArray
      });
    });
  },

  callStaticUpdates: function(map, gridCenterPointsArray, index) {
    var self = this;
    var requestObject = helper.buildRequestObject([gridCenterPointsArray[index].upLeftCoord.lng,gridCenterPointsArray[index].upLeftCoord.lat], [gridCenterPointsArray[index].lowRightCoord.lng,gridCenterPointsArray[index].lowRightCoord.lat])
    appbaseRef.search(requestObject).on('data', function(stream) {
      for(var h = 0; h < stream.hits.total; h++){
        gridCenterPointsArray = MapController.findSurgePrice(stream.hits.hits[h], gridCenterPointsArray, index);
        self.updateCellColors(gridCenterPointsArray, index);
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(stream.hits.hits[h]._source["location-field"][1], stream.hits.hits[h]._source["location-field"][0]),
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          map: map
        });
      }
      gridCenterPointsArray[index].cell.setMap(self.state.map);
      self.callRealtimeGridUpdates(index);
    }).on('error', function(stream) {
         console.log(stream)
    });
  },

  // stream the updates happening in the grid, i.e new demander comes, new suppiler comes, etc. and according to new surge price change the color of grid cell
  callRealtimeGridUpdates: function(gridPointsIndex) {
    var index = gridPointsIndex;
    var self = this;
    var gridCenterPoints = this.state.gridCenterPoints;
    var requestObject = helper.buildRequestObject([gridCenterPoints[index].upLeftCoord.lng,gridCenterPoints[index].upLeftCoord.lat], [gridCenterPoints[index].lowRightCoord.lng,gridCenterPoints[index].lowRightCoord.lat])

    // appbase search stream query
    appbaseRef.searchStream(requestObject).on('data', function(stream) {
      gridCenterPoints = MapController.findSurgePrice(stream, gridCenterPoints, index);
      self.updateCellColors(gridCenterPoints, index);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(stream._source["location-field"][1], stream._source["location-field"][0]),
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      if (stream._deleted == true){
        markersArray[stream._source["location-field"]].setMap(null);
        markersArray.splice(stream._source["location-field"],1);
      }
      else {
        marker.setMap(self.state.map);
        markersArray[stream._source["location-field"]]=marker;
      }
    }).on('error', function(stream) {
         console.log(stream)
    });
  },

  updateCellColors: function(gridCenterPoints, index){
    // colors and labels according to the surge price measures
    if(gridCenterPoints[index].surgePrice < 1){
      gridCenterPoints[index].color = "#00ffffff";
      gridCenterPoints[index].opacity = 0.0;
    }
    else if(gridCenterPoints[index].surgePrice < 2){
      gridCenterPoints[index].color = "#ec891d";
      gridCenterPoints[index].opacity = 0.50;
    }
    else if(gridCenterPoints[index].surgePrice < 3){
      gridCenterPoints[index].color = "#ff0000";
      gridCenterPoints[index].opacity = 0.50;
    }
    else{
      gridCenterPoints[index].color = "#4c0000";
      gridCenterPoints[index].opacity = 0.50;
    }

    gridCenterPoints[index].cell.setOptions({ fillColor:  gridCenterPoints[index].color});
    gridCenterPoints[index].cell.setOptions({ strokeColor:  gridCenterPoints[index].color});
    gridCenterPoints[index].cell.setOptions({ fillOpacity:  gridCenterPoints[index].opacity});
  },

  createShowSimulationButton: function() {
    var self = this;
    var showButton = document.createElement("input");
    showButton.type = "button";
    showButton.style = "font-family:Arial";
    showButton.value = "Start Simulation";
    showButton.className = "btn btn-primary";
    showButton.onclick = function(){
      Simulator.dataGenerator();
    };
    document.getElementById("floating-panel").appendChild(showButton);
  },

  render: function() {
    return (<div>Error Displaying the map!</div>);
  }
});

module.exports = Map;
