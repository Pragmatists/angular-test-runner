var app = require('./angular-test-runner.js');
var http = require('./server-runner.js');
var actions = require('./actions.js');

global.testRunner = {
  app: app,
  http : http,
  actions : actions
};
