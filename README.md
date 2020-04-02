# @miqro/handlers

**in early development not to use in production**

this is a part of the ```@miqro``` modules and provides very simple express integration.

- some error handling.
- some function result passing.
- express logging integration.
- **body-parser** configuration via Env vars

## result passing

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
    NextErrorHandler((req, res, next) => {
        const results = getResults(req);
        const ret = results.reduce((ag, value) => {
            ag += value;
        }, 0);
        // clear prev results ?
        setResults(req, [ret]);
        next();
    }), 
    ResponseHandler()
]);
....
```

## error handling

```javascript
...
app.use(.....)
....
// put this at the end of the setup of the app
app.use(ErrorHandler())
app.use(myFallBackerrorHandler) // this will catch all throws that are not reconized by ErrorHandler()
```

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

## Documentation

[globals](docs/globals.md)
