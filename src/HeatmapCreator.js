module.exports ={

  createHeatmap: function(color, upLeftCoord, upRightCoord, lowRightCoord, lowLeftCoord) {

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
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.15
    });
    return heatmapProps;
  }
};
