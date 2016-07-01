module.exports = {

  findSurgePrice: function(stream, gridCenterPoints, index) {
    if(stream._deleted == true) {
        gridCenterPoints[index].surgePrice--;
    }
    else {
        gridCenterPoints[index].surgePrice++;
    }
    return gridCenterPoints;
  }

};
