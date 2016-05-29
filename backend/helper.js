var Appbase = require('../node_modules/appbase-js');
var config = require('../config.json');
module.exports = {

  appbaseRef : new Appbase({
    url: 'https://scalr.api.appbase.io',
    appname: config.appbase.appname,
    username: config.appbase.username,
    password: config.appbase.password
  })
};
