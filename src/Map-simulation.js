var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../config.json');
var helper = require('./helper.js');
var GridCreator = require('./GridCreator.js');
var Evaluator = require('./Evaluator.js');

// Latitude and Longitude for San Francisco center
var mapCenterLocation = new google.maps.LatLng(37.7441, -122.4450);
var markersArray = [];
var gridCenterPointsArray = [];
var appbaseRef = helper.appbaseRef;
var MapSim = React.createClass({
  getInitialState: function() {
    return ({
      // initial map parameters
      mapParams: {
        center: mapCenterLocation,
        zoom: 14,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        scaleControl: true
      },
      map: null,
      // array to store the center locations of each grid the map is divided into
      gridCenterPoints: []
    });
  },

  // stream the updates happening in the grid, i.e new demander comes, new suppiler comes, etc. and according to new surge price change the color of grid heatmap
  callRealtimeGridUpdates: function() {
    var self = this;
    var requestMarkerObject = helper.buildRequestMarkerObject()

    // appbase search stream query
    appbaseRef.searchStream(requestMarkerObject).on('data', function(stream) {
      var marker = null;
      if(stream._source.object_type == "demander") {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(stream._source.location[1], stream._source.location[0]),
          label: "D",
        });
      }
      else {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(stream._source.location[1], stream._source.location[0]),
          label: 'S'
        });
      }
      if (stream._deleted == true){
        markersArray[stream._source.location].setMap(null);
        console.log("deleted");
        markersArray.splice(stream._source.location,1);
      }
      else {
        marker.setMap(self.state.map);
        console.log("added");
        markersArray[stream._source.location]=marker;
      }
    }).on('error', function(stream) {
      console.log(stream)
    });
  },

  callStaticUpdates: function(map, gridCenterPointsArray) {
    var requestMarkerObject = helper.buildRequestMarkerObject();
    appbaseRef.search(requestMarkerObject).on('data', function(stream) {
      console.log(stream.hits.total);
      for(var h = 0; h < stream.hits.total; h++){
        var marker=null;
        if(stream.hits.hits[h]._source.object_type == "demander"){
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(stream.hits.hits[h]._source.location[1], stream.hits.hits[h]._source.location[0]),
            label: "D",
            map: map
          });
          console.log("setting demader");
        }
        else{
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(stream.hits.hits[h]._source.location[1], stream.hits.hits[h]._source.location[0]),
            label: "S",
            map: map
          });
          console.log("setting supplier");
        }
      }
    }).on('error', function(stream) {
      console.log(stream)
    });
  },

  componentDidMount: function() {
    var self = this;
    // push the map on the DOM
    var map = new google.maps.Map(document.getElementById('app'), this.state.mapParams);
    this.setState({
      map: map
    });
    // triggers gridcreator, labelcreator, heatmapcreator when the map is in idle state
    google.maps.event.addListenerOnce(map, 'idle', function(){
      gridCenterPointsArray = GridCreator.createGridLines(map.getBounds(), 0.5);
      self.callStaticUpdates(map, gridCenterPointsArray);
      for (var index = 0; index < gridCenterPointsArray.length; index++) {
        gridCenterPointsArray[index].heatmap.setMap(self.state.map);
      }
      // sets the state of grid array and in the callback, calls for the updates heppening in the grids
      self.setState({
        gridCenterPoints: gridCenterPointsArray
      }, function(){
        self.callRealtimeGridUpdates();
      });
    });
  },

  render: function() {
    return (<div>Error Displaying the map!</div>);
  }
});

module.exports = MapSim;
