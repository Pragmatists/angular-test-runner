var _ = require('lodash');

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
          restrict: 'A'
        };
        if(isUrl){
          d.templateUrl = html;
        } else {
          d.template = html;
        }
        return d;
      })
      .run(function($rootScope){
        _.assign($rootScope, scope);
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
      var scope = angular.element(element).scope();
      scope.$apply();  
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
  function keypress(key) {
    return withIn(function($el){
      $el.trigger(jQuery.Event('keypress', { keycode: key, which: key }));
    });
  }
  function keydown(key) {
    return withIn(function($el){
      $el.trigger(jQuery.Event('keydown', { keycode: key, which: key }));
    });
  }
  function keyup(key) {
    return withIn(function($el){
      $el.trigger(jQuery.Event('keyup', { keycode: key, which: key }));
    });
  }
  function apply($el) {
      var scope = angular.element($el).scope();
      scope.$apply();
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
    
    var perform = {
      not: {}
    };
  
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
        perform.not[fn.name] = function(){
          var args = _.toArray(arguments);
          return function($el){
            var x = $el.find(selector);
            x.toString = function(){
              return '[\n\t' + (x[0] ? x[0].outerHTML : '(no elements matched)') + '\n]';
            };
            var actual = expect(x).not;
            var matcher = actual[fn.name];
            var result = matcher.apply(actual, args);
          };
        };
      });
    
    return perform;
  }

  global.click = withIn(click);
  global.type = type;
  global.keypress = keypress;
  global.keyup = keyup;
  global.keydown = keydown;
  global.apply = apply;
  global.expectThat = expectThat;

  
})();

