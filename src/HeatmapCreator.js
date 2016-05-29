module.exports ={

  createHeatmap: function(color, upLeftCoord, upRightCoord, lowRightCoord, lowLeftCoord) {
    var polyCoords = [
      upLeftCoord,
      upRightCoord,
      lowRightCoord,
      lowLeftCoord
    ];
    var heatmapProps = new google.maps.Polygon({
      paths: polyCoords,
      strokeColor: "#ffff00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#ffff00",
      fillOpacity: 0.15
    });
    return heatmapProps;
  }
};
