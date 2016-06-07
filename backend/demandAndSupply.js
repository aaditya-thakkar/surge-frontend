var async = require('async');
var dataGenerator = require('./datagenerator');
var helper = require('./helper');
var config = require('../config.json');

module.exports = function demandAndSupplyGenerator(){
  // timeout for a new demand after one is generated
  var timeout = 1000;
  var maxNumberOfDemanders = 300;
  var maxNumberOfSuppliers = 300;

  async.parallel([
    function(callback) {
      for(var indexI = 0; indexI < maxNumberOfDemanders; indexI++) {
        enterIntoAppbase(indexI, 'demander');
      }
      callback();
    },
    function(callback){
      for(var indexJ = 0; indexJ < maxNumberOfSuppliers; indexJ++) {
        enterIntoAppbase(indexJ, 'supplier');
      }
      callback();
    }
  ], function(){
      console.log("tasks completed");
  });
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
};
