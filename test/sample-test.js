describe('sample test', function(){

  angular.module('greeting-app', [])
    .directive('greeting', function(){
      return {
        template: ['<form ng-submit="vm.sayHello()">',
                    '<input class="name" type=text ng-model="name">',
                    '<button id="hello" type="submit">Say Hello</button>',
                    '<button id="goodbye" ng-click="vm.sayGoodbye()">Say Goodbye</button>',
                    '<span class="greeting">{{message}}</span>',
                   '</form>'].join(),
        scope: {
          name: '='
        },
        controllerAs: 'vm',
        controller: function($http, $scope, $timeout){
          this.sayHello = function(){

            $http.post('/greeting', { name: $scope.name })
              .then(function(response){
                var json = response.data;
                $scope.message = json.greeting;
              });
          },
          this.sayGoodbye = function(){
            $timeout(function(){
                $scope.message = 'Goodbye ' + $scope.name + '!';    
            }, 100);
          }
        },
        link: function(scope, element){
          element.find('input').on('keydown', function(ev){
            if(ev.which === 13){
              scope.vm.sayHello();
            }
          });
        }
      };
    });

  var server, app;
  var type = testRunner.actions.type;
  var click = testRunner.actions.click;
  var expect = testRunner.actions.expectElement;
  var keydown = testRunner.actions.keydown;
  var wait = testRunner.actions.wait;

  beforeEach(function(){

    app = testRunner.app(['greeting-app']);
    server = testRunner.http();
  });

  afterEach(function () {
    server.stop();
  });

  beforeEach(function(){
    server.post('/greeting', function(req){

      var body = req.body();
      req.sendJson({
        greeting: 'Hello ' + body.name + '!'
      });
    });
  });
  
  it('populates name with default value', function(){
    
    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});
    
    // then:
    html.verify(
        expect('input.name').toHaveValue('John')
    );
    
  });

  it('greets person', function(){
    
    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});
      
    // when:
    html.perform(
        type('Jane').in('input.name'),
        click.in('button#hello')
    );
    
    // then:
    html.verify(
        expect('.greeting').toContainText('Hello Jane!')
    );
    
  });

  it('greets person on enter', function(){
    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // when:
    html.perform(
        type('Jane').in('input.name'),
        keydown(13).in('input.name')
    );

    // then:
    html.verify(
        expect('.greeting').toContainText('Hello Jane!')
    );

  });

  it('says goodbye async', function(done){
      
    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // when:
    html.perform(
        click.in('button#goodbye')
    );

    // then:
    html.verify(
        wait(200),
        expect('.greeting').toContainText('Goodbye John!'),
        done
    );

  });

  it('says goodbye async (fluent version)', function(done){
      
    // given:
    var html = app.runHtml('<greeting name="defaultName"/>', {defaultName: 'John'});

    // when:
    html.perform(
        click.in('button#goodbye'),
        click.in('button#hello').after(200)
    );

    // then:
    html.verify(
        expect('.greeting').toContainText('Hello John!'),
        done
    );

  });


});
