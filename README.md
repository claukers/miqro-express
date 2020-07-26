# @miqro/handlers

this module provides some express middleware for.

- request proxy using **axios** as the request module.
- FeatureToggleRouter for enabling/disabling features via env vars.
- morgan configuration and feature toggle via env vars.
- **body-parser** configuration and feature toggle via env vars.



## morgan, bodyparser, uuid per request, disable powered by, etc

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
