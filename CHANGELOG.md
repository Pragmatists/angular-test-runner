## 0.1.1 (29.03.2017)

### Accept RegExp as http request url

Now we can pass url to server http request as RegExp instead of String

```typescript
server.get(new RegExp('/api/user/(\\d+)/address'), res => res.sendStatus(200));
```
