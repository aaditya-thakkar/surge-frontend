module.exports = {
  findSurgePrice: function(stream, gridCenterPoints, index) {
    if(stream._deleted==true){
      if(stream._source.object_type=="demander"){
        gridCenterPoints[index].num_d--;
      }
      else if(stream._source.object_type=="supplier"){
        gridCenterPoints[index].num_s--;
      }
    }
    else {
      if(stream._source.object_type=="demander"){
        gridCenterPoints[index].num_d++;
      }
      else if(stream._source.object_type=="supplier"){
        gridCenterPoints[index].num_s++;
      }
    }
    gridCenterPoints[index].surge_price=gridCenterPoints[index].num_d/gridCenterPoints[index].num_s;

    if(gridCenterPoints[index].num_d !=0 && gridCenterPoints[index].num_s==0){
      gridCenterPoints[index].surge_price=7;
    }
    else if(gridCenterPoints[index].num_d ==0 && gridCenterPoints[index].num_s==0){
      gridCenterPoints[index].surge_price=0;
    }
    //alert(this.gridCenterPoints[i].ds_mul);

    if(gridCenterPoints[index].surge_price<=1){
      gridCenterPoints[index].color="#0000FF";
    }
    else if(gridCenterPoints[index].surge_price<=1.5){
      gridCenterPoints[index].color="#00FF00";
    }
    else if(gridCenterPoints[index].surge_price<=5.0){
      gridCenterPoints[index].color="#FFFF00";
    }
    else{
      gridCenterPoints[index].color="#FF0000";
    }

    if(gridCenterPoints[index].surge_price<=2.0)
      gridCenterPoints[index].label="1.0x";
    else if(gridCenterPoints[index].surge_price<=3.5)
      gridCenterPoints[index].label="1.5x";
    else if(gridCenterPoints[index].surge_price<=5.0)
      gridCenterPoints[index].label="2.0x";
    else
      gridCenterPoints[index].label="2.5x";
    return ({
      gridCenterPoints: gridCenterPoints,
      index: index
    });
  }

};
