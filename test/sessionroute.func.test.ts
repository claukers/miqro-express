import { describe, it } from "mocha";
import { expect } from "chai";
import { Util } from "miqro-core";
import * as express from "express";
import * as path from "path";
import * as sinon from "sinon";
import * as request from "supertest";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");
Util.loadConfig();

describe("session functional tests", () => {
  it("SessionRoute happy path allow pass through", (done) => {
    const { SessionRoute, setupMiddleware } = require("../src/");

    const fakeToken = "FakeToken";
    const fakeSession = "FakeSession";
    process.env.TOKEN_HEADER = "token";

    const logger = Util.getLogger("test");
    setupMiddleware(express(), logger).then((app) => {
      const authService = {
        verify: sinon.fake(async ({ token }) => {
          expect(token).to.be.equals(fakeToken);
          return fakeSession;
        })
      };
      const finalHandler = sinon.fake((req, res) => {
        expect(req.session).to.be.equals(fakeSession);
        res.json(true);
      });
      const sessionRouter = new SessionRoute({
        authService
      });
      sessionRouter.get("/user", finalHandler);
      app.use(sessionRouter.routes());

      request(app)
        .get('/user')
        .set({ 'token': fakeToken })
        .expect('Content-Type', /json/)
        .expect('Content-Length', '4')
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          expect(finalHandler.callCount).to.be.equals(1);
          expect(authService.verify.callCount).to.be.equals(1);
          done();
        });
    });
  });

  it("SessionRoute happy path doesnt allow pass through is 401", (done) => {
    const { SessionRoute } = require("../src/");

    const fakeToken = "FakeToken";
    const fakeSession = null;
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const authService = {
      verify: sinon.fake(async ({ token }) => {
        expect(token).to.be.equals(fakeToken);
        return fakeSession;
      })
    };
    const finalHandler = sinon.fake((req, res) => {
      expect(req.session).to.be.equals(fakeSession);
      res.json(true);
    });
    const sessionRouter = new SessionRoute({
      authService
    });
    sessionRouter.get("/user", finalHandler);
    app.use(sessionRouter.routes());

    request(app)
      .get('/user')
      .set({ 'TOKEN_HEADER': fakeToken })
      .expect('Content-Type', /json/)
      .expect('Content-Length', '56')
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(finalHandler.callCount).to.be.equals(0);
          expect(authService.verify.callCount).to.be.equals(1);
          done();
        }
      });
  });

  it("SessionRoute no token is 400", (done) => {
    const { SessionRoute } = require("../src/");

    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const authService = {
      verify: sinon.fake(async ({ token }) => {
      })
    };
    const finalHandler = sinon.fake((req, res) => {
      res.json("asdlkjasdliasjdaijal");
    });
    const sessionRouter = new SessionRoute({
      authService
    });
    sessionRouter.get("/user", finalHandler);
    app.use(sessionRouter.routes());

    request(app)
      .get('/user')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '48')
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(finalHandler.callCount).to.be.equals(0);
          expect(authService.verify.callCount).to.be.equals(0);
          done();
        }
      });
  });

  it("SessionRoute verify throws is 401", (done) => {
    const { SessionRoute } = require("../src/");

    const fakeToken = "FakeToken";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const authService = {
      verify: sinon.fake(async ({ token }) => {
        throw {
          blaError: true
        }
      })
    };
    const finalHandler = sinon.fake((req, res) => {
      res.json("asdlkjasdliasjdaijal");
    });
    const sessionRouter = new SessionRoute({
      authService
    });
    sessionRouter.get("/user", finalHandler);
    app.use(sessionRouter.routes());

    request(app)
      .get('/user')
      .set({ 'TOKEN_HEADER': fakeToken })
      .expect('Content-Type', /json/)
      .expect('Content-Length', '57')
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(finalHandler.callCount).to.be.equals(0);
          expect(authService.verify.callCount).to.be.equals(1);
          done();
        }
      });
  });
});
