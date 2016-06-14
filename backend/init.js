var config = require('../config.json');
var request = require('request');


var appname = config.appbase.appname;
var my_type = config.appbase.type;
request({
  url: 'http://scalr.api.appbase.io/'+appname+'/_mapping/'+my_type+'?ignore_conflicts=true', //URL to hit
  headers: {
    Authorization: 'Basic '+ new Buffer(config.appbase.username + ':' + config.appbase.password).toString('base64')
  },
  json: {
    "coordinates": {
      "properties": {
        "location": {
          "type": "geo_point"
        }
      }
    }
  },
  method: 'PUT' //Specify the method
}, function(error, response, body){
  if(error) {
    console.log(error);
  } else {
    console.log(response.statusCode, body);
  }
});
