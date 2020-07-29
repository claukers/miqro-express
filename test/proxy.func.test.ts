import {describe, it, before, after} from "mocha";
import {strictEqual} from "assert";
import express, {Express, Request} from "express";
import {RequestOptions, ResponseError, Util} from "@miqro/core";
import {Server} from "http";
import {FuncTestHelper} from "./func_test_helper";

describe("proxyhandler functional tests", function () {
  this.timeout(10000);

  let server: Server;

  before((done) => {
    (async () => {
      const app = express();

      app.use("/echo", (req, res) => {
        res.status(200);
        const keys = Object.keys(req.headers);
        for (const key of keys) {
          res.set(key, req.headers[key]);
        }
        res.send(req.body);
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
      const app = express();
      const {ProxyHandler, ProxyResponseHandler} = require("../src");
      app.use("/proxy", [
        ProxyHandler({
          proxyService: {
            resolveRequest: async (req: Request): Promise<RequestOptions> => {
              return {
                url: `http://localhost:9999/echo`,
                method: req.method,
                headers: {
                  "myheader": "echo"
                },
                data: req.body
              };
            }
          }
        }),
        ProxyResponseHandler()
      ] as any);
      const response: any = await new Promise((resolve, reject) => {
        FuncTestHelper({
          app,
          url: '/proxy',
          method: "get"
        }, (res)=>{
          resolve(res);
        });
      });
      strictEqual(response.status, 200);
      strictEqual(Object.keys(response.data).length, 0);
      strictEqual(Object.keys(response.headers).length, 8);
      strictEqual(response.headers.myheader, "echo");
    })().then(done).catch(done);
  });
});
