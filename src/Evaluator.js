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
    if(gridCenterPoints[index].surgePrice <= 0.6){
      gridCenterPoints[index].color = "#00ffffff";
      gridCenterPoints[index].opacity = 0.0;
    }
    else if(gridCenterPoints[index].surgePrice <= 0.75){
      gridCenterPoints[index].color = "#ec891d";
      gridCenterPoints[index].opacity = 0.35;
    }
    else if(gridCenterPoints[index].surgePrice <= 2.0){
      gridCenterPoints[index].color = "#ff0000";
      gridCenterPoints[index].opacity = 0.35;
    }
    else{
      gridCenterPoints[index].color = "#4c0000";
      gridCenterPoints[index].opacity = 0.35;
    }

    return ({
      gridCenterPoints: gridCenterPoints,
      index: index
    });
  }

};
