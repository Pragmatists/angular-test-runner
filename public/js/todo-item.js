angular.module('todoItemDirective', ['public/js/todo-item.html'])
  .directive('todoItem', function(){
    return {
      scope: {
        item: '='
      },
      templateUrl: 'public/js/todo-item.html'
    }
  });