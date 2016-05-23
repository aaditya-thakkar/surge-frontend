module.exports = {
  MAX_PREC: 4,
  leftLong: -122.49333333333338,
  rightLong: -122.37333333333339,
  bottomLat: 37.706666666666685,
  topLat: 37.77333333333335,

  generateLatLong: function() {
    var rnLong = this.getRandomInRange(this.leftLong, this.rightLong, this.MAX_PREC);
    var rnLat = this.getRandomInRange(this.bottomLat, this.topLat, this.MAX_PREC);
    var latLong = {
      lat: rnLat,
      long: rnLong
    };
    return latLong;
  },

  getRandomInRange: function(from, to, fixed) {
    return ((Math.random() * (to - from) + from).toFixed(fixed));
  }
};
