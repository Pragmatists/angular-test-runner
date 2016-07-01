(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
module.exports = app;

function app(modules){

  return {
    run: _.partial(run, _, _, true),
    runHtml: _.partial(run, _, _, false)
  };
  
  function run(html, scope, isUrl){
    
    var element = $('<div ng-app="test-app"><div test-app/></div>');

    var modulesToLoad = modules;
    if(isUrl){
      modulesToLoad = modulesToLoad.concat(html);
    }
    
    angular.module('test-app', modulesToLoad)
      .directive('testApp', function(){
        var d = {
          restrict: 'A',
          link: function($scope) {
            _.merge($scope, scope);
          }
        };
        if(isUrl){
          d.templateUrl = html;
        } else {
          d.template = html;
        }
        return d;
    });

    var compile, scope;

    angular.bootstrap(element, [ 'test-app' ]);
    
    return {
      perform: perform,
      verify: perform
    };

    function perform(){
      for(var i=0; i<arguments.length; i++){
        var callback = arguments[i];
        callback(element);
      }
    }
  }

}

(function(){

  function type(text) {
    return withIn(function($el){
      $el.val(text);
      $el.change();
    });
  }
  function click($el) {
    $el.click();
  }

  function withIn(fn){
    fn.in = function(selector){
      return function($el){
        fn($el.find(selector));
      };
    };
    return fn;
  }

  function expectThat(selector){
    
    var perform = {};
  
    var jasmine = expect('');
    
    _(jasmine)
      .map(function(fn, name){
        return {fn: fn, name: name};
      })
      .filter(function(fn) {
        return fn.name.indexOf('to') === 0 && _.isFunction(fn.fn);
      })
      .forEach(function(fn){
        perform[fn.name] = function(){
          var args = _.toArray(arguments);
          return function($el){
            var x = $el.find(selector);
            x.toString = function(){
              return '[\n\t' + (x[0] ? x[0].outerHTML : '(no elements matched)') + '\n]';
            };
            var actual = expect(x);
            var matcher = actual[fn.name];
            var result = matcher.apply(actual, args);
          };
        };
      });
    
    return perform;
  }

  global.click = withIn(click);
  global.type = type;
  global.expectThat = expectThat;

  
})();


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
var app = require('./angular-test-runner.js');
var http = require('./server-runner.js');

global.test = {
  app: app,
  http: http
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./angular-test-runner.js":1,"./server-runner.js":3}],3:[function(require,module,exports){
module.exports = http;

function http(){

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.respondImmediately = true;
  
  var that = {
    post: method('POST'),
    get: method('GET'),
    delete: method('DELETE'),
    put: method('PUT'),
    stop: function(){
      server.restore();
    }
  };
  
  return that;
  
  function method(type){
    return function(url, handler){
      server.respondWith(type, url, function(req){
        handler(wrap(req));
      });
      return that;
    };
  }
}

function wrap(req){
  return {
    body: function(){
      return JSON.parse(req.requestBody);
    },
    sendJson: function(json){
      req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(json));
    }
  };
}

},{}]},{},[1,2,3]);
