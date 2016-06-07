var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../config.json');
var helper = require('./helper.js');
var GridCreator = require('./GridCreator.js');
var Evaluator = require('./Evaluator.js');
var LabelCreator = require('./LabelCreator.js');

// Latitude and Longitude for San Francisco center
var mapCenterLocation = new google.maps.LatLng(37.7441, -122.4450);
var demandersArray = [];
var suppliersArray = [];
var appbaseRef = helper.appbaseRef;
var Map = React.createClass({
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
  setMapOnAll: function(map) {
    for (var i = 0; i < demandersArray.length; i++) {
      demandersArray[i].setMap(map);
    }
    for (var j = 0; j < suppliersArray.length; j++) {
      suppliersArray[j].setMap(map);
    }
  },
  clearMarkers: function() {
    this.setMapOnAll(null);
  },

  showMarkers: function() {
    this.setMapOnAll(this.state.map);
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

      if(stream._source.object_type == "demander") {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(stream._source.location[1], stream._source.location[0]),
          label: "D"
        });
        demandersArray.push(marker);
      }
      else {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(stream._source.location[1], stream._source.location[0]),
          label: 'S'
        });
        suppliersArray.push(marker);
      }
      //marker.setMap(self.state.map);

      gridCenterPoints[detectedPoint.index].heatmap.setOptions({ fillColor:  detectedPoint.gridCenterPoints[index].color});
      gridCenterPoints[detectedPoint.index].heatmap.setOptions({ strokeColor:  detectedPoint.gridCenterPoints[index].color});
      gridCenterPoints[detectedPoint.index].heatmap.setOptions({ strokeOpacity:  detectedPoint.gridCenterPoints[index].opacity});
      gridCenterPoints[detectedPoint.index].heatmap.setOptions({ fillOpacity:  detectedPoint.gridCenterPoints[index].opacity});
    }).on('error', function(stream) {
      console.log(stream)
    });
  },

  createShowMarkerButton: function() {
    var self = this;
    var showButton = document.createElement("input");
    showButton.type = "button";
    showButton.value = "show demanders and suppliers";
    showButton.className = "btn btn-primary";
    showButton.onclick = function(){
      self.showMarkers();
    };
    var foo = document.getElementById("floating-panel");
    foo.appendChild(showButton);
  },

  createHideMarkerButton: function() {
    var self = this;
    var HideButton = document.createElement("input");
    HideButton.type = "button";
    HideButton.value = "hide demanders and suppliers";
    HideButton.className = "btn btn-danger";
    HideButton.onclick = function(){
      self.clearMarkers();
    };
    var foo = document.getElementById("floating-panel");
    foo.appendChild(HideButton);
  },

  componentDidMount: function() {
    var self = this;
    // push the map on the DOM
    var map = new google.maps.Map(document.getElementById('app'), this.state.mapParams);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('over_map'));
    this.setState({
      map: map
    });
    this.createShowMarkerButton();
    this.createHideMarkerButton();

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
