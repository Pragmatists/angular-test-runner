var _ = require('lodash');

module.exports = http;

function http(config) {

  var defaultConfig = {
    autoRespond: true,
    respondImmediately: true
  };

  var server = sinon.fakeServer.create(_.defaults(config, defaultConfig));

  var that = {
    post: method('POST'),
    get: method('GET'),
    delete: method('DELETE'),
    put: method('PUT'),
    respond: function () {
      server.respond();
    },
    stop: function () {
      server.restore();
    }
  };

  return that;

  function method(type) {
    return function (url, handler) {
      server.respondWith(type, url, function (req) {
        handler(wrap(req));
      });
      return that;
    };
  }
}

function wrap(req) {
  return {
    body: function () {
      return JSON.parse(req.requestBody);
    },
    query: function () {
      var query = req.url.split('#')[0].split('?')[1];
      return _(query)
        .split('&')
        .map(_.partial(_.split, _, '=', 2))
        .fromPairs()
        .mapValues(decodeURIComponent)
        .value();
    },
    sendJson: function (json) {
      req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(json));
    },
    sendStatus: function (status, json) {
      req.respond(status, {'Content-Type': 'application/json'}, JSON.stringify(json || {}));
    }
  };
}
