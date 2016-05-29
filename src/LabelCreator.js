module.exports = {

  // create marker on the center of the grid
  createLabel: function(map, location, timeout) {
    setTimeout(function() {
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "hello"
      });
    }, timeout);
  },

}
