describe('app', function(){
  
//  beforeEach(module('scotchTodo'));
  var server, app;

  beforeEach(function(){
    
    app = test.app(['scotchTodo']);
    server = http();
  });

  afterEach(function () {
    server.stop();
  });
  
  it('fetches items from server', function(){
    
    server.get('/api/todos', function(req){
      req.sendJson([{_id: 12, text: 'Hello' }]);
    });
    
    var html = app.run('public/app.html');
    
    html.verify(
      expectThat('#todo-list label').toContainText('Hello')
    );
    
  });

  it('creates new item', function(done){
    
    var items = [];
    
    server
      .get('/api/todos', function(req){
        req.sendJson(items);
      })
      .post('/api/todos', function(req){
        items.push(req.body());
        req.sendJson(items);
      });
    
    var html = app.run('public/app.html');
    
    html.perform(
      type('New Item').in('input[type=text]'),
      click.in('button[type=submit]')
    );
    
    html.verify(
      expectThat('#todo-list label').toContainText('New Item')
    );
    expect(items).toEqual([ { text: 'New Item' } ]);

    html.done(done);
  });

  it('renders item', function(){
    
    var item = { done: true, text: 'Buy the milk' };
    
    var html = app.runHtml('<div todo-item item=item></div>', {item: item});
    
    html.verify(
      expectThat('div.todo-item input[type=checkbox]').toBeChecked(),
      expectThat('div.todo-item').toHaveClass('done1'),
      expectThat('div.todo-item').toContainText('Buy the milk')
    );

  });

  function debug($el){
    console.log('debug', $el);
  }
  
});