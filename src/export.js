var app = require('./angular-test-runner.js');
var http = require('./server-runner.js');

global.test = {
  app: app,
  http: http
};