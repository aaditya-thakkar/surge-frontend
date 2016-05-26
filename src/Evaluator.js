module.exports = {
  findSurgePrice: function(stream, points, index) {
    if(stream._deleted==true){
      if(stream._source.object_type=="demander"){
        points[index].num_d--;
      }
      else if(stream._source.object_type=="supplier"){
        points[index].num_s--;
      }
    }
    else {
      if(stream._source.object_type=="demander"){
        points[index].num_d++;
      }
      else if(stream._source.object_type=="supplier"){
        points[index].num_s++;
      }
    }
    points[index].surge_price=points[index].num_d/points[index].num_s;

    if(points[index].num_d !=0 && points[index].num_s==0){
      points[index].surge_price=7;
    }
    else if(points[index].num_d ==0 && points[index].num_s==0){
      points[index].surge_price=0;
    }
    //alert(this.points[i].ds_mul);

    if(points[index].surge_price<=2.0){
      points[index].color="#0000FF";
    }
    else if(points[index].surge_price<=3.5){
      points[index].color="#00FF00";
    }
    else if(points[index].surge_price<=5.0){
      points[index].color="#FFFF00";
    }
    else{
      points[index].color="#FF0000";
    }

    if(points[index].surge_price<=2.0)
      points[index].label="1.0x";
    else if(points[index].surge_price<=3.5)
      points[index].label="1.5x";
    else if(points[index].surge_price<=5.0)
      points[index].label="2.0x";
    else
      points[index].label="2.5x";
    return ({
      points: points,
      index: index
    });
  }

};
