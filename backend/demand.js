var generator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function demand(){


  var timeout = 900;
  var num_demanders = 10;
  for(var i=0; i<num_demanders; i++){
    setTimeout(function() {
      // initializing data
      var data = {
        object_type: 'demander',
        latitude: generator.generateLatLong().lat,
        longitude: generator.generateLatLong().long
      };
      // indexing data
      helper.appbaseRef.index({
        type: config.appbase.type,
        body: data
      }).on('data', function(response) {
        console.log('demand');
      }).on('error', function(error) {
        console.log(error);
      });
    }, i*timeout);
  }
};
