# angular-test-runner
[![npm version](https://badge.fury.io/js/angular-test-runner.svg)](https://badge.fury.io/js/angular-test-runner)

Micro testing library that allows you to practice TDD in Angular applications.

## Installation
To install it, type:

    $ npm install angular-test-runner --save-dev

## Replacement for ngMock
**angular-test-runner** was created as a replacement of "official" Angular testing library: **ngMock**. It was designed to address following shortcommings of **ngMock**:
1. different style of testing for each component type (controller, directive, service, etc.),
2. long and boilerplate-rich setup of test,
3. difficult testing of html templates and no support for interacting with DOM elements,
4. focusing on testing objects in isolation instead of testing coherent set of behaviours (white-box testing)
5. [obscure tests with irrelevant informations](http://xunitpatterns.com/Obscure%20Test.html#Irrelevant%20Information)  exposing implentation details, especially in context of HTTP communication (need of `$http.flush()`) and DOM interaction (need of `$scope.$digest()`)

Therefore **angular-test-runner** tries to address those issues by:
1. providing uniform abstraction and consistent API for testing Angular parts, regardless of their type (contoller, directive, component, filter, etc.),
2. providing higher confidence by excercising html templates and interacting with real DOM elements (black-box testing), 
3. promoting fine grained, self-encapsulated modules by enforcing testing at a module level instead of testing controllers, services, directives in isolation,
4. avioding mocks in favour of fakes for HTTP communication, use synchronous HTTP stubbing by default (no need for `$http.flush()`) and asynchronous on demand,
5. introducing compact, readable and declarative programming interface by introducing fluent interface.


## Example

Following example presents tests for simple counter component.

``` javascript
var test = require('angular-test-runner');
var { click, expectElement } = test.actions;

describe('counter component', () => {

  var app, server, html;

  beforeEach(() => {
    app = test.app(['counterApp']);
    server = test.http();
  });

  beforeEach(() => {
    html = app.runHtml('<counter value="start"></counter>', {start: 0});  
  });
  
  it('should render counter value', () => {

    html.verify(
      expectElement('#counter').toHaveText('0')
    );
    
  });

  it('should increment counter value by 1', () => {

    html.perform(
      click.in('button#increment')
    );

    html.verify(
      expectElement('#counter').toHaveText('1')
    );
  });

  it('should increment counter value by 1', () => {

    var jsonSentToServer;

    server.post('/counter/increment', (req) => {
      jsonSentToServer = req.body();
      req.sendStatus(200);
    });

    html.perform(
      click.in('button#increment')
    );

    html.verify(
      () => expect(jsonSentToServer).toEqual({ counter: 1 })
    );
  });
  
});
```

### Comparision to ngMock

Below you can compare **angular-test-runner** style of testing to traditional **ngMock** way.
Following example was taken from [Official Angular Developers Guide](https://docs.angularjs.org/guide/component#unit-testing-component-controllers):

![ngMock vs angular-test-runner](http://pragmatists.pl/img/ngMock_vs_angular_test_runner.png)

See more [examples](https://github.com/Pragmatists/angular-test-runner/blob/master/test/sample-test.js)

### Why not Protractor

While **Protractor** is focused on end-to-end testing Angular application as a whole (from a browser perspective), 
**angular-test-runner** focuses on testing coherent parts of application by excerising selected components in isolation. 

## Features
* readable performing [actions](https://github.com/Pragmatists/angular-test-runner/wiki/Actions), e.g. clicking on elements, typing into inputs etc.
* easy request and response [server stubbing](https://github.com/Pragmatists/angular-test-runner/wiki/Server)
* simplified testing of code with [async operations](https://github.com/Pragmatists/angular-test-runner/wiki/Server)
* easy to [write asserts](https://github.com/Pragmatists/angular-test-runner/wiki/actions#expectelementelement) concerning html elements
