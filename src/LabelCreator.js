module.exports = {

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
