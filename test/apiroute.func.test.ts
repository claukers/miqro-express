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
  it("apiroute createServiceHandler with preroute happy path", (done) => {
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
    api.use("/", createServiceHandler(service, "myFunc", api.logger, {
      options: {
        preRoute: "/myFunc",
        allowedMethods: ["GET"]
      }
    }));
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
  it("apiroute createServiceHandler with preroute happy path 404 by method", (done) => {
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
    api.use("/", createServiceHandler(service, "myFunc", api.logger, {
      options: {
        preRoute: "/myFunc",
        allowedMethods: ["GET"]
      }
    }));
    app.use("/api", api.routes());

    request(app)
      .post('/api/myFunc')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '39')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(false);
          expect(res.body.result).to.be.equals(undefined);
          done();
        }
      });
  });
  it("apiroute createServiceHandler with preroute 404", (done) => {
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
    api.use("/", createServiceHandler(service, "myFunc", api.logger, {
      options: {
        preRoute: "/myFun",
        allowedMethods: ["GET"]
      }
    }));
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc')
      .expect('Content-Type', /text\/html; charset=utf-8/)
      .expect('Content-Length', '149')
      .expect(404)
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
  it("apiroute createServiceFunctionHandler happy path agregates results to one if only one result with preroute", (done) => {
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
    const myFuncRouter = new APIRoute({
      preRoute: "/bla"
    });
    myFuncRouter.use(undefined, [
      createServiceFunctionHandler(service, "myFunc", api.logger),
      createResponseHandler(api.logger)
    ]);
    api.use("/myFunc", myFuncRouter.routes());
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc/bla')
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
  it("apiroute createServiceFunctionHandler happy path agregates results to one if only one result with preroute of router", (done) => {
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
    const secondRouter = new APIRoute({
      preRoute: "/bla"
    });
    const myFuncRouter = new APIRoute();
    myFuncRouter.use(undefined, [
      createServiceFunctionHandler(service, "myFunc", api.logger),
      createResponseHandler(api.logger)
    ]);
    secondRouter.use(undefined, myFuncRouter.routes());
    api.use("/myFunc", secondRouter.routes());
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc/bla')
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
  it("apiroute createServiceFunctionHandler happy path agregates results with preroute of router", (done) => {
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
    const secondRouter = new APIRoute({
      preRoute: "/bla"
    });
    const myFuncRouter = new APIRoute({
      preRoute: "/ble"
    });
    myFuncRouter.get("/sum", [
      createServiceFunctionHandler(service, "myFunc", api.logger)
    ]);
    const finalHandler = async (req, res) => {
      res.json({
        result: "bla"
      })
    };
    secondRouter.use(undefined, [myFuncRouter.routes(), finalHandler]);
    api.use("/myFunc", secondRouter.routes());
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc/bla/ble/sum')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '16')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(undefined);
          expect(res.body.result).to.be.equals("bla");
          done();
        }
      });
  });
  it("apiroute createServiceFunctionHandler happy path agregates results with preroute of router cas 3", (done) => {
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
    const secondRouter = new APIRoute({
      preRoute: "/bla"
    });
    const myFuncRouter = new APIRoute({
      preRoute: "/ble"
    });
    myFuncRouter.use(undefined, [
      createServiceFunctionHandler(service, "myFunc", api.logger)
    ]);
    const finalHandler = async (req, res) => {
      res.json({
        result: "bla"
      })
    };
    secondRouter.use(undefined, [myFuncRouter.routes(), finalHandler]);
    api.use("/myFunc", secondRouter.routes());
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc/bla/ble')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '16')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(undefined);
          expect(res.body.result).to.be.equals("bla");
          done();
        }
      });
  });
  it("apiroute createServiceFunctionHandler happy path agregates results with preroute of router 404", (done) => {
    const { APIRoute, createServiceFunctionHandler } = require("../src/");

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
    const secondRouter = new APIRoute({
      preRoute: "/bla"
    });
    const myFuncRouter = new APIRoute({
      preRoute: "/ble"
    });

    const finalHandler = async (req, res) => {
      res.json({
        result: "bla"
      })
    };
    myFuncRouter.get("/sum", [createServiceFunctionHandler(service, "myFunc", api.logger), finalHandler]);
    secondRouter.use(undefined, [myFuncRouter.routes()]);
    api.use("/myFunc", secondRouter.routes());
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc/bla/sum')
      .expect('Content-Type', /text\/html; charset=utf-8/)
      .expect('Content-Length', '157')
      .expect(404)
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
  it("case 2 apiroute createServiceFunctionHandler happy path agregates results with preroute of router should throw 404", (done) => {
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
    const finalHandler = async (req, res) => {
      res.json({
        result: "bla"
      })
    };
    const app = express();
    const api = new APIRoute();
    const secondRouter = new APIRoute({
      preRoute: "/bla"
    });
    const thirdRouter = new APIRoute({
      preRoute: "/ble"
    });
    const myFuncRouter = new APIRoute({
      preRoute: "/bli"
    });
    myFuncRouter.get("/sum", [createServiceFunctionHandler(service, "myFunc", api.logger), finalHandler]);
    thirdRouter.use(undefined, [myFuncRouter.routes(), createResponseHandler(api.logger)]);
    secondRouter.use(undefined, [thirdRouter.routes(), createResponseHandler(api.logger)]);
    api.use("/myFunc", [secondRouter.routes(), createResponseHandler(api.logger)]);
    app.use("/api", api.routes());

    request(app)
      .get('/api/myFunc/bla/ble/bli/sum/a')
      .expect('Content-Type', /text\/html; charset=utf-8/)
      .expect('Content-Length', '167')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(undefined);
          expect(res.body.message).to.be.equals(undefined);
          done();
        }
      });
  });
  it("error handler test", (done) => {
    const { APIRoute, createAPIHandler, APIResponse } = require("../src/");

    const app = express();

    app.use("/bla", createAPIHandler(async (req, res, next) => {
      throw new Error("bli");
    }, {
      error: (text) => {
      }
    }, {
      options: {
        errorResponse: async (e: Error, req) => {
          expect(e.message).to.be.equals("bli");
          return new class extends APIResponse {
            constructor(body?) {
              super(body);
              this.status = 555;
              this.body = { bla: "ble" };
            }
          }
        }
      }
    }));

    request(app)
      .get('/bla')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '13')
      .expect(555)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.bla).to.be.equals("ble");
          done();
        }
      });
  });
});
