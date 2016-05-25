var generator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function supply(){

  var timeout = 1000;
  var num_suppliers = 1;
  for(var i=11; i<num_suppliers+11; i++){
      index_into_appbase(i);
  }
    for(var j=11;j<num_suppliers+11; j++){
      delete_from_appbase(j);
    }

    function index_into_appbase(i){
      setTimeout(function() {
        // initializing data
        var data = {
          object_type: 'supplier',
          location: [parseFloat(generator.generateLatLong().long), parseFloat(generator.generateLatLong().lat)]
        };
        console.log(data)
        // indexing data
        var requestObject = {
          type: config.appbase.type,
          id: i.toString(),
          body: data
        };

        helper.appbaseRef.index(requestObject).on('data', function(response) {
          console.log('supply');
        }).on('error', function(error) {
          console.log(error);
        });
      }, i*timeout);
    }

    function delete_from_appbase(j){
      setTimeout(function() {
        var deleted= helper.appbaseRef.delete({
          type: config.appbase.type,
          id: j.toString()
        }).on('data', function(response) {
          console.log('supply deleted');
        }).on('error', function(error) {
          console.log(error);
        });
      },5*j*timeout);
    }

};
