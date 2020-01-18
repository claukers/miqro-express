import {describe, it} from "mocha";
import {expect} from "chai";
import * as express from "express";
import * as sinon from "sinon";
import * as path from "path";
import * as request from "supertest";
import {Util, ParseOptionsError} from "miqro-core";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");
Util.loadConfig();

describe("apiroute functional tests", () => {
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
  it("Handler happy path agregates results", (done) => {
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
});
