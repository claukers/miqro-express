# @miqro/handlers

this module provides some express middleware for.

- request logging using **morgan** and **@miqro/core** configured via env vars.
- proxy request handler.
- request uuid handler.
- **FeatureToggleRouter** for enabling/disabling features via env vars.
- **body-parser** configuration and feature toggle via env vars.

## handlers

##### Handler(...) 

```javascript
...
app.get("/add/:a/:b/:c", [
    ...
    Handler(async () => {
        return 123; 
    }),
    Handler(()=>{
        return 2; 
    }),
    (req, res, next)=>{
        // req.results will have [123, 2]
        next();    
    },
    ...
]);
....
```

##### HandleAll(...)

```javascript
...
const a = Handler(....);
const b = Handler(....);
const c = Handler(....);
const d = Handler(....);

app.use([
    HandleAll((req)=>{
        .....
        const reqAB = ....
        const reqCD = ....
        .....
        return [{
            reqAB,
            handlers: [a, b,....]
         }, {
            reqCD,
            handlers: [c, d,....]
         }, ...];  
    }),
    ResponseHandler() // req.results will be passed the same way as Promise.all(...)
]);
....
```

##### SessionHandler(...)

```javascript
...
app.post(..., [SessionHandler(...), protectedHandler, ResponseHandler(...)])
...
app.use(ErrorHandler(...)) // this is needed for resolving a failed session validation as a 401 or 403
...
```

##### GroupPolicyHandler(...)

```javascript
...
app.post(..., [SessionHandler(...), GroupPolicyHandler(...), protectedHandler, ResponseHandler(...)])
...
app.use(ErrorHandler(...)) // this is needed for resolving a failed session validation as a 401 or 403
...
```

##### ErrorHandler(...)

```javascript
...
app.use(..., [
    ...
    ({body}) => {
        // for example this is interpreted in ErrorHandler as a 400 if req.body doesnt match
        Util.parseOptions("body", body, [
          { name: "name", type: "string", required: true },
          { name: "age", type: "number", required: true },
          { name: "likes", type: "array", required: true, arrayType: "string" }
        ], "no_extra");
    },
    ...
]);
...
app.use(ErrorHandler(...))
...
app.use(myFallBackerrorHandler) // this will catch all throws that are not reconized by ErrorHandler()
```

##### ProxyHandler(...) and ProxyResponseHandler(...)

```javascript
app.use([
    ProxyHandler({
        proxyService: {
            resolveRequest: (req) => {
                return { url: ..., method: ... };
            }
        }
    }, logger),
    ProxyResponseHandler(logger)
])
```

##### FeatureRouter(...)

```javascript
// ONLY if FeatureToggle.isFeatureEnabled(...) is true the feature will be enabled in the router
app.use(FeatureRouter({
    features: ....
    ....
}, logger));
```

## middleware

##### setupMiddleware(...)

```javascript
...
// put this at the start of the app setup
setupMiddleware(app, logger);
...
```

or

##### UUIDHandler(...), MorganHandler(...), BodyParserHandler(...)

```javascript
...
// put this at the start of the app setup
if (FeatureToggle.isFeatureEnabled("DISABLE_POWERED")) {
    app.disable("x-powered-by");
}
if (FeatureToggle.isFeatureEnabled("REQUEST_UUID")) {
    app.use(UUIDHandler());
}
if (FeatureToggle.isFeatureEnabled("MORGAN")) {
    app.use(MorganHandler(logger));
}
if (FeatureToggle.isFeatureEnabled("BODY_PARSER")) {
    app.use(BodyParserHandler(logger));
}
...
```

###### body-parser env vars

```
BODYPARSER_INFLATE=true
BODYPARSER_LIMIT="100kb"
BODYPARSER_STRICT=true
BODYPARSER_TYPE="application/json"
```

###### morgan env vars

```
MORGAN_FORMAT="request[:uuid] [:method] [:url] [:status] [:response-time]ms"
```
