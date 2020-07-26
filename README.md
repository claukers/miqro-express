# @miqro/handlers

this module provides some express middleware for.

- request logging using **morgan** and **@miqro/core** configured via env vars.
- request proxy using **axios** as the request module.
- FeatureToggleRouter for enabling/disabling features via env vars.
- **body-parser** configuration and feature toggle via env vars.

## handlers

##### basic result passing

```javascript
...

const getSomething = (param)=> {
    return async ({params}) => {
        const value = parseInt(params[param]);
        return value;
    }
}

app.get("/add/:a/:b/:c", [
    Handler(getSomething("a")),
    Handler(getSomething("b")),
    Handler(getSomething("c")),
    ResponseHandler() 
]);
....
```

##### parallel result passing

TODO

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
    ResponseHandler() // results will be passed the same way as Promise.all(...)
]);
....
```

##### req.session

TODO

```javascript
...
app.post(..., [SessionHandler(...), protectedHandler, ResponseHandler(...)])
...
app.use(ErrorHandler(...)) // this is needed for resolving a failed session validation as a 401 or 403
...
```

##### res.session.groups validation

TODO

```javascript
...
app.post(..., [SessionHandler(...), GroupPolicyHandler(...), protectedHandler, ResponseHandler(...)])
...
app.use(ErrorHandler(...)) // this is needed for resolving a failed session validation as a 401 or 403
...
```

##### error handling

TODO

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

## request logging, body-parser, uuid per request, disable powered by, etc

```javascript
...
// put this at the start of the app setup
app.use(setupMiddleware());
...
```

## body-parser configuration

```
BODYPARSER_INFLATE=true
BODYPARSER_LIMIT="100kb"
BODYPARSER_STRICT=true
BODYPARSER_TYPE="application/json"
```

## proxy handler

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

## feature router

```javascript
// ONLY if FeatureToggle.isFeatureEnabled(...) is true the feature will be enabled in the router
app.use(FeatureRouter({
    features: ....
    ....
}, logger));
```

## Documentation

[globals](docs/globals.md)
