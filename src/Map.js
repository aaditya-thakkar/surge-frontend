var React = require('react');
var ReactDOM = require('react-dom');
var Point = require('./Point');
var Appbase = require('../node_modules/appbase-js');
var config = {
  "appname": "surge-pricing",
  "username": "nSTuWqtf4",
  "password": "cfa0ff2c-7411-4498-b7fa-53f434d3d64e",
  "type": "coordinates"
};
var heatmapArray = [];
var appbaseRef = new Appbase({
  url: 'https://scalr.api.appbase.io',
  appname: config.appname,
  username: config.username,
  password: config.password
});
var llOffset = 0.00666666666666667*2;

var Map = React.createClass({
  getInitialState: function() {
    var self=this;
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

  getDataManually: function() {
    var arr=this.state.points;
    heatmapArray.forEach(function (ele) {
      ele.setMap(null);
    });
    for(var i=0;i<this.state.points.length;i++){
      arr[i].color="#00FF00";
      console.log(arr[i].color);
    }
    alert("setting state");
    this.setState({
      points: arr
    });
    //console.log(this.state.points);
  },

  appbase_search_stream: function(appbaseRef, i) {
    var index = i;
    var self=this;
    var points = this.state.points;
    var requestObject = {
      type: config.type,
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
    console.log("halfway");
    document.body.insertAdjacentHTML("beforeend", "Listening.....")
    appbaseRef.searchStream(requestObject).on('data', function(stream) {
      console.log("in stream");
      if(stream._deleted==true){
        if(stream._source.object_type=="demander"){
          points[index].num_d--;
          console.log(points[index].num_d);
        }
        else if(stream._source.object_type=="supplier"){
          points[index].num_s--;
        }
      }
      else {
        if(stream._source.object_type=="demander"){
          points[index].num_d++;
        }
        else if(stream._source.object_type=="supplier"){
          points[index].num_s++;
        }
      }
      points[index].surge_price=points[index].num_d/points[index].num_s;

      if(points[index].num_d !=0 && points[index].num_s==0){
        points[index].surge_price=7;
      }
      else if(points[index].num_d ==0 && points[index].num_s==0){
        points[index].surge_price=0;
      }
      //alert(this.points[i].ds_mul);

      if(points[index].surge_price<=2.0){
        points[index].color="#0000FF";
      }
      else if(points[index].surge_price<=3.5){
        points[index].color="#00FF00";
      }
      else if(points[index].surge_price<=5.0){
        points[index].color="#FFFF00";
      }
      else{
        points[index].color="#FF0000";
      }

      if(points[index].surge_price<=2.0)
        points[index].label="1.0x";
      else if(points[index].surge_price<=3.5)
        points[index].label="1.5x";
      else if(points[index].surge_price<=5.0)
        points[index].label="2.0x";
      else
        points[index].label="2.5x";
      console.log("setting state again");
      self.setState({
        points: points,
      });
      console.log(self.state.points[i].color);
      //alert("going into surge pricing");
      /*self.mapSurgePricing();
      self.createLabels();*/

    }).on('error', function(error) {
      document.write("<br>Query error: ", JSON.stringify(error))
    });
  },

  getDataFromAppbase: function() {
    console.log("entered");

    for(var i=0; i<this.state.points.length; i++){
      console.log("entered again");
      this.appbase_search_stream(appbaseRef,i);
    }

  },

  createGridLines: function(bounds) {
    var north = bounds.getNorthEast().lat();
    var south = bounds.getSouthWest().lat();
    var east = bounds.getNorthEast().lng();
    var west = bounds.getSouthWest().lng();

    // define the size of the grid

    var topLat = Math.ceil(north / llOffset) * llOffset;
    var rightLong = Math.ceil(east / llOffset) * llOffset;

    var bottomLat = Math.floor(south / llOffset) * llOffset;
    var leftLong = Math.floor(west / llOffset) * llOffset;

    for (var latitude = bottomLat; latitude <= topLat; latitude += llOffset) {
      for(var longitude = leftLong; longitude<= rightLong; longitude += llOffset) {
        // marker points of an area.
        var arr = this.state.points;

        arr.push({
          lat: latitude,
          long: longitude,
          location: new google.maps.LatLng(latitude, longitude),
          up_left: {
            lat: latitude + llOffset/2,
            lng: longitude - llOffset/2
          },
          up_right: {
            lat: latitude + llOffset/2,
            lng: longitude + llOffset/2
          },
          low_left: {
            lat: latitude - llOffset/2,
            lng: longitude - llOffset/2
          },
          low_right: {
            lat: latitude - llOffset/2,
            lng: longitude + llOffset/2
          },
          surge_price: 0.0,
          num_d: 0,
          num_s: 0,
          color: "#FF0000",
          label: "A"
        });
      }
    }

    this.setState({
      points: arr
    });
    /*alert(this.state.points.length);
    alert("grid lines created");*/
    //this.getDataManually();
  },

  componentDidMount: function() {
    //alert("mounted");
    var self = this;
    var map = new google.maps.Map(document.getElementById('app'), this.state.myParams);
    this.setState({
      map: map
    });
    //alert("5");
    google.maps.event.addListenerOnce(map, 'idle', function(){
    //  alert("going to create grid lines");
      self.createGridLines(map.getBounds());
      setTimeout(function(){ self.getDataManually();},5000);
    });
  },

  eachPoint: function(single_point, i) {
    var polyCoords = [
      this.state.points[i].up_left,
      this.state.points[i].up_right,
      this.state.points[i].low_right,
      this.state.points[i].low_left
    ];

    var heatmap = new google.maps.Polygon({
      paths: polyCoords,
      strokeColor: this.state.points[i].color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: this.state.points[i].color,
      fillOpacity: 0.15
    });
    heatmapArray.push(heatmap);
    return (
      <Point key={i} index={i} lat={this.state.points[i].lat}
            long={this.state.points[i].long}
            location={this.state.points[i].location}
            up_left={this.state.points[i].up_left}
            up_right={this.state.points[i].up_right}
            low_left={this.state.points[i].low_left}
            low_right={this.state.points[i].low_right}
            surge_price={this.state.points[i].surge_price}
            num_d={this.state.points[i].num_d}
            num_s={this.state.points[i].num_s}
            color={this.state.points[i].color}
            label={this.state.points[i].label}
            heatmap={heatmap}
            map={this.state.map}
      ></Point>
    );
  },

  render: function() {
    console.log("rendering");
    return (<div>{this.state.points.map(this.eachPoint)}</div>);        // if map is not rendering successfully!
  }
});

module.exports = Map;
