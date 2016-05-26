module.exports ={
  createHeatmap: function(color,up_left,up_right,low_right,low_left) {
    //console.log(color);
    var polyCoords = [
      up_left,
      up_right,
      low_right,
      low_left
    ];
    // console.log("create var heatmap");
    var heatmap = new google.maps.Polygon({
      paths: polyCoords,
      strokeColor: "#ffff00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#ffff00",
      fillOpacity: 0.15
    });
    //heatmap.setMap(self.state.map);
    // console.log("exit");
    return heatmap;
  }
};
