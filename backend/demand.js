var generator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function demand(){


  var timeout = 900;
  var num_demanders = 200;
  for(var i=0; i<num_demanders; i++){
    console.log(i);
    index_into_appbase(i);
  }
    for(var j=0;j<num_demanders; j++){
      delete_from_appbase(j);
    }
    function index_into_appbase(i){
      setTimeout(function() {
        // initializing data
        var data = {
          object_type: 'demander',
          location: [parseFloat(generator.generateLatLong().long), parseFloat(generator.generateLatLong().lat)]
        };

        // indexing data

        var requestObject = {
          type: config.appbase.type,
          id: i.toString(),
          body: data
        };
        var added= helper.appbaseRef.index(requestObject).on('data', function(response) {
          console.log(response);
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
          console.log('demand deleted');
        }).on('error', function(error) {
          console.log(error);
        });
      },5*j*timeout);
    }
};
