# angular-test-runner
**angular-test-runner** is micro testing library that allows you to practice TDD while writing Angular application.

## Installation

### Node.js

`angular-test-runner` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install angular-test-runner --save-dev


## Example

We have Angular component:

```html
<greeting>
  <input class="name" type=text ng-model="name">
  <button id="hello" ng-click="vm.sayHello()">Say Hello</button>
  <span class="greeting">{{message}}</span>
</greeting>
```
where 
* sayHello method send POST http request with `Hello ${name}!` body
* span element shows response body from that request. 

``` javascript
  var server, app;
  var type = testRunner.actions.type;
  var click = testRunner.actions.click;
  
  beforeEach(function () {

      app = testRunner.app(['greeting-app']);
      server = testRunner.http();
  });

  afterEach(function () {
      server.stop();
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
      server.post('/greeting', function(req) => {
        var body = req.body();
        req.sendJson({
          greeting: 'Hello ' + body.name + '!'
        });
      });

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

```

See more [examples](https://github.com/Pragmatists/angular-test-runner/blob/master/test/sample-test.js)
