angular.module('scotchTodo', ['todoController', 'todoService', 'todoItemDirective']);
angular.module('scotchTodo')
  .directive('helloTo', function(){
    return {
      scope: {
        who: '='
      },
      template: '<div class="hello">Hello {{who}}</div>',
      controller: function($scope, $http){
        
        $http.post('/hello', { who:  1})
          .then(function(result){
            console.log('resp', result);
            var data = result.data;
          
            $scope.greetings = data.greetings;
          });
        
      }
    };
  });