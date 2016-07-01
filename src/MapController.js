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

    return gridCenterPoints;
  }

};
