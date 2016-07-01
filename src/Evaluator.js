module.exports = {

  findSurgePrice: function(stream, gridCenterPoints, index) {
    if(stream._deleted == true){
        gridCenterPoints[index].numberOfDemanders--;
    }
    else {
        gridCenterPoints[index].numberOfDemanders++;
    }

    // surge price = number of demanders/number of suppliers
    gridCenterPoints[index].surgePrice = gridCenterPoints[index].numberOfDemanders;

    // colors and labels according to the surge price measures
    if(gridCenterPoints[index].surgePrice <= 1){
      gridCenterPoints[index].color = "#00ffffff";
      gridCenterPoints[index].opacity = 0.0;
    }
    else if(gridCenterPoints[index].surgePrice <= 2){
      gridCenterPoints[index].color = "#ec891d";
      gridCenterPoints[index].opacity = 0.15;
    }
    else if(gridCenterPoints[index].surgePrice <= 3){
      gridCenterPoints[index].color = "#ff0000";
      gridCenterPoints[index].opacity = 0.15;
    }
    else{
      gridCenterPoints[index].color = "#4c0000";
      gridCenterPoints[index].opacity = 0.15;
    }

    return ({
      gridCenterPoints: gridCenterPoints,
      index: index
    });
  }

};
