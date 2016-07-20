var Appbase = require('../node_modules/appbase-js');
var config = require('../config.json');

module.exports = {
  appbaseRef: new Appbase({
    url: 'https://scalr.api.appbase.io',
    appname: config.appbase.appname,
    username: config.appbase.username,
    password: config.appbase.password
  }),

  // returns geo bounding box query object
  buildRequestObject: function(top_left, bottom_right) {
    return ({
      type: config.appbase.type,
      body: {
        "query": {
          "bool" : {
            "must" : {
              "match_all" : {}
            },
            "filter" : {
              "geo_bounding_box" : {
                "location-field" : {
                  "top_left" : top_left,
                  "bottom_right" : bottom_right
                }
              }
            }
          }
        }
      }
    });
  },
  //returns object of all the historical markers
  buildRequestMarkerObject: function(){
    return ({
      type: config.appbase.type,
      body: {
        "query": {
          "match_all": {}
        }
      }
    });
  }
};
