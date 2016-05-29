var dataGenerator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function DemandGenerator(){
  // timeout for a new demand after one is generated
  var timeout = 900;
  var numberOfDemanders = 200;
  for(var indexI = 0; indexI < numberOfDemanders; indexI++){
    enterIntoAppbase(indexI);
  }
  for(var indexJ = 0; indexJ < numberOfDemanders; indexJ++){
    deleteFromAppbase(indexJ);
  }
  // enter demander's location into appbase table
  function enterIntoAppbase(indexI){
    setTimeout(function() {
      var latLongData = {
        object_type: 'demander',
        location: [parseFloat(dataGenerator.generateLatLong().long), parseFloat(dataGenerator.generateLatLong().lat)]
      };

      var requestObject = {
        type: config.appbase.type,
        id: indexI.toString(),
        body: latLongData
      };
      // appbase index query
      var addedDemand = helper.appbaseRef.index(requestObject).on('data', function(response) {
        console.log(response);
      }).on('error', function(error) {
        console.log(error);
      });
    }, indexI*timeout);
  }
  // delete demander's location from appbase after some time from it got indexed
  function deleteFromAppbase (indexJ) {
    setTimeout(function() {
      // appbase delete query
      var deletedDemand= helper.appbaseRef.delete({
        type: config.appbase.type,
        id: indexJ.toString()
      }).on('data', function(response) {
        console.log(response);
      }).on('error', function(error) {
        console.log(error);
      });
    },5*indexJ*timeout);
  }
};
