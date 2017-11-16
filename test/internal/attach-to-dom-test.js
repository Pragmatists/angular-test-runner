describe('attach to dom test', function () {

  angular.module('attach-to-dom-app', [])
    .directive('greeting', function () {
      return {
        template: '<div id="extendInfoOnBody" ng-click="vm.extendInfoOnBody()"></div>',
        scope: {
          name: '='
        },
        controllerAs: 'vm',
        controller: function () {
          this.extendInfoOnBody = function () {
            var body = angular.element(window.document.body);
            body.append('<div class="message">Good morning!</div>')
          };
        }
      };
    });

  var app;
  var click = testRunner.actions.click;
  var expectElement = testRunner.actions.expectElement;

  beforeEach(function () {
    app = testRunner.app(['attach-to-dom-app'], {attachToDocument: true});
  });

  afterEach(function () {
    app.stop();
  });

  it('message when adding element to dom directly in body 1', function () {
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    html.perform(
      click.in('#extendInfoOnBody')
    );

    html.verify(
      expectElement('.message').toHaveLength(1)
    );

  });

  it('message when adding element to dom directly in body 2', function () {
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    html.perform(
      click.in('#extendInfoOnBody')
    );

    html.verify(
      expectElement('.message').toHaveLength(1)
    );

  });


});
