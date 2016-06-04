module.exports ={

  createHeatmap: function(opacity, color, upLeftCoord, upRightCoord, lowRightCoord, lowLeftCoord) {

    // bounds for the heatmap polygon
    var polyCoords = [
      upLeftCoord,
      upRightCoord,
      lowRightCoord,
      lowLeftCoord
    ];

    // heatmap properties
    var heatmapProps = new google.maps.Polygon({
      paths: polyCoords,
      strokeColor: color,
      strokeOpacity: opacity,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: opacity
    });
    return heatmapProps;
  }
};
