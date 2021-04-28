import { describe, it } from "mocha";
import path from "path";
import { strictEqual } from "assert";
import { TestHelper as FuncTestHelper, App, Router, BadRequestError, Util } from "@miqro/core";
import { middleware, ResponseHandler } from "../src";
import { inspect } from "util";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");

Util.loadConfig();

process.env.LOG_LEVEL = "debug";

describe("router functional tests", function () {
  this.timeout(10000);

  it("nested simple happy path", (done) => {
    const app = new App();
    app.use(middleware());
    const router = new Router();
    router.get("/ble", async (ctx) => {
      throw new BadRequestError(`bla`);
    });
    app.use(router, "/api");
    router.get("/bla", async (ctx) => {
      ctx.json({
        status: "OK"
      });
    });
    app.get("/api/blo", async () => {
      throw new BadRequestError(`blo`);
    });
    const router2 = new Router();
    router.use(router2, "/bli/blu");

    router2.get("/blubli", async (ctx) => {
      ctx.json({
        status: "OK2"
      });
    });

    router2.get("/bluble", [async (ctx) => {
      return "bla"
    }, ResponseHandler()]);

    router2.get("/blublo", [async (ctx) => {
      return {
        bla: 1
      }
    }, ResponseHandler()]);

    FuncTestHelper(app, {
      url: `/api/bla`,
      method: "get"
    }, (res) => {
      let { status, data, headers } = res;
      console.log(inspect({ status, data, headers }));

      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "15");
      strictEqual(status, 200);
      strictEqual(data.status, "OK");

      FuncTestHelper(app, {
        url: `/api/ble`,
        method: "get"
      }, (res) => {
        let { status, data, headers } = res;
        console.log(inspect({ status, data, headers }));

        strictEqual(headers['content-type'], "plain/text; charset=utf-8");
        strictEqual(headers['content-length'], "3");
        strictEqual(status, 400);

        strictEqual(data, "bla");

        FuncTestHelper(app, {
          url: `/api/blo`,
          method: "get"
        }, (res) => {
          let { status, data, headers } = res;
          console.log(inspect({ status, data, headers }));

          strictEqual(headers['content-type'], "plain/text; charset=utf-8");
          strictEqual(headers['content-length'], "3");
          strictEqual(status, 400);

          strictEqual(data, "blo");

          FuncTestHelper(app, {
            url: `/api/bli/blu/blubli`,
            method: "get"
          }, (res) => {
            let { status, data, headers } = res;
            console.log(inspect({ status, data, headers }));

            strictEqual(headers['content-type'], "application/json; charset=utf-8");
            strictEqual(headers['content-length'], "16");
            strictEqual(status, 200);
            strictEqual(data.status, "OK2");

            FuncTestHelper(app, {
              url: `/api/bli/blu/bluble`,
              method: "get"
            }, (res) => {
              let { status, data, headers } = res;
              console.log(inspect({ status, data, headers }));

              strictEqual(headers['content-type'], "application/json; charset=utf-8");
              strictEqual(headers['content-length'], "5");
              strictEqual(status, 200);
              strictEqual(data, "bla");

              FuncTestHelper(app, {
                url: `/api/bli/blu/blublo`,
                method: "get"
              }, (res) => {
                let { status, data, headers } = res;
                console.log(inspect({ status, data, headers }));

                strictEqual(headers['content-type'], "application/json; charset=utf-8");
                strictEqual(headers['content-length'], "9");
                strictEqual(status, 200);
                strictEqual(data.bla, 1);

                done();
              });
            });
          });
        });
      });
    });
  });
});
