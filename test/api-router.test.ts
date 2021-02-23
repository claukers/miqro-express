import { describe, it } from "mocha";
import express from "express";
import path, { resolve } from "path";
import { strictEqual } from "assert";
import { Util } from "@miqro/core";
import { setupMiddleware } from "../src/middleware";
import { APIRouter, APITestHelper, TestHelper as FuncTestHelper, ErrorHandler } from "../src";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");

Util.loadConfig();
;
process.env.DISABLE_POWERED = "true";
process.env.REQUEST_UUID = "true";
process.env.MORGAN = "true";
process.env.BODY_PARSER = "true";
process.env.BODY_PARSER_INFLATE = "true";
process.env.BODY_PARSER_LIMIT = "100kb";
process.env.BODY_PARSER_STRICT = "true";
process.env.LOG_LEVEL = "debug";
process.env.BODY_PARSER_TYPE = "application/json";
process.env.APINAMEBLA = "true";
process.env.APINAMEBLA_ECHO_POST = "true";
process.env.APINAMEBLA_ECHO_SINK = "true";
process.env.APINAMEBLA_ECHO_OTHER_POST = "true";
process.env.APINAMEBLA_POST = "true";
process.env.APINAMEBLA_ECHO_OTHER_GET = "true";
process.env.APINAMEBLA_MYCUSTOM = "true";
process.env.APINAMEBLA_GET = "true";
process.env.APINAMEBLA_PATCH__NAME = "true";
process.env.APINAMEBLA_PATCH__BLA_NAME = "true";

describe("api-router functional tests", function () {
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
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "45");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.message, "hello");
      done();
    });
  });

  it("root post", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use("/api", APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla`,
      method: "post"
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "45");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.message, "hello");
      done();
    });

  });

  it("root put custom", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use("/api", APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla`,
      method: "put"
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "46");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.message, "custom");
      done();
    });

  });

  it("root delete custom", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use("/api", APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla`,
      method: "delete"
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "46");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.message, "custom");
      done();
    });

  });

  it("root patch with param", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use("/api", APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla/blo`,
      method: "patch"
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "35");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result, "bye blo");
      done();
    });

  });

  it("root patch with nested param", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use("/api", APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla/bla/blo`,
      method: "patch"
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "35");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result, "bye blo");
      done();
    });

  });

  it("root get with param", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use("/api", APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla/blo`,
      method: "get"
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "35");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result, "bye blo");
      done();
    });

  });

  it("simple echo", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use("/api", APIRouter({
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
      const { status, data, headers } = res;
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
    setupMiddleware(app);
    app.use("/", APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
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
        const { status, data, headers } = res;
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

  it("other echo", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBlo"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBlo/echo/other`,
      method: "post",
      data: {
        bla: 1
      }
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "35");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.bla, 1);
      done();
    });

  });

  it("other echo get with param", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBlo"
    }));

    FuncTestHelper(app, {
      url: `/api/apiNameBlo/echo/other/myname`,
      method: "get"
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "40");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result, "hello myname");
      done();
    });
  });

  it("sink happy path without param", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBlo/sink"
    }));

    FuncTestHelper(app, {
      url: `/api/apiNameBlo/sink/echo/bbb`,
      query: {
        bla: "bla"
      },
      data: {
        bla: "bla"
      },
      method: "put"
    }, (res) => {
      const { status, data, headers } = res;
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "39");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.bla, "bla");
      done();
    });
  });

  it("sink happy path with param", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBlo/sink"
    }));

    app.use(ErrorHandler());

    FuncTestHelper(app, {
      url: `/api/apiNameBlo/sink/echo/bbb/1`,
      query: {
        bla: "bla"
      },
      data: {
        bla: "bla"
      },
      method: "put"
    }, (res) => {
      const { status, data, headers } = res;
      //console.log({status, data, headers});
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "37");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.bla, "1");

      FuncTestHelper(app, {
        url: `/api/apiNameBlo/sink/echo/bbb/1`,
        query: {
          bla: "bla"
        },
        data: {
          bla: "bla"
        },
        method: "put"
      }, (res2) => {
        //console.log({status, data, headers});
        strictEqual(res2.headers['content-type'], "application/json; charset=utf-8");
        strictEqual(res2.headers['content-length'], "37");
        strictEqual(res2.status, 200);
        strictEqual(res2.data.success, true);
        strictEqual(res2.data.result.bla, "1");

        done();
      });
    });
  });

  it("sink happy path bad query", (done) => {
    const app = express();
    setupMiddleware(app);
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBlo/sink"
    }));

    app.use(ErrorHandler());

    FuncTestHelper(app, {
      url: `/api/apiNameBlo/sink/echo/bbb/1`,
      query: {
        bla2: "bla"
      },
      data: {
        bla: "bla"
      },
      method: "put"
    }, (res) => {
      const { status, data, headers } = res;
      console.log({ status, data, headers });
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "51");
      strictEqual(status, 400);
      strictEqual(data.success, false);
      strictEqual(data.message, "query.bla not defined");
      done();
    });
  });
});
