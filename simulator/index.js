var locationGenerator = require('./locationGenerator');
var Appbase = require('appbase-js');
var config = require('../config.json');
var helper = require('../src/helper.js');
var appbaseRef = helper.appbaseRef;

var maxNumberOfNodes = 100;
var timeBetweenInsertions = 1000;

// enter demander's location into appbase table
  function addNode(index) {
    var latLongData = {
      "location-field": [parseFloat(locationGenerator.generateLatLong().long), parseFloat(locationGenerator.generateLatLong().lat)]
    };
    var requestObject = {
      type: config.appbase.type,
      id: index.toString(),
      body: latLongData,
    };
    // appbase index query
    appbaseRef.index(requestObject).on('data', function(response) {
      console.log(" Inserted ", index);
      // setTimeout(deleteNode(index), (index + maxNumberOfNodes) * timeBetweenInsertions);
      // setTimeout(addNode(index), (index + maxNumberOfNodes) * timeBetweenInsertions);
    }).on('error', function(error) {
      console.log(error);
    });
  }

  // delete demander's location from appbase table
  function deleteNode(index) {
    var requestObject = {
      type: config.appbase.type,
      id: index.toString()
    };
    appbaseRef.delete(requestObject).on('data', function(response) {
       console.log(" Deleted ", index);
    }).on('error', function(error) {
      console.log(error);
    });
  }

module.exports = {
  // Randomly generate the demander & Supplier
  dataGenerator: function() {
    for (var index = 1; index <= maxNumberOfNodes; index++) {
      setTimeout(function(){
        addNode(index)
      }
      , index * timeBetweenInsertions);
    }
  }
}
