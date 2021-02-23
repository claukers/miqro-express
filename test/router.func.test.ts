import { describe, it } from "mocha";
import path, { resolve } from "path";
import { strictEqual } from "assert";
import { Util } from "@miqro/core";
import { APITestHelper } from "../src";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");

Util.loadConfig();

process.env.LOG_LEVEL = "debug";

describe("router functional tests", function () {
  this.timeout(10000);
  it("root post with APITestHelper", (done) => {
    APITestHelper({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
    }, {
      url: `/api/apiNameBla`,
      method: "post"
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
