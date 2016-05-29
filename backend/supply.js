var dataGenerator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function DemandGenerator(){
  // timeout for a new supply after one is generated
  var timeout = 1000;
  var numberOfSuppliers = 100;
  for(var indexI = 0; indexI < numberOfSuppliers; indexI++){
    enterIntoAppbase(indexI);
  }
  for(var indexJ = 0; indexJ < numberOfSuppliers; indexJ++){
    deleteFromAppbase(indexJ);
  }
  // enter supplier's location into appbase table
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
      var addedSupply = helper.appbaseRef.index(requestObject).on('data', function(response) {
        console.log(response);
      }).on('error', function(error) {
        console.log(error);
      });
    }, indexI*timeout);
  }
  // delete supplier's location from appbase after some time from it got indexed
  function deleteFromAppbase (indexJ) {
    setTimeout(function() {
      // appbase delete query
      var deletedSupply = helper.appbaseRef.delete({
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
