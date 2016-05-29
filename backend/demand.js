var dataGenerator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function DemandGenerator(){
  var timeout = 900;
  var numberOfDemanders = 200;
  for(var indexI = 0; indexI < numberOfDemanders; indexI++){
    enterIntoAppbase(indexI);
  }
  for(var indexJ = 0; indexJ < numberOfDemanders; indexJ++){
    deleteFromAppbase(indexJ);
  }
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

      var addedDemand = helper.appbaseRef.index(requestObject).on('data', function(response) {
        console.log(response);
      }).on('error', function(error) {
        console.log(error);
      });
    }, indexI*timeout);
  }
  function deleteFromAppbase (indexJ) {
    setTimeout(function() {
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
