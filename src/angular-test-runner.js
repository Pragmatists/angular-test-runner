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

