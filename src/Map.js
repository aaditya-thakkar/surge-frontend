var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../config.json');
var helper = require('./helper.js');
var GridCreator = require('./GridCreator.js');
var Evaluator = require('./Evaluator.js');

// constant lat-long offset
var llOffset = 0.00666666666666667*2;

var heatmapArray = [];

var Map = React.createClass({
  getInitialState: function() {
    return ({
      myParams: {
        center: new google.maps.LatLng(37.7421, -122.4350),
        zoom: 14,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true
      },
      map: null,
      points: []
    });
  },

  appbase_search_stream: function(appbaseRef, i) {
    var index = i;
    var self=this;
    var points = this.state.points;
    var requestObject = {
      type: config.appbase.type,
      body: {
        "query": {
          "filtered" : {
            "query" : {
              "match_all" : {}
            },
            "filter" : {
              "geo_distance" : {
                "distance" : "200km",
                "location" : [points[index].long, points[index].lat]
              }
            }
          }
        }
      }
    };
    document.body.insertAdjacentHTML("beforeend", "Listening.....")
    appbaseRef.searchStream(requestObject).on('data', function(stream) {
      var detectedPoint= Evaluator.findSurgePrice(stream, points, index);
      console.log(detectedPoint);
      self.state.points[detectedPoint.index].heatmap.setOptions({ fillColor:  detectedPoint.points[index].color});
      self.state.points[detectedPoint.index].heatmap.setOptions({ strokeColor:  detectedPoint.points[index].color});

      console.log(self.state.points[detectedPoint.index].heatmap.strokeColor);
    });
  },

  getDataFromAppbase: function() {}
    var appbaseRef = helper.appbaseRef;
    for(var i=0; i<this.state.points.length; i++){
      this.appbase_search_stream(appbaseRef,i);
    }
  },

  componentDidMount: function() {
    var self = this;
    var map = new google.maps.Map(document.getElementById('app'), this.state.myParams);
    this.setState({
      map: map
    });

    google.maps.event.addListenerOnce(map, 'idle', function(){
      var arr = [];
      arr = GridCreator.createGridLines(map.getBounds());
      self.setState({
        points: arr
      });
      for (var i=0; i<self.state.points.length; i++) {
        self.state.points[i].heatmap.setMap(self.state.map);
      }
      self.getDataFromAppbase();
    });
  },

  render: function() {
    return (<div>I shoud be a map</div>);
  }
});

module.exports = Map;
