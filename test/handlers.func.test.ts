import {describe, it} from "mocha";
import {expect} from "chai";
import express, {Express, NextFunction, Request, Response} from "express";
import path from "path";
import {ParseOptionsError, ResponseError, Util} from "@miqro/core";
import {setupMiddleware} from "../src/middleware";
import {existsSync, unlinkSync} from "fs";
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
      expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
      expect(headers['content-length']).to.be.equals("37");
      expect(status).to.be.equals(400);
      expect(data.success).to.be.equals(false);
      expect(data.message).to.be.equals("myerror");
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
        expect(status).to.be.equals(404);
        expect(headers['content-type']).to.be.equals("text/html; charset=utf-8");
        expect(headers['content-length']).to.be.equals("146");
        expect(data.length).to.be.equals(146);
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
        expect(status).to.be.equals(500);
        expect(headers['content-type']).to.be.equals("text/html; charset=utf-8");
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
      expect(err.message).to.be.equals("bla");
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
        expect(status).to.be.equals(500);
        expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
        expect(headers['content-length']).to.be.equals("12");
        expect(data.bla).to.be.equals(true);
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
        expect(status).to.be.equals(200);
        expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
        expect(headers['content-length']).to.be.equals("31");
        expect(data.success).to.be.equals(true);
        expect(data.result[0]).to.be.equals(1);
        expect(data.result[1]).to.be.equals(2);
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
        expect(status).to.be.equals(200);
        expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
        expect(headers['content-length']).to.be.equals("31");
        expect(data.success).to.be.equals(true);
        expect(data.result[0]).to.be.equals(1);
        expect(data.result[1]).to.be.equals(2);
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
        expect(status).to.be.equals(200);
        expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
        expect(headers['content-length']).to.be.equals("31");
        expect(data.success).to.be.equals(true);
        expect(data.result[0]).to.be.equals(1);
        expect(data.result[1]).to.be.equals(2);
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
        expect(status).to.be.equals(200);
        expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
        expect(headers['content-length']).to.be.equals("31");
        expect(data.success).to.be.equals(true);
        expect(data.result[0]).to.be.equals(1);
        expect(data.result[1]).to.be.equals(2);
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
        expect(status).to.be.equals(200);
        expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
        expect(headers['content-length']).to.be.equals("31");
        expect(data.success).to.be.equals(true);
        expect(data.result[0]).to.be.equals(1);
        expect(data.result[1]).to.be.equals(2);
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
        expect(status).to.be.equals(200);
        expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
        expect(headers['content-length']).to.be.equals("27");
        expect(data.success).to.be.equals(true);
        expect(data.result).to.be.equals(1);
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
        expect(status).to.be.equals(500);
        expect(headers['content-type']).to.be.equals("text/html; charset=utf-8");
        // expect(headers['content-length']).to.be.equals("27");
        expect(data.success).to.be.equals(undefined);
        expect(data.result).to.be.equals(undefined);
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
        expect(status).to.be.equals(400);
        expect(headers['content-type']).to.be.equals("application/json; charset=utf-8");
        // expect(headers['content-length']).to.be.equals("27");
        expect(data.success).to.be.equals(false);
        expect(data.message).to.be.equals("asd");
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
        expect(status).to.be.equals(500);
        expect(headers['content-type']).to.be.equals("text/html; charset=utf-8");
        // expect(headers['content-length']).to.be.equals("27");
        expect(data.success).to.be.equals(undefined);
        expect(data.message).to.be.equals(undefined);
        expect(dCallCount).to.be.equals(1);
        done();
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
      .expect('Content-Type', /json/)
      // .expect('Content-Length', '3571')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(true);
          expect(res.body.result).to.be.equals("hello\n");
          done();
        }
      });
  });*/
});
