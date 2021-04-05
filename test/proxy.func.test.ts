import { describe, it, before, after } from "mocha";
import { strictEqual } from "assert";
import { TestHelper as FuncTestHelper, App, Context, RequestOptions } from "@miqro/core";
import { Server } from "http";

describe("proxyhandler functional tests", function () {
  this.timeout(100000);

  let server: Server;

  before((done) => {
    (async () => {
      const app = new App();

      app.get("/echo", async (ctx) => {
        const keys = Object.keys(ctx.headers);
        for (const key of keys) {
          ctx.res.setHeader(key, ctx.headers[key] as any);
        }
        ctx.res.statusCode = 200;
        ctx.res.end(ctx.body);
      });
      server = app.listen(9999);

    })().then(done).catch(done);
  });

  after((done) => {
    (async () => {
      await server.close();
    })().then(done).catch(done);
  });

  it("Happy path GET echo", (done) => {
    (async () => {
      const app = new App();
      const { ProxyHandler, ProxyResponseHandler } = require("../src");
      app.get("/proxy", [
        ProxyHandler({
          proxyService: {
            resolveRequest: async (ctx: Context): Promise<RequestOptions> => {
              return {
                url: `http://localhost:9999/echo`,
                method: ctx.method,
                headers: {
                  "myheader": "echo"
                },
                data: ctx.body ? ctx.body : undefined
              };
            }
          }
        }),
        ProxyResponseHandler()
      ]);
      const response: any = await new Promise((resolve, reject) => {
        FuncTestHelper(app, {
          url: '/proxy',
          method: "get"
        }, (res) => {
          resolve(res);
        });
      });
      strictEqual(response.status, 200);
      strictEqual(Object.keys(response.data).length, 0);
      strictEqual(Object.keys(response.headers).length, 6);
      strictEqual(response.headers.myheader, "echo");
    })().then(done).catch(done);
  });
});
