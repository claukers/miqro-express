# @miqro/handlers

some handler implementations for @miqro/core

- request taging using **uuid** module.
- cookie parser using **cookie** module.
- session validation.
- jwt token validation using **jsonwebtoken** module.

## handlers

##### APIRouter(...)

```javascript
...
app.use(APIRouter({
  dirname: apiPath,
  ...
}, logger));
...
```

##### SessionHandler(...)

```javascript
...
app.post(..., [SessionHandler(...), protectedHandler, ResponseHandler(...)])
...
```

##### GroupPolicyHandler(...)

```javascript
...
app.post(..., [SessionHandler(...), GroupPolicyHandler(...), protectedHandler, ResponseHandler(...)])
...
```

## middleware

##### middleware(...)

```javascript
...
// put this to add ReadBuffer, JSONParser, URLEncodedBodyParser, CookieParser and the requets logger
app.use(middleware());
...
```

or add them manually 

```javascript
...
app.use(ReadBuffer())
...
app.use(JSONParser())
...
```

##### some env vars

```
LOG_LEVEL=debug|info|error|warn|trace

REQUEST_LOGGER=true

COOKIE_PARSER=true

READ_BUFFER=true
REQUEST_LOGGER=true

JSON_PARSER=true
JSON_PARSER_LIMIT=8000
JSON_PARSER_STRICT=false
JSON_PARSER_TYPE=application/json

URL_ENCODED_PARSER=true
URL_ENCODED_PARSER_LIMIT=8000
URL_ENCODED_PARSER_TYPE=application/x-www-form-urlencoded
```
