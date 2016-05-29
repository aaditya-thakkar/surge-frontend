module.exports = {
  MAX_PRECISION: 4,
  // map bounds - san Francisco
  leftLong: -122.49333333333338,
  rightLong: -122.37333333333339,
  bottomLat: 37.706666666666685,
  topLat: 37.77333333333335,

  generateLatLong: function() {
    var randomLong = this.getRandomInRange(this.leftLong, this.rightLong, this.MAX_PRECISION);
    var randomLat = this.getRandomInRange(this.bottomLat, this.topLat, this.MAX_PRECISION);
    var latLong = {
      lat: randomLat,
      long: randomLong
    };
    return latLong;
  },

  getRandomInRange: function(from, to, fixed) {
    return ((Math.random() * (to - from) + from).toFixed(fixed));
  }
};
