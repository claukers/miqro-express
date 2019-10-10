import { describe, it } from "mocha";
import { expect } from "chai";
import * as express from "express";
import * as sinon from "sinon";
import * as request from "supertest";


describe("session functional tests", () => {
  it("createSessionHandler happy path allow pass through", (done) => {
    const { createSessionHandler } = require("../src/");

    const fakeToken = "FakeToken";
    const fakeSession = "FakeSession";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const authService = {
      verify: sinon.fake(async ({ token }) => {
        expect(token).to.be.equals(fakeToken);
        return fakeSession;
      })
    };
    const logger = {
      info: (text: string) => {
        console.log(text);
      },
      error: (text: string) => {
        done(text);
      }
    };
    const finalHandler = sinon.fake((req, res) => {
      expect(req.session).to.be.equals(fakeSession);
      res.json(true);
    });
    app.get("/user", [createSessionHandler(authService, logger), finalHandler]);

    request(app)
      .get('/user')
      .set({ 'TOKEN_HEADER': fakeToken })
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

  it("createSessionHandler happy path doesnt allow pass through is 401", (done) => {
    const { createSessionHandler } = require("../src/");

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
    const logger = {
      info: (text: string) => {
        console.log(text);
      },
      warn: (text: string) => {
        console.warn(text);
      },
      error: (text: string) => {
        console.error(text);
      }
    };
    const finalHandler = sinon.fake((req, res) => {
      expect(req.session).to.be.equals(fakeSession);
      res.json(true);
    });
    app.get("/user", [createSessionHandler(authService, logger), finalHandler]);

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

  it("createSessionHandler no token is 400", (done) => {
    const { createSessionHandler } = require("../src/");

    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const authService = {
      verify: sinon.fake(async ({ token }) => {
      })
    };
    const logger = {
      info: (text: string) => {
        console.log(text);
      },
      warn: (text: string) => {
        console.warn(text);
      },
      error: (text: string) => {
        console.error(text);
      }
    };
    const finalHandler = sinon.fake((req, res) => {
      res.json("asdlkjasdliasjdaijal");
    });
    app.get("/user", [createSessionHandler(authService, logger), finalHandler]);

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

  it("createSessionHandler verify throws is 401", (done) => {
    const { createSessionHandler } = require("../src/");
    
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
    const logger = {
      info: (text: string) => {
        console.log(text);
      },
      warn: (text: string) => {
        console.warn(text);
      },
      error: sinon.fake((e) => {
        // expect(e.blaError).to.be.equals(true);
        console.error(e);
      })
    };
    const finalHandler = sinon.fake((req, res) => {
      res.json("asdlkjasdliasjdaijal");
    });
    app.get("/user", [createSessionHandler(authService, logger), finalHandler]);

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
          expect(logger.error.callCount).to.be.equals(2);
          done();
        }
      });
  });
});
