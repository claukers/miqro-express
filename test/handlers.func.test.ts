import {describe, it} from "mocha";
import {expect} from "chai";
import * as express from "express";
import * as path from "path";
import * as request from "supertest";
import {ParseOptionsError, Util} from "@miqro/core";

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
    app.get("/myFunc", myFunc);
    app.use(ErrorHandler());

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '37')
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(false);
          expect(res.body.message).to.be.equals("myerror");
          done();
        }
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

    request(app)
      .get('/myFunc2')
      .expect('Content-Type', /html/)
      .expect('Content-Length', '146')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(Object.keys(res.body).length).to.be.equals(0);
          done();
        }
      });
  });
  it("ErrorHandler on unkown error is skipped", (done) => {
    const {ErrorHandler} = require("../src/");
    const myFunc = () => {
      throw Error("bla");
    };
    const app = express();
    app.get("/myFunc", myFunc);
    app.use(ErrorHandler());

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /html/)
      // .expect('Content-Length', '3337')
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(Object.keys(res.body).length).to.be.equals(0);
          done();
        }
      });
  });
  it("ErrorHandler on unkown error is skipped and passed to the next error handler", (done) => {
    const {ErrorHandler} = require("../src/");
    const myFunc = () => {
      throw Error("bla");
    };
    const app = express();
    app.get("/myFunc", myFunc);
    app.use(ErrorHandler());
    app.use((err, req, res, next) => {
      expect(err.message).to.be.equals("bla");
      res.status(500);
      res.json({
        bla: true
      });
    });

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '12')
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.bla).to.be.equals(true);
          done();
        }
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

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '31')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(true);
          expect(res.body.result[0]).to.be.equals(1);
          expect(res.body.result[1]).to.be.equals(2);
          done();
        }
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

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '31')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(true);
          expect(res.body.result[0]).to.be.equals(1);
          expect(res.body.result[1]).to.be.equals(2);
          done();
        }
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

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '31')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(true);
          expect(res.body.result[0]).to.be.equals(1);
          expect(res.body.result[1]).to.be.equals(2);
          done();
        }
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

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '31')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(true);
          expect(res.body.result[0]).to.be.equals(1);
          expect(res.body.result[1]).to.be.equals(2);
          done();
        }
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

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '31')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(true);
          expect(res.body.result[0]).to.be.equals(1);
          expect(res.body.result[1]).to.be.equals(2);
          done();
        }
      });
  });
  it("Handler happy path agregates results to one if only one result", (done) => {
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

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '27')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(true);
          expect(res.body.result).to.be.equals(1);
          done();
        }
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

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /html/)
      // .expect('Content-Length', '3571')
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(undefined);
          expect(res.body.result).to.be.equals(undefined);
          done();
        }
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

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /json/)
      // .expect('Content-Length', '3571')
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(false);
          expect(res.body.message).to.be.equals("asd");
          done();
        }
      });
  });

  it("Handler throws unkonen and  ErrorHandler ignores it", (done) => {
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
    app.use((e, req, res, next) => {
      dCallCount++;
      next(e);
    });

    request(app)
      .get('/myFunc')
      .expect('Content-Type', /html/)
      // .expect('Content-Length', '3571')
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(undefined);
          expect(res.body.message).to.be.equals(undefined);
          expect(dCallCount).to.be.equals(1);
          done();
        }
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
