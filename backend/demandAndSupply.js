var dataGenerator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function demandAndSupplyGenerator(){
  // timeout for a new demand after one is generated
  var timeout = 1000;
  var maxNumberOfNodes = 200;

  for (var index = 0; index < maxNumberOfNodes; index++){
    var weight = Math.random();
    if(weight>0.5){
      enterIntoAppbase(index, 'demander');
    }
    else {
      enterIntoAppbase(index, 'supplier');
    }
    if(index > 50){
      deleteFromAppbase(index-50);
    }
  }

  // enter demander's location into appbase table
  function enterIntoAppbase(index, type){
    setTimeout(function() {
      var latLongData = {
        object_type: type,
        location: [parseFloat(dataGenerator.generateLatLong().long), parseFloat(dataGenerator.generateLatLong().lat)]
      };

      var requestObject = {
        type: config.appbase.type,
        id: index.toString(),
        body: latLongData,
      };
      // appbase index query
      var addedDemand = helper.appbaseRef.index(requestObject).on('data', function(response) {
        console.log(response);
      }).on('error', function(error) {
        console.log(error);
      });

    }, index*timeout);
  }

  function deleteFromAppbase(index) {
    setTimeout(function() {
    var requestObject = {
      type: config.appbase.type,
      id: index.toString()
    };

    helper.appbaseRef.delete(requestObject).on('data', function(response) {
      console.log("deleted");
      console.log(response);
    }).on('error', function(error) {
      console.log(error);
    });
  }, index*timeout);
  }
};
