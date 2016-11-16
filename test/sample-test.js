describe('sample test', function(){

  angular.module('greeting-app', [])
    .directive('greeting', function(){
      return {
        template: ['<div>',
                    '<input class="name" type=text ng-model="name">',
                    '<button ng-click="vm.sayHello()">Say Hello</button>',
                    '<span class="greeting">{{message}}',
                   '</div>'].join(),
        scope: {
          name: '='
        },
        controllerAs: 'vm',
        controller: function($http, $scope){
          this.sayHello = function(){
            $http.post('/greeting', { name: $scope.name })
              .success(function(json){
                $scope.message = json.greeting;
              });
          }
        }
      };
    });

  var server, app;
  var type = testRunner.actions.type;
  var click = testRunner.actions.click;
  var expect = testRunner.actions.expectElement;

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
        click.in('button')
    );
    
    // then:
    html.verify(
        expect('.greeting').toContainText('Hello Jane!')
    );
    
  });

});
