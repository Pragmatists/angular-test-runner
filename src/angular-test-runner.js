var _ = require('lodash');

module.exports = app;

function app(modules) {

  return {
    run: _.partial(run, _, _, true),
    runHtml: _.partial(run, _, _, false)
  };

  function run(html, scope, isUrl) {

    var element = angular.element('<div ng-app="test-app"><div test-app/></div>');

    var modulesToLoad = modules;
    if (isUrl) {
      modulesToLoad = modulesToLoad.concat(html);
    }

    angular.module('test-app', modulesToLoad)
      .directive('testApp', function () {
        var d = {
          restrict: 'A'
        };
        if (isUrl) {
          d.templateUrl = html;
        } else {
          d.template = html;
        }
        return d;
      })
      .run(function ($rootScope) {
        _.assign($rootScope, scope);
      });

    var compile, scope, actions = [];

    angular.bootstrap(element, ['test-app']);

    return {
      perform: perform,
      verify: perform
    };

    function execute() {
      var action = actions.shift();

      if (!action) {
        var scope = angular.element(element).scope();
        scope.$apply();
        return;
      }

      var result = action(element);
      if (isPromise(result)) {
        result.then(execute);
      } else {
        execute();
      }
    }

    function isPromise(promise) {
      return promise && typeof promise.then == 'function';
    }

    function push(action) {
      actions.push(action);
    }

    function perform() {

      var wasEmpty = !actions.length;

      _([arguments])
        .flattenDeep()
        .each(push);

      if (wasEmpty) {
        execute();
      }
    }
  }

}

