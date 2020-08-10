import {describe, it} from "mocha";
import express from "express";
import path, {resolve} from "path";
import {strictEqual} from "assert";
import {Util} from "@miqro/core";
import {setupMiddleware} from "../src/middleware";
import {APIRouter, TestHelper as FuncTestHelper} from "../src";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");

Util.loadConfig();


describe("api-router functional tests", function () {
  this.timeout(10000);
  it("simple echo", (done) => {
    const app = express();
    process.env.FEATURE_TOGGLE_DISABLE_POWERED = "true";
    process.env.FEATURE_TOGGLE_REQUEST_UUID = "true";
    process.env.FEATURE_TOGGLE_MORGAN = "true";
    process.env.FEATURE_TOGGLE_BODY_PARSER = "true";
    process.env.BODY_PARSER_INFLATE = "true";
    process.env.BODY_PARSER_LIMIT = "100kb";
    process.env.BODY_PARSER_STRICT = "true";
    process.env.BODY_PARSER_TYPE = "application/json";
    process.env.FEATURE_TOGGLE_API_APINAMEBLA_ECHO = "true";
    setupMiddleware(app);
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla/echo`,
      method: "post",
      data: {
        bla: 1
      }
    }, (res) => {
      const {status, data, headers} = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "35");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.bla, 1);
      done();
    });

  });

  it("simple echo async testhelper", (done) => {
    const app = express();
    process.env.FEATURE_TOGGLE_DISABLE_POWERED = "true";
    process.env.FEATURE_TOGGLE_REQUEST_UUID = "true";
    process.env.FEATURE_TOGGLE_MORGAN = "true";
    process.env.FEATURE_TOGGLE_BODY_PARSER = "true";
    process.env.BODY_PARSER_INFLATE = "true";
    process.env.BODY_PARSER_LIMIT = "100kb";
    process.env.BODY_PARSER_STRICT = "true";
    process.env.BODY_PARSER_TYPE = "application/json";
    process.env.FEATURE_TOGGLE_API_APINAMEBLA_ECHO = "true";
    setupMiddleware(app);
    app.use("/", APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla"
    }));

    (async () => {
      const res = await FuncTestHelper(app, {
        url: `/api/apiNameBla/echo`,
        method: "post",
        data: {
          bla: 1
        }
      });
      if (res) {
        const {status, data, headers} = res;
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "35");
        strictEqual(status, 200);
        strictEqual(data.success, true);
        strictEqual(data.result.bla, 1);
      } else {
        strictEqual(false, true, "no response");
      }

    })().then(done).catch(done);


  });
});
