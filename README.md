# @miqro/handlers

lightweight module for api development using the native http module.

- request logging.
- proxy request handler.
- request taging using **uuid** module.
- request parser for json and x-www-form-urlencoded.
- cookie parser using **cookie** module.
- session validation.
- jwt token validation using **jsonwebtoken** module.
- request parsing.


```src/api/campaign/contact/post.js```
```javascript
...
// [POST] /api/campaign/contact
module.exports = {
  description: "...",
  query: {
    options: ...,
    ...
  },
  body: {
    options: ...,
    ...
  },
  results: ...,
  ...
  handler: (logger: Logger, db = Database.getInstance())=> {
    return [
        Handler(async ({body}) => {
          return ...
      }, logger)
    ];
  }
}
```

```src/api/health.js```
```javascript
...
// [GET] /api/health
module.exports = {
  description: "...",
  methods: ["get"],
  path: "/health",
  query: false,
  body: false,
  results: {
    options: [
      { name: "status", type: "enum", enumValues: ["OK"], required: true }
    ],
    mode: "remove_extra",
    ...
  },
  ...
  handler: (logger: Logger, db = Database.getInstance())=>
    Handler(async () => {
      try {
        await db.query({ query: "SELECT 1+1", values: [] });
        return {
          status: "OK"
        };
      } catch (e) {
        logger.error(e);
        throw new ParseOptionsError(`NOK`);
      }
    }, logger)
}
```

start with

```
npx miqro start:api [cluster_count] [cluster] <api_dirname>
```

to generate api documentation.

```
npx miqro doc:md <api_dirname> /api api.md
```

you can also watch for changes and re-start the server

```
npx miqro watch:api <api_dirname>
```

declare routes creating files in the ```api_dirname```

APIRouter is a FeatureRouter so to disable routes you can set an ENV VAR with the name of the feature to **false**.

```
API_HEALTH=false
```

or use your own structure

```src/main.js```
```javascript
const http = require("http");
const {App, ReadBuffer, JSONBodyParser, Router, APIRouter} = require("@miqro/handler");

const app = new App();
...
app.use(ReadBuffer());
app.use(JSONBodyParser());
...
app.get("/echo", async (ctx) => {
  ctx.json(ctx.body);
});
...
const router = new Router();
...
app.use(router);
...
app.use(APIRouter({
  dirname: apiPath,
  ...
}, logger));
...
const server = new http.createServer(app.listener); 
server.listen(8080);
// same as app.listen(8080);
...
```

## handlers

##### Router

```javascript
...
const router = new Router();
router.post("/echo", async (ctx) => {
  ...
});
app.use(router, "/api");
...
```

##### APIRouter(...)

```javascript
...
app.use(APIRouter({
  dirname: apiPath,
  ...
}, logger));
...
```

##### Handler(...) 

```javascript
...
app.get("/add", [
    ...
    async () => {
        return 123; 
    },
    async ()=>{
        return 2; 
    },
    async (ctx)=>{
        // ctx.results will have [123, 2]
    },
    ...
]);
....
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

##### Catch errors

```javascript
...
app.catch(myFallBackerrorHandler1) // this will catch all throws
app.catch(myFallBackerrorHandler2) // this will catch all throws if 'myFallBackerrorHandler1' didnt send a responde or not returned 'false' to stop the execution of the next error handler
...
app.use(..., [
    ...
    async ({body}) => {
        // for example this is interpreted as a 400 if req.body doesnt match
        parseOptions("body", body, [
          { name: "name", type: "string", required: true },
          { name: "age", type: "number", required: true },
          { name: "likes", type: "array", required: true, arrayType: "string" }
        ], "no_extra");
    },
    ...
]);
```

##### ProxyHandler(...) and ProxyResponseHandler(...)

```javascript
app.use([
    ProxyHandler({
        proxyService: {
            resolveRequest: (ctx) => {
                return { url: ..., method: ... };
            }
        }
    }),
    ProxyResponseHandler()
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

## ctx

```typescript
class Context {
    readonly req: IncomingMessage;
    readonly res: ServerResponse;
    readonly logger: Logger;
    readonly startMS: number;
    tookMS?: number;
    readonly uuid: string;
    session?: Session;
    results: any[];
    readonly path: string;
    readonly url: string;
    readonly hash: string;
    readonly method: string;
    readonly headers: IncomingHttpHeaders;
    readonly cookies: SimpleMap<string>;
    query: ParsedUrlQuery;
    buffer: Buffer;
    readonly remoteAddress?: string;
    body: any;
    constructor(req: IncomingMessage, res: ServerResponse);
    clearCookie(name: string): void;
    setHeader(name: string, value: number | string | ReadonlyArray<string>): void;
    setCookie(name: string, value: string, options?: CookieSerializeOptions): void;
    end({ status, headers, body }: Response): Promise<void>;
    json(body: any, headers?: OutgoingHttpHeaders, status?: number): Promise<void>;
    text(text: string, headers?: OutgoingHttpHeaders, status?: number): Promise<void>;
    html(html: string, headers?: OutgoingHttpHeaders, status?: number): Promise<void>;
    redirect(url: string, headers?: OutgoingHttpHeaders, status?: number): Promise<void>;
}
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
