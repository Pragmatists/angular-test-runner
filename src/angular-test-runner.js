var _ = require('lodash');

module.exports = app;

function app(modules, config) {

  const appClassname = 'ng-app';
  const defaultConfig = {attachToDocument: false};
  var appConfig = _.defaults(config, defaultConfig);
  var body = angular.element(window.document.body);
  var initialBody;

  return {
    run: _.partial(run, _, _, true),
    runHtml: _.partial(run, _, _, false),
    stop: stop
  };

  function stop() {
    if (appConfig.attachToDocument) {
      var children = body.children();
      console.log(initialBody);
      // for (var i = 0; i < children.length; i++) {
      //   console.log('contains: ', containsInInitialBody(children[i]))
      // }
      // body.replaceWith(initialBody)
      // window.document.body = initialBody;
      body.find('.' + appClassname).remove();

    }

    function containsInInitialBody(el) {
      var children = initialBody.children();
      console.log('\n\n---Szukam elementu----\n\n: ', el)
      for (var i = 0; i < children.length; i++) {
        console.log('initialElement: ', children[i])
        if (el === children[i]) {
          return true;
        }
      }
      return false;
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
        initialBody = _.cloneDeep(body);
        body.append(element);
      }
    }

    function destroy() {
      injector.get('$rootScope').$destroy();
    }

    function execute() {
      var action = actions.shift();

      if (!action) {
        var scope = angular.element(element).scope();
        if (scope) {
          scope.$apply();
        }
        return;
      }

      var result = action(appConfig.attachToDocument ? body : element);
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

