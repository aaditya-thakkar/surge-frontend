module.exports = {
  // latitude longitude value precision
  MAX_PRECISION: 4,
  // map bounds - san Francisco
  leftLong: -122.50333333333338,
  rightLong: -122.38333333333339,
  bottomLat: 37.716666666666685,
  topLat: 37.77333333333335,

  leftLongEx: -122.48333333333338,
  rightLongEx: -122.46833333333339,
  bottomLatEx: 37.77333333333335,
  topLatEx: 37.80333333333335,

  // random latitude longitude generator
  generateLatLong: function() {
    var randomLong = this.getRandomInRange(this.leftLong, this.rightLong, this.MAX_PRECISION);
    var randomLat = this.getRandomInRange(this.bottomLat, this.topLat, this.MAX_PRECISION);

    var randomLongEx = this.getRandomInRange(this.leftLongEx, this.rightLongEx, this.MAX_PRECISION);
    var randomLatEx = this.getRandomInRange(this.bottomLatEx, this.topLatEx, this.MAX_PRECISION);

    var latLong = {
      lat: randomLat,
      long: randomLong
    };

    var latLongEx = {
      lat: randomLatEx,
      long: randomLongEx
    };

    var weight = Math.random();
    if(weight<0.8){
      return latLong;
    }
    else {
      return latLongEx;
    }

  },

  // random generator in a given range of coordinates
  getRandomInRange: function(from, to, fixed) {
    return ((Math.random() * (to - from) + from).toFixed(fixed));
  }
};
