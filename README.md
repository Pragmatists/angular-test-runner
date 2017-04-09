# angular-test-runner
**angular-test-runner** is small testing library that allows you to use TDD during writing Angular application.

## Installation

### Node.js

`angular-test-runner` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install angular-test-runner


## Example

``` javascript
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
```

See more [examples](https://github.com/Pragmatists/angular-test-runner/blob/master/test/sample-test.js)
