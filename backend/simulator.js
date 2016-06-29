var locationGenerator = require('./locationGenerator');
var Appbase = require('appbase-js');
var config = require('../config.json');
var helper = require('../src/helper.js');
var appbaseRef = helper.appbaseRef;

var maxNumberOfNodes = 10;
var timeBetweenInsertions = 500;

// enter demander's location into appbase table
  function addNode(index, type) {
    var latLongData = {
      object_type: type,
      location: [parseFloat(locationGenerator.generateLatLong().long), parseFloat(locationGenerator.generateLatLong().lat)]
    };
    var requestObject = {
      type: config.appbase.type,
      id: index.toString(),
      body: latLongData,
    };
    // appbase index query
    appbaseRef.index(requestObject).on('data', function(response) {
      console.log(" Inserted ", index);
      setTimeout(deleteNode(index), (index + maxNumberOfNodes) * timeBetweenInsertions);
      setTimeout(generateNode(index), (index + maxNumberOfNodes) * timeBetweenInsertions);
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

  function generateNode(index) {
    var weight = Math.random();
    if (weight > 0.5){
      addNode(index, 'demander');
    }
    else
      addNode(index, 'supplier');
  }

module.exports = {
  // Randomly generate the demander & Supplier
  dataGenerator: function() {
    for (var index = 0; index <= maxNumberOfNodes; index++) {
      setTimeout(generateNode(index), index * timeBetweenInsertions);
    }
  }
}
