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
