var generator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function supply(){

  var timeout = 1000;
  var num_suppliers = 10;
  for(var i=0; i<num_suppliers; i++){
    setTimeout(function() {
      // initializing data
      var data = {
        object_type: 'supplier',
        latitude: generator.generateLatLong().lat,
        longitude: generator.generateLatLong().long
      };
      // indexing data
      helper.appbaseRef.index({
        type: config.appbase.type,
        body: data
      }).on('data', function(response) {
        console.log('supply');
      }).on('error', function(error) {
        console.log(error);
      });
    }, i*timeout);
  }
};
