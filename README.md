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

## quickstart

```npm install @miqro/core --save```

```npm install @miqro/handlers --save```

```npm install miqro --save-dev```

to use typescript 

```npm install typescript --save-dev```

and create a ```tsconfig.json```

```json
{
  "compileOnSave": true,
  "compilerOptions": {
    "strict": false,
    "outDir": "./dist/",
    "removeComments": true,
    "noImplicitAny": false,
    "preserveConstEnums": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "declaration": true,
    "moduleResolution": "node",
    "module": "commonjs",
    "target": "es2017",
    "lib": [
      "es2017"
    ]
  },
  "exclude": [
    "node_modules",
    "test"
  ],
  "include": [
    "src"
  ]
}
```

```npx miqro new:main src_main```

```npx miqro new:route src_api_health_get```

to generate api documentation.

```
npx miqro doc:md src/api/ /api api.md
```

or if you want a json

```
npx miqro doc src/api/ /api > api.json
```

declare routes creating files in ```src/api/```

APIRouter is a FeatureRouter so to disable routes you can set an ENV VAR with the name of the feature to **false**.

```
API_HEALTH=false
```

## handlers

##### Router

```javascript
import { Router } from "@miqro/core";
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
