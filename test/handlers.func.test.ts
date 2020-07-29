import {describe, it} from "mocha";
import express, {NextFunction, Request, Response} from "express";
import path from "path";
import {strictEqual} from "assert";
import {ParseOptionsError, Util} from "@miqro/core";
import {setupMiddleware} from "../src/middleware";
import {FuncTestHelper} from "./func_test_helper";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");

Util.loadConfig();


describe("handlers functional tests", function () {
  this.timeout(10000);
  it("ErrorHandler catches ParseOptionsError as 400", (done) => {
    const {ErrorHandler} = require("../src/");
    const myFunc = () => {
      throw new ParseOptionsError("myerror");
    };
    const app = express();
    process.env.FEATURE_TOGGLE_DISABLE_POWERED = "true";
    process.env.FEATURE_TOGGLE_REQUEST_UUID = "true";
    process.env.FEATURE_TOGGLE_MORGAN = "true";
    process.env.FEATURE_TOGGLE_BODY_PARSER = "true";
    process.env.BODY_PARSER_INFLATE = "true";
    process.env.BODY_PARSER_LIMIT = "100kb";
    process.env.BODY_PARSER_STRICT = "true";
    process.env.BODY_PARSER_TYPE = "application/json";
    setupMiddleware(app);
    app.get("/myFunc", myFunc);
    app.use(ErrorHandler());

    FuncTestHelper({
      app,
      url: `/myFunc`,
      method: "get"
    }, ({status, data, headers}) => {
      strictEqual(headers['content-type'], "application/json; charset=utf-8");
      strictEqual(headers['content-length'], "37");
      strictEqual(status, 400);
      strictEqual(data.success, false);
      strictEqual(data.message, "myerror");
      done();
    });

  });
  it("ErrorHandler on 404", (done) => {
    const {ErrorHandler} = require("../src/");
    const myFunc = () => {
      throw new ParseOptionsError("myerror");
    };
    const app = express();
    app.get("/myFunc", myFunc);
    app.use(ErrorHandler());

    FuncTestHelper({
        app,
        url: "/myFunc2",
        method: "",
      },
      ({status, headers, data}) => {
        strictEqual(status, 404);
        strictEqual(headers['content-type'], "text/html; charset=utf-8");
        strictEqual(headers['content-length'], "146");
        strictEqual(data.length, 146);
        done();
      });
  });
  it("ErrorHandler on unknown error is skipped", (done) => {
    const {ErrorHandler} = require("../src/");
    const myFunc = () => {
      throw Error("bla");
    };
    const app = express();
    app.get("/myFunc", myFunc);
    app.use(ErrorHandler());

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 500);
        strictEqual(headers['content-type'], "text/html; charset=utf-8");
        done();
      });
  });
  it("ErrorHandler on unknown error is skipped and passed to the next error handler", (done) => {
    const {ErrorHandler} = require("../src/");
    const myFunc = () => {
      throw Error("bla");
    };
    const app = express();
    app.get("/myFunc", myFunc);
    app.use(ErrorHandler());
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      strictEqual(err.message, "bla");
      res.status(500);
      res.json({
        bla: true
      });
    });

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 500);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "12");
        strictEqual(data.bla, true);
        done();
      });
  });
  it("Handler happy path aggregates results", (done) => {
    const {Handler, ResponseHandler} = require("../src/");
    let bla = 0;
    const myFunc = () => {
      return ++bla;
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      Handler(myFunc),
      ResponseHandler()
    ]);

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 200);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "31");
        strictEqual(data.success, true);
        strictEqual(data.result[0], 1);
        strictEqual(data.result[1], 2);
        done();
      });
  });
  it("Handler happy path aggregates results async", (done) => {
    const {Handler, ResponseHandler} = require("../src/");
    let bla = 0;
    const myFunc = async () => {
      return ++bla;
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      Handler(myFunc),
      ResponseHandler()
    ]);


    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 200);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "31");
        strictEqual(data.success, true);
        strictEqual(data.result[0], 1);
        strictEqual(data.result[1], 2);
        done();
      });
  });
  it("Handler happy path aggregates results Promise", (done) => {
    const {Handler, ResponseHandler} = require("../src/");
    let bla = 0;
    const myFunc = () => {
      return new Promise((resolve) => {
        resolve(++bla);
      });
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      Handler(myFunc),
      ResponseHandler()
    ]);

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 200);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "31");
        strictEqual(data.success, true);
        strictEqual(data.result[0], 1);
        strictEqual(data.result[1], 2);
        done();
      });
  });
  it("Handler happy path aggregates results function Promise", (done) => {
    const {Handler, ResponseHandler} = require("../src/");
    let bla = 0;

    function myFunc() {
      return new Promise((resolve) => {
        resolve(++bla);
      });
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      Handler(myFunc),
      ResponseHandler()
    ]);

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 200);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "31");
        strictEqual(data.success, true);
        strictEqual(data.result[0], 1);
        strictEqual(data.result[1], 2);
        done();
      });
  });
  it("Handler happy path aggregates results function value", (done) => {
    const {Handler, ResponseHandler} = require("../src/");
    let bla = 0;

    function myFunc() {
      return ++bla;
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      Handler(myFunc),
      ResponseHandler()
    ]);

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 200);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "31");
        strictEqual(data.success, true);
        strictEqual(data.result[0], 1);
        strictEqual(data.result[1], 2);
        done();
      });
  });
  it("Handler happy path aggregates results to one if only one result", (done) => {
    const {Handler, ResponseHandler} = require("../src/");
    let bla = 0;
    const myFunc = () => {
      return ++bla;
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      ResponseHandler()
    ]);

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 200);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "27");
        strictEqual(data.success, true);
        strictEqual(data.result, 1);
        done();
      });
  });
  it("Handler throws", (done) => {
    const {Handler, ResponseHandler} = require("../src/");
    const myFunc = () => {
      throw new Error("asd");
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      ResponseHandler()
    ]);

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 500);
        strictEqual(headers['content-type'], "text/html; charset=utf-8");
        // strictEqual(headers['content-length'], "27");
        strictEqual(data.success, undefined);
        strictEqual(data.result, undefined);
        done();
      });
  });

  it("Handler throws and catched by ErrorHandler", (done) => {
    const {Handler, ResponseHandler, ErrorHandler} = require("../src/");
    const myFunc = () => {
      throw new ParseOptionsError("asd");
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      ResponseHandler()
    ]);
    app.use(ErrorHandler());

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 400);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        // strictEqual(headers['content-length'], "27");
        strictEqual(data.success, false);
        strictEqual(data.message, "asd");
        done();
      });
  });

  it("Handler throws unknown and  ErrorHandler ignores it", (done) => {
    const {Handler, ResponseHandler, ErrorHandler} = require("../src/");
    const myFunc = () => {
      throw new Error("asd");
    };
    const app = express();
    app.get("/myFunc", [
      Handler(myFunc),
      ResponseHandler()
    ]);
    app.use(ErrorHandler());
    let dCallCount = 0;
    app.use((e: Error, req: Request, res: Response, next: NextFunction) => {
      dCallCount++;
      next(e);
    });

    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 500);
        strictEqual(headers['content-type'], "text/html; charset=utf-8");
        // strictEqual(headers['content-length'], "27");
        strictEqual(data.success, undefined);
        strictEqual(data.message, undefined);
        strictEqual(dCallCount, 1);
        done();
      });
  });

  it("HandlerAll happy path aggregates results async", (done) => {
    const {HandleAll, Handler, ResponseHandler} = require("../src/");
    let bla = 0;
    const myFunc = async () => {
      return ++bla;
    };
    const app = express();
    app.get("/myFunc", [
      HandleAll((req: Request) => {
        return [
          {
            req: {
              ...req,
              results: []
            },
            handlers: [Handler(myFunc), Handler(myFunc)]
          }
        ]
      }),
      ResponseHandler()
    ]);


    FuncTestHelper({
        app,
        url: "/myFunc",
        method: "get",
      },
      ({status, headers, data}) => {
        strictEqual(status, 200);
        strictEqual(headers['content-type'], "application/json; charset=utf-8");
        strictEqual(headers['content-length'], "33");
        strictEqual(data.success, true);
        strictEqual(data.result[0][0], 1);
        strictEqual(data.result[0][1], 2);
        FuncTestHelper({
            app,
            url: "/myFunc",
            method: "get",
          },
          ({status, headers, data}) => {
            strictEqual(status, 200);
            strictEqual(headers['content-type'], "application/json; charset=utf-8");
            strictEqual(headers['content-length'], "33");
            strictEqual(data.success, true);
            strictEqual(data.result[0][0], 3);
            strictEqual(data.result[0][1], 4);
            done();
          });
      });
  });

  /*it("ExecHandler works ?", (done) => {
    const {ExecHandler, ResponseHandler} = require("../src/");
    const myFunc = () => {
      throw new Error("asd");
    };
    const app = express();
    app.get("/myFunc", [
      ExecHandler("echo \"hello\""),
      ResponseHandler()
    ]);
    request(app)
      .get('/myFunc')
      .strictEqual('Content-Type', /json/)
      // .strictEqual('Content-Length', '3571')
      .strictEqual(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          strictEqual(res.body.success, true);
          strictEqual(res.body.result, "hello\n");
          done();
        }
      });
  });*/
});
