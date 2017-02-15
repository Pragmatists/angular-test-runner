describe('server', function () {

  angular.module('async-server-app', [])
    .directive('greeting', function () {
      return {
        template: ['<div class="greeting">{{ message }}</div><a ng-click="vm.sendGreetings()">Send</a>'].join(),
        scope: {
          name: '='
        },
        controllerAs: 'vm',
        controller: function ($http, $scope) {
          $scope.message = 'initial';
          $http.get('/greeting')
            .then(function (response) {
              var json = response.data;
              $scope.message = response.data.message;
            })
            .catch(function (response) {
              $scope.message = response.status;
            });

          this.sendGreetings = function() {
            $http.post('/greeting?to=Jane%20Doe&when=now', {who: 'John'});
          };
        }
      };
    });

  var server, app;
  var expectElement = testRunner.actions.expectElement;
  var click = testRunner.actions.click;

  beforeEach(function () {
    app = testRunner.app(['async-server-app']);
  });


  describe('when configured as async', function () {

    beforeEach(function () {
      server = testRunner.http({respondImmediately: false});
    });

    afterEach(function () {
      server.stop();
    });

    beforeEach(function () {
      server.get('/greeting', function (req) {
        req.sendJson({
          message: 'Hello from server!'
        });
      });
    });

    it('does not resolve request unless respond()', function () {

      // given:
      var html = app.runHtml('<greeting/>');

      // then:
      html.verify(
        expectElement('.greeting').toHaveText('initial')
      );

    });

    it('resolves request after respond()', function () {

      // given:
      var html = app.runHtml('<greeting/>');

      // when:
      html.perform(
        server.respond
      );

      // then:
      html.verify(
        expectElement('.greeting').toHaveText('Hello from server!')
      );

    });

  });

  it('responds with specific code', function () {

    // given:
    server = testRunner.http();
    server.get('/greeting', function (res) {
      res.sendStatus(418);
    });

    // when:
    var html = app.runHtml('<greeting/>');

    // then:
    html.verify(
      expectElement('.greeting').toHaveText('418')
    );

  });

  it('provides request body', function () {
    var requestedGreeting;
    // given:
    server = testRunner.http();
    server.post(/\/greeting/, function (res) {
      requestedGreeting = res.body();
    });

    // when:
    var html = app.runHtml('<greeting/>');
    html.perform(
      click.in('a')
    );

    // then:
    expect(requestedGreeting).toEqual({who: 'John'});
  });

  it('provides request params', function () {
    var requestedParams;
    // given:
    server = testRunner.http();
    server.post(/\/greeting/, function (res) {
      requestedParams = res.query();
    });

    // when:
    var html = app.runHtml('<greeting/>');
    html.perform(
      click.in('a')
    );

    // then:
    expect(requestedParams).toEqual({to: 'Jane Doe', when:'now'});
  });

});

