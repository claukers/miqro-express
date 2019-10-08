import { describe, it } from "mocha";
import { expect } from "chai";
import * as express from "express";
import * as sinon from "sinon";
import * as path from "path";
import * as request from "supertest";
import { Util, ParseOptionsError } from "miqro-core";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");
Util.loadConfig();

describe("route functional tests", () => {
  it("route this.use uses preRoute but doesnt pass params to embemed route", (done) => {
    const { Route, createAPIHandler, createServiceFunctionHandler } = require("../src/");
    const app = express();
    const options = {
      preRoute: "/:blaId/ble"
    };
    const api = new Route();

    const service = new class {
      async get({ params }) {
        return "bla" + params.blaId;
      }
    }
    const fn = new Route();
    // Get All
    fn.get("/", createServiceFunctionHandler(service, "get", fn.logger));

    const modelRouter = new (class extends Route {
      constructor(options) {
        super(options);
        this.use(undefined, fn.routes())
      }
    })(options);
    api.router.use("/user", [
      modelRouter.routes(),
      createAPIHandler(async (req, res, next) => {
        res.json({
          instance: req.results[0]
        });
      }, this.logger)[0]
    ]);
    app.use(api.routes());

    request(app)
      .get('/user/1/ble')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '27')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.instance).to.be.equals("blaundefined");
          done();
        }
      });
  });
  it("route this.router.use doesnt use preRoute", (done) => {
    const { Route, createAPIHandler, createServiceFunctionHandler } = require("../src/");
    const app = express();
    const options = {
      preRoute: "/:blaId/ble"
    };
    const api = new Route();

    const service = new class {
      async get({ params }) {
        return "bla" + params.blaId;
      }
    }
    const fn = new Route(options);
    // Get All
    fn.get("/", createServiceFunctionHandler(service, "get", fn.logger));

    const modelRouter = new (class extends Route {
      constructor(options) {
        super(options);
        this.router.use(fn.routes())
      }
    })(options);
    api.router.use("/user", [
      modelRouter.routes(),
      createAPIHandler(async (req, res, next) => {
        res.json({
          instance: req.results[0]
        });
      }, this.logger)[0]
    ]);
    app.use(api.routes());

    request(app)
      .get('/user/1/ble')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '19')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.instance).to.be.equals("bla1");
          done();
        }
      });
  });
});
