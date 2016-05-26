var HeatmapCreator = require('./HeatmapCreator.js');
module.exports = {
  // constant lat-long offset
  llOffset: 0.00666666666666667*2,

  createGridLines: function(bounds) {
    var arr = [];
    var north = bounds.getNorthEast().lat();
    var south = bounds.getSouthWest().lat();
    var east = bounds.getNorthEast().lng();
    var west = bounds.getSouthWest().lng();

    // define the size of the grid

    var topLat = Math.ceil(north / this.llOffset) * this.llOffset;
    var rightLong = Math.ceil(east / this.llOffset) * this.llOffset;

    var bottomLat = Math.floor(south / this.llOffset) * this.llOffset;
    var leftLong = Math.floor(west / this.llOffset) * this.llOffset;

    for (var latitude = bottomLat; latitude <= topLat; latitude += this.llOffset) {
      for(var longitude = leftLong; longitude<= rightLong; longitude += this.llOffset) {
        var up_left= {
          lat: latitude + this.llOffset/2,
          lng: longitude - this.llOffset/2
        };
        var up_right= {
          lat: latitude + this.llOffset/2,
          lng: longitude + this.llOffset/2
        };
        var low_left= {
          lat: latitude - this.llOffset/2,
          lng: longitude - this.llOffset/2
        };
        var low_right= {
          lat: latitude - this.llOffset/2,
          lng: longitude + this.llOffset/2
         };
        var color = "#FFFFFF";
        // marker points of an area.
        // console.log("entering");
        var obj = {
          lat: latitude,
          long: longitude,
          location: new google.maps.LatLng(latitude, longitude),
          up_left: up_left,
          up_right: up_right,
          low_left: low_left,
          low_right: low_right,
          surge_price: 0.0,
          num_d: 0,
          num_s: 0,
          color: color,
          label: "A",
          heatmap: HeatmapCreator.createHeatmap(color,up_left,up_right,low_right,low_left)
        };
        arr.push(obj);
      }
    }
    return arr;
  }
}
