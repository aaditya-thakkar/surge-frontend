// latitude longitude value precision
var MAX_PRECISION = 4;

// map bounds - san Francisco (lower square region)
var leftLong = -122.50333333333338;
var rightLong = -122.38333333333339;
var bottomLat = 37.716666666666685;
var topLat = 37.77333333333335;

// map bounds - san Francisco (upper square region)
var leftLongUp = -122.48333333333338;
var rightLongUp = -122.46833333333339;
var bottomLatUp = 37.77333333333335;
var topLatUp = 37.80333333333335;

module.exports = {

  // random latitude longitude generator
  generateLatLong: function() {

    var weight = Math.random();
    if (weight < 0.8) {
      var randomLong = this.getRandomInRange(leftLong, rightLong, MAX_PRECISION);
      var randomLat = this.getRandomInRange(bottomLat, topLat, MAX_PRECISION);
    }
    else {
      var randomLong = this.getRandomInRange(leftLongUp, rightLongUp, MAX_PRECISION);
      var randomLat = this.getRandomInRange(bottomLatUp, topLatUp, MAX_PRECISION);
    }

    var latLong = {
      lat: randomLat,
      long: randomLong
    };
    return latLong;
  },

  // random generator in a given range of coordinates
  getRandomInRange: function(from, to, fixed) {
    return ((Math.random() * (to - from) + from).toFixed(fixed));
  }
};
