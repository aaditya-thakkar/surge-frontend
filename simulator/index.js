var locationGenerator = require('./locationGenerator');
var Appbase = require('appbase-js');
var config = require('../config.json');
var helper = require('../src/helper.js');
var appbaseRef = helper.appbaseRef;

var maxNumberOfNodes = 30;
var timeBetweenInsertions = 1000;


function generateData(index) {
  setTimeout(function(){
    addNode(index)
  }, index * timeBetweenInsertions);
}

// enter demander's location into appbase table
function addNode(index) {
  var latLongData = {
    "location-field": [parseFloat(locationGenerator.generateLatLong().long), parseFloat(locationGenerator.generateLatLong().lat)]
  };
  var requestObject = {
    type: config.appbase.type,
    id: makeId(),
    body: latLongData,
  };
  // appbase index query
  appbaseRef.index(requestObject).on('data', function(response) {
    console.log(" Inserted ", response._id);
     setTimeout(deleteNode(response._id), (index + maxNumberOfNodes) * timeBetweenInsertions);
     setTimeout(addNode(index), (index + 2*maxNumberOfNodes) * timeBetweenInsertions);
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

// to generate random 7 letter string for id
function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

module.exports = {
  // Randomly generate the demander & Supplier
  dataGenerator: function() {
    for (var index = 1; index <= maxNumberOfNodes; index++) {
      generateData(index);
    }
  }
}
