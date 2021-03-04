import { describe, it } from "mocha";
import path, { resolve } from "path";
import { strictEqual } from "assert";
import { Util } from "@miqro/core";
import { App, middleware, APIRouter, TestHelper as FuncTestHelper, TestHelper } from "../src";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");

Util.loadConfig();

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

  let app: App;

  beforeEach(() => {
    app = new App();
    app.use(middleware());
  });

  it("root post with APITestHelper", (done) => {
    const app = new App();
    app.use(middleware());
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
    }));
    TestHelper(app, {
      url: `/api/apiNameBla`,
      method: "post",
      headers: {
        Authorization: "bla"
      }
    }, (res) => {
      const { status, data, headers } = res;
      console.log({ status, data, headers });
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "45");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result.message, "hello");
      done();
    });
  });

  it("root get with APITestHelper", (done) => {
    const app = new App();
    app.use(middleware());
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
    }));
    TestHelper(app, {
      url: `/api/apiNameBla`,
      query: {
        name: "bla"
      },
      method: "get",
      headers: {
        Authorization: "bla"
      }
    }, (res) => {
      const { status, data, headers } = res;
      console.log({ status, data, headers });
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "35");
      strictEqual(status, 200);
      strictEqual(data.success, true);
      strictEqual(data.result, "bye bla");
      done();
    });
  });

  it("root put custom", (done) => {

    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla`,
      method: "put",
      headers: {
        Authorization: "bla"
      }
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

    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
    }))

    FuncTestHelper(app, {
      url: `/api/apiNameBla`,
      method: "delete",
      headers: {
        Authorization: "bla"
      }
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

  it("simple echo", (done) => {
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
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
    app.use(APIRouter({
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

  it("sink happy path bad query", (done) => {
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBlo/sink"
    }));

    FuncTestHelper(app, {
      url: `/api/apiNameBlo/sink/echo/bbb`,
      query: {
        bla2: "bla"
      },
      data: {
        bla: "bla"
      },
      method: "put",
      headers: {
        Authorization: "bla"
      }
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

  it("sink happy path no token", (done) => {
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata")
    }));

    FuncTestHelper(app, {
      url: `/apidata/echo/bbb`,
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
      strictEqual(headers['content-length'], "48");
      strictEqual(status, 401);
      strictEqual(data.success, false);
      strictEqual(data.message, "No token provided!");
      done();
    });
  });

  it("sink happy path session throws", (done) => {
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata")
    }));

    FuncTestHelper(app, {
      url: `/apidata/echo/bbb`,
      query: {
        bla2: "bla"
      },
      data: {
        bla: "bla"
      },
      method: "put",
      headers: {
        Authorization: "throw"
      }
    }, (res) => {
      const { status, data, headers } = res;
      console.log({ status, data, headers });
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "61");
      strictEqual(status, 401);
      strictEqual(data.success, false);
      strictEqual(data.message, "Fail to authenticate token! bla");
      done();
    });
  });

  /*it("root patch with param", (done) => {

    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
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

    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
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

    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBla"
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

  it("other echo get with param", (done) => {
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
    app.use(ErrorHandler());
    app.use(APIRouter({
      dirname: resolve(__dirname, "apidata"),
      apiName: "apiNameBla",
      path: "/api/apiNameBlo/sink"
    }));

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
  });*/
});
