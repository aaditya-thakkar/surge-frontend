var HeatmapCreator = require('./HeatmapCreator.js');

module.exports = {
  // constant lat-long offset
  llOffset: 0.00666666666666667*2,

  createGridLines: function(mapBounds) {
    var gridCenterPointsArray = [];
    var north = mapBounds.getNorthEast().lat();
    var south = mapBounds.getSouthWest().lat();
    var east = mapBounds.getNorthEast().lng();
    var west = mapBounds.getSouthWest().lng();

    // define the size of the grid

    var topLat = Math.ceil(north / this.llOffset) * this.llOffset;
    var rightLong = Math.ceil(east / this.llOffset) * this.llOffset;

    var bottomLat = Math.floor(south / this.llOffset) * this.llOffset;
    var leftLong = Math.floor(west / this.llOffset) * this.llOffset;

    for (var latitude = bottomLat; latitude <= topLat; latitude += this.llOffset) {
      for(var longitude = leftLong; longitude<= rightLong; longitude += this.llOffset) {
        var upLeftCoord= {
          lat: latitude + this.llOffset/2,
          lng: longitude - this.llOffset/2
        };
        var upRightCoord= {
          lat: latitude + this.llOffset/2,
          lng: longitude + this.llOffset/2
        };
        var lowLeftCoord= {
          lat: latitude - this.llOffset/2,
          lng: longitude - this.llOffset/2
        };
        var lowRightCoord= {
          lat: latitude - this.llOffset/2,
          lng: longitude + this.llOffset/2
         };
        var color = "#FFFFFF";

        var gridCenterObject = {
          lat: latitude,
          long: longitude,
          location: new google.maps.LatLng(latitude, longitude),
          upLeftCoord: upLeftCoord,
          upRightCoord: upRightCoord,
          lowLeftCoord: lowLeftCoord,
          lowRightCoord: lowRightCoord,
          surgePrice: 0.0,
          numberOfDemanders: 0,
          numberOfSuppliers: 0,
          color: color,
          label: "A",
          heatmap: HeatmapCreator.createHeatmap(color, upLeftCoord, upRightCoord, lowRightCoord, lowLeftCoord)
        };
        gridCenterPointsArray.push(gridCenterObject);
      }
    }
    return gridCenterPointsArray;
  }
}
