var _ = require('lodash');

module.exports = app;

function app(modules, config) {

  const appClassname = 'ng-app';
  const defaultConfig = {attachToDocument: false};
  var appConfig = _.defaults(config, defaultConfig);
  var body = angular.element(window.document.body);

  return {
    run: _.partial(run, _, _, true),
    runHtml: _.partial(run, _, _, false),
    stop: stop
  };

  function stop() {
    if (appConfig.attachToDocument) {
      var children = body.children();
      for (var i = 0; i < children.length; i++) {
        var element = angular.element(children[i])[0];
        if (element.tagName !== 'SCRIPT') {
          element.remove();
        }
      }
    }
  }

  function run(html, scope, isUrl) {

    var element = angular.element('<div class="' + appClassname + '" test-app></div>');

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

    var actions = [];
    var injector = angular.bootstrap(element, ['test-app']);

    attachApplicationToDocument();

    return {
      perform: perform,
      verify: perform,
      destroy: destroy,
      stop: stop
    };

    function attachApplicationToDocument() {
      if (appConfig.attachToDocument) {
        body.append(element);
      }
    }

    function destroy() {
      injector.get('$rootScope').$destroy();
    }

    function execute() {
      var action = takeNextAction();
      if (lastAction()) {
        doScopeApply();
        return;
      }
      var result = executeAction();
      if (isPromise(result)) {
        result.then(execute);
      } else {
        execute();
      }

      function doScopeApply() {
        var scope = angular.element(element).scope();
        if (scope) {
          scope.$apply();
        }
      }

      function executeAction() {
        return action(appConfig.attachToDocument ? body : element);
      }

      function lastAction() {
        return !action;
      }

      function takeNextAction() {
        return actions.shift();
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
        .union([emptyAction])
        .flattenDeep()
        .each(push);

      if (wasEmpty) {
        execute();
      }

      function emptyAction() {}
    }
  }

}

