import { describe, it } from "mocha";
import path, { resolve } from "path";
import { strictEqual } from "assert";
import { Util } from "@miqro/core";
import { midleware, APIRouter, App, ErrorHandler, TestHelper } from "../src";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");

Util.loadConfig();

process.env.LOG_LEVEL = "debug";

describe("router functional tests", function () {
  this.timeout(10000);
  it("root post with APITestHelper", (done) => {
    const app = new App();
    app.add(midleware());
    app.add(ErrorHandler());
    app.add(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
    }));
    TestHelper(app, {
      url: `/api/apiNameBla`,
      method: "post"
    }, (res) => {
      const { status, data, headers } = res;
      console.log({ status, data, headers });
      strictEqual(headers['content-type'], "application/json");
      strictEqual(headers['content-length'], "45");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.message, "hello");
      done();
    });
  });

  it("root get with APITestHelper", (done) => {
    const app = new App();
    app.add(midleware());
    app.add(ErrorHandler());
    app.add(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
    }));
    TestHelper(app, {
      url: `/api/apiNameBla`,
      query: {
        name: "bla"
      },
      method: "get"
    }, (res) => {
      const { status, data, headers } = res;
      console.log({ status, data, headers });
      /*strictEqual(headers['content-type'], "application/json");
      strictEqual(headers['content-length'], "45");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.message, "hello");*/
      done();
    });
  });
});
