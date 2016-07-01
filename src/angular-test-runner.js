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

