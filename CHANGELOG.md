## 0.1.0 (31.10.2017)

### Attach to DOM

If you want to test component which using for example `angular.element()` function (or library, eg. ngDialog)
you can add `attachToDocument` configuration flag.

```typescript
    beforeEach(() => {
      app.run(['moduleName'], {attachToDocument : true});
    }
```

Because we need to detach component from document after the test you need to call `app.stop()` function as well

```typescript
    afterEach(() => {
      app.stop();
    }
```

[More complex example](https://github.com/Pragmatists/angular-test-runner/blob/master/test/sample-test.js#L242)

## 0.0.5 (27.10.2017)

### Blur action

Now we can use blur action on element

```typescript
    html.perform(
      blur.from('input.name')
    );
```


## 0.0.1 (29.03.2017)

### Accept RegExp as http request url

Now we can pass url to server http request as RegExp instead of String

```typescript
server.get(new RegExp('/api/user/(\\d+)/address'), res => res.sendStatus(200));
```
