module.exports = {
  /* Create grid bounds on the map, called from Map.js on map initialization. */
  createGridLines: function(mapBounds, opacity) {
    var llOffset =  0.00666666666666667*1.5;
    var gridCenterPointsArray = [];

    // north, south, east, and west coordinates of the map.
    var north = mapBounds.getNorthEast().lat();
    var south = mapBounds.getSouthWest().lat();
    var east = mapBounds.getNorthEast().lng();
    var west = mapBounds.getSouthWest().lng();

    // defines the size of the grid sides.
    var topLat = Math.ceil(north / llOffset) * llOffset;
    var rightLong = Math.ceil(east / llOffset) * llOffset;
    var bottomLat = Math.floor(south / llOffset) * llOffset;
    var leftLong = Math.floor(west / llOffset) * llOffset;

    // generates each grid's coordinates
    for (var latitude = bottomLat; latitude <= topLat+3*llOffset; latitude += llOffset) {
      if(latitude>=topLat+llOffset){
        leftLong+=2*llOffset;
        rightLong-=llOffset;
      }
      for(var longitude = leftLong+llOffset; longitude<= rightLong; longitude += llOffset) {
        var upLeftCoord= {
          lat: latitude + llOffset/2,
          lng: longitude - llOffset/2
        };
        var upRightCoord= {
          lat: latitude + llOffset/2,
          lng: longitude + llOffset/2
        };
        var lowLeftCoord= {
          lat: latitude - llOffset/2,
          lng: longitude - llOffset/2
        };
        var lowRightCoord= {
          lat: latitude - llOffset/2,
          lng: longitude + llOffset/2
        };

        // initial default color when map loads and grids are created
        var color = "#00ffffff";
        var opacity = opacity;

        // grid object representing its center and other properties
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
          opacity: opacity,
          cell: this.createCell(opacity, color, upLeftCoord, upRightCoord, lowRightCoord, lowLeftCoord)
        };
        gridCenterPointsArray.push(gridCenterObject);
      }
    }
    return gridCenterPointsArray;
  },

  createCell: function(opacity, color, upLeftCoord, upRightCoord, lowRightCoord, lowLeftCoord) {
    // bounds for the cell polygon
    var polyCoords = [
      upLeftCoord,
      upRightCoord,
      lowRightCoord,
      lowLeftCoord
    ];

    // cell properties
    var cellProps = new google.maps.Polygon({
      paths: polyCoords,
      strokeColor: color,
      strokeOpacity: opacity,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: opacity
    });
    return cellProps;
  }
}
