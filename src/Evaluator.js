module.exports = {

  findSurgePrice: function(stream, gridCenterPoints, index) {
    if(stream._deleted == true){
      if(stream._source.object_type == "demander"){
        gridCenterPoints[index].numberOfDemanders--;
      }
      else if(stream._source.object_type == "supplier"){
        gridCenterPoints[index].numberOfSuppliers--;
      }
    }
    else {
      if(stream._source.object_type == "demander"){
        gridCenterPoints[index].numberOfDemanders++;
      }
      else if(stream._source.object_type == "supplier"){
        gridCenterPoints[index].numberOfSuppliers++;
      }
    }

    // surge price = number of demanders/number of suppliers
    gridCenterPoints[index].surgePrice = gridCenterPoints[index].numberOfDemanders/gridCenterPoints[index].numberOfSuppliers;

    // corner cases
    if(gridCenterPoints[index].numberOfDemanders != 0 && gridCenterPoints[index].numberOfSuppliers == 0){
      gridCenterPoints[index].surgePrice = 7;
    }
    else if(gridCenterPoints[index].numberOfDemanders == 0 && gridCenterPoints[index].numberOfSuppliers == 0){
      gridCenterPoints[index].surgePrice = 0;
    }

    // colors and labels according to the surge price measures
    if(gridCenterPoints[index].surgePrice <= 1){
      gridCenterPoints[index].color = "#0000FF";
      gridCenterPoints[index].label = "1.0x";
    }
    else if(gridCenterPoints[index].surgePrice <= 1.5){
      gridCenterPoints[index].color = "#00FF00";
      gridCenterPoints[index].label = "1.5x";
    }
    else if(gridCenterPoints[index].surgePrice <= 4.0){
      gridCenterPoints[index].color = "#FFFF00";
      gridCenterPoints[index].label = "2.0x";
    }
    else{
      gridCenterPoints[index].color = "#FF0000";
      gridCenterPoints[index].label = "2.5x";
    }

    return ({
      gridCenterPoints: gridCenterPoints,
      index: index
    });
  }

};
