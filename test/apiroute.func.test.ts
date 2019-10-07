import { describe, it } from "mocha";
import { expect } from "chai";
import * as express from "express";
import * as sinon from "sinon";
import * as path from "path";
import * as request from "supertest";
import { Util, ParseOptionsError } from "miqro-core";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");
Util.loadConfig();

describe("apiroute functional tests", () => {
  it("apiroute createServiceHandler happy path catches ParseOptionsError as 400", (done) => {
    const { APIRoute, createServiceHandler } = require("../src/");
    const service = new class {
      bla: string;
      constructor() {
        this.bla = "myerror";
      }
      async myFunc() {
        throw new ParseOptionsError(this.bla);
      }
    }
    const app = express();
    const api = new APIRoute();
    api.get("/myFunc", createServiceHandler(service, "myFunc", api.logger));
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc')
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
  it("apiroute createServiceFunctionHandler happy path agregates results", (done) => {
    const { APIRoute, createServiceFunctionHandler, createResponseHandler } = require("../src/");
    const service = new class {
      bla: number;
      constructor() {
        this.bla = 0;
      }
      async myFunc() {
        return ++this.bla;
      }
    }
    const app = express();
    const api = new APIRoute();
    api.get("/myFunc", [
      createServiceFunctionHandler(service, "myFunc", api.logger),
      createServiceFunctionHandler(service, "myFunc", api.logger),
      createResponseHandler(api.logger)
    ]);
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc')
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
  it("apiroute createServiceFunctionHandler happy path agregates results to one if only one result", (done) => {
    const { APIRoute, createServiceFunctionHandler, createResponseHandler } = require("../src/");
    const service = new class {
      bla: number;
      constructor() {
        this.bla = 0;
      }
      async myFunc() {
        return ++this.bla;
      }
    }
    const app = express();
    const api = new APIRoute();
    api.get("/myFunc", [
      createServiceFunctionHandler(service, "myFunc", api.logger),
      createResponseHandler(api.logger)
    ]);
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc')
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
