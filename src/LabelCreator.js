module.exports = {
  createLabel: function(map, position, timeout, label) {
    var infowindow = new google.maps.InfoWindow({
      content: "Hello",
      maxWidth: 50
    });
    window.setTimeout(function() {
      var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: "hello"
        //icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + "1.5x" + '|FF0000|000000'
        //  animation: google.maps.Animation.BOUNCE
      });
      //infowindow.open(map, marker);
    }, timeout);
  },

}
