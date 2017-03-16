describe('sample test', function () {

  angular.module('greeting-app', [])
    .directive('greeting', function () {
      return {
        template: ['<form ng-submit="vm.sayHello()">',
          '<input class="name" type=text ng-model="name">',
          '<button id="hello" type="submit">Say Hello</button>',
          '<button id="goodbye" ng-click="vm.sayGoodbye()">Say Goodbye</button>',
          '<button id="publisher" ng-click="vm.publish()">Publish</button>',
          '<span class="greeting">{{message}}</span>',
          '<span id="tickle-me" ng-mouseover="tickled = true" ng-mouseleave="tickled = false">{{tickled}}</span>',
          '</form>'].join(),
        scope: {
          name: '='
        },
        controllerAs: 'vm',
        controller: function ($http, $scope, $timeout, $rootScope) {
          this.sayHello = function () {
            $http.post('/greeting', {name: $scope.name})
              .then(function (response) {
                var json = response.data;
                $scope.message = json.greeting;
              });
          };
          this.sayGoodbye = function () {
            $timeout(function () {
              $scope.message = 'Goodbye ' + $scope.name + '!';
            }, 100);
          };
          this.publish = function() {
            $rootScope.$broadcast('greeting', $scope.name);
          };
        },
        link: function (scope, element) {
          element.find('input').on('keydown', function (ev) {
            if (ev.which === 13) {
              scope.vm.sayHello();
            }
          });
        }
      };
    });

  var server, app;
  var type = testRunner.actions.type;
  var click = testRunner.actions.click;
  var expectElement = testRunner.actions.expectElement;
  var keydown = testRunner.actions.keydown;
  var wait = testRunner.actions.wait;
  var mouseover = testRunner.actions.mouseover;
  var mouseleave = testRunner.actions.mouseleave;
  var listenTo = testRunner.actions.listenTo;

  beforeEach(function () {

    app = testRunner.app(['greeting-app']);
    server = testRunner.http();
  });

  afterEach(function () {
    server.stop();
  });

  beforeEach(function () {
    server.post('/greeting', function (req) {

      var body = req.body();
      req.sendJson({
        greeting: 'Hello ' + body.name + '!'
      });
    });
  });

  it('populates name with default value', function () {

    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // then:
    html.verify(
      expectElement('input.name').toHaveValue('John')
    );

  });

  it('greets person', function () {

    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // when:
    html.perform(
      type('Jane').in('input.name'),
      click.in('button#hello')
    );

    // then:
    html.verify(
      expectElement('.greeting').toContainText('Hello Jane!')
    );

  });

  it('greets person on enter', function () {
    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // when:
    html.perform(
      type('Jane').in('input.name'),
      keydown(13).in('input.name')
    );

    // then:
    html.verify(
      expectElement('.greeting').toContainText('Hello Jane!')
    );

  });

  it('says goodbye async', function (done) {

    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // when:
    html.perform(
      click.in('button#goodbye')
    );

    // then:
    html.verify(
      wait(200),
      expectElement('.greeting').toContainText('Goodbye John!'),
      done
    );

  });

  it('says goodbye async (fluent version)', function (done) {

    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // when:
    html.perform(
      click.in('button#goodbye'),
      click.in('button#hello').after(200)
    );

    // then:
    html.verify(
      expectElement('.greeting').toContainText('Hello John!'),
      done
    );

  });

  it('triggers mouseover and mouseleave', function () {

    var html = app.runHtml('<greeting/>', {});

    html.perform(mouseover.in('#tickle-me'));
    html.verify(expectElement('#tickle-me').toContainText('true'));

    html.perform(mouseleave.in('#tickle-me'));
    html.verify(expectElement('#tickle-me').toContainText('false'));

  });

  it('listens for events', function () {
    var greeted;
    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // when:
    html.perform(
      listenTo('greeting', function (data) {
        greeted = data;
      }),
      click.in('#publisher')
    );

    // then:
    expect(greeted).toEqual('John');
  });


});
