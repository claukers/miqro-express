import {describe, it} from "mocha";
import {expect} from "chai";
import * as express from "express";
import * as sinon from "sinon";
import * as request from "supertest";


describe("session functional tests", () => {
  for (const TOKENVARS of [
    {
      location: "header",
      locationRef: "TOKEN_HEADER"
    }, {
      location: "query",
      locationRef: "TOKEN"
    }]) {

    it(`createSessionHandler [${TOKENVARS.location}] happy path allow pass through`, (done) => {
      (async () => {
        process.env.TOKEN_LOCATION = TOKENVARS.location;
        if (TOKENVARS.location === "header") {
          process.env.TOKEN_HEADER = TOKENVARS.locationRef;
        } else {
          process.env.TOKEN_QUERY = TOKENVARS.locationRef;
        }
        const {SessionHandler} = require("../src/");

        const fakeToken = "FakeToken";
        const fakeSession = "FakeSession";

        const app = express();
        const authService = {
          verify: sinon.fake(async ({token}) => {
            expect(token).to.be.equals(fakeToken);
            return fakeSession;
          })
        };
        const finalHandler = sinon.fake((req, res) => {
          expect(req.session).to.be.equals(fakeSession);
          res.json(true);
        });
        app.get("/user", [SessionHandler(authService), finalHandler]);
        const response = (TOKENVARS.location === "header" ?
          await new Promise((resolve, reject) => {
            request(app)
              .get('/user')
              .set({[`${TOKENVARS.locationRef}`]: fakeToken})
              .expect('Content-Type', /json/)
              .expect('Content-Length', '4')
              .expect(200)
              .end((err, res) => {
                if (err) reject(err);
                else {
                  resolve(res);
                }
              });
          }) :
          await new Promise((resolve, reject) => {
            request(app)
              .get(`/user?${TOKENVARS.locationRef}=${fakeToken}`)
              .expect('Content-Type', /json/)
              .expect('Content-Length', '4')
              .expect(200)
              .end((err, res) => {
                if (err) reject(err);
                else {
                  resolve(res);
                }
              });
          }));
        expect(finalHandler.callCount).to.be.equals(1);
        expect(authService.verify.callCount).to.be.equals(1);
      })().then(done).catch(done);
    });

    it(`createSessionHandler [${TOKENVARS.location}] happy path doesnt allow pass through is 401`, (done) => {
      (async () => {
        process.env.TOKEN_LOCATION = TOKENVARS.location;
        if (TOKENVARS.location === "header") {
          process.env.TOKEN_HEADER = TOKENVARS.locationRef;
        } else {
          process.env.TOKEN_QUERY = TOKENVARS.locationRef;
        }
        const {SessionHandler, ErrorHandler} = require("../src/");

        const fakeToken = "FakeToken";
        const fakeSession = null;

        const app = express();
        const authService = {
          verify: sinon.fake(async ({token}) => {
            expect(token).to.be.equals(fakeToken);
            return fakeSession;
          })
        };
        const finalHandler = sinon.fake((req, res) => {
          expect(req.session).to.be.equals(fakeSession);
          res.json(true);
        });
        app.get("/user", [SessionHandler(authService), finalHandler]);
        app.use(ErrorHandler());

        const response: any = (TOKENVARS.location === "header" ?
          await new Promise((resolve, reject) => {
            request(app)
              .get('/user')
              .set({[`${TOKENVARS.locationRef}`]: fakeToken})
              .expect('Content-Type', /json/)
              .expect('Content-Length', '57')
              .expect(401)
              .end((err, res) => {
                if (err) reject(err);
                else {
                  resolve(res);
                }
              });
          }) :
          await new Promise((resolve, reject) => {
            request(app)
              .get(`/user?${TOKENVARS.locationRef}=${fakeToken}`)
              .expect('Content-Type', /json/)
              .expect('Content-Length', '57')
              .expect(401)
              .end((err, res) => {
                if (err) reject(err);
                else {
                  resolve(res);
                }
              });
          }));
        expect(finalHandler.callCount).to.be.equals(0);
        expect(authService.verify.callCount).to.be.equals(1);
      })().then(done).catch(done);
    });

    it(`createSessionHandler [${TOKENVARS.location}] no token is 400`, (done) => {
      (async () => {
        process.env.TOKEN_LOCATION = TOKENVARS.location;
        if (TOKENVARS.location === "header") {
          process.env.TOKEN_HEADER = TOKENVARS.locationRef;
        } else {
          process.env.TOKEN_QUERY = TOKENVARS.locationRef;
        }
        const {SessionHandler, ErrorHandler} = require("../src/");

        const app = express();
        const authService = {
          verify: sinon.fake(async ({token}) => {
          })
        };
        const finalHandler = sinon.fake((req, res) => {
          res.json("asdlkjasdliasjdaijal");
        });
        app.get("/user", [SessionHandler(authService), finalHandler]);
        app.use(ErrorHandler());

        const response: any = (TOKENVARS.location === "header" ?
          await new Promise((resolve, reject) => {
            request(app)
              .get('/user')
              .expect('Content-Type', /json/)
              .expect('Content-Length', '48')
              .expect(400)
              .end((err, res) => {
                if (err) reject(err);
                else {
                  resolve(res);
                }
              });
          }) :
          await new Promise((resolve, reject) => {
            request(app)
              .get(`/user`)
              .expect('Content-Type', /json/)
              .expect('Content-Length', '48')
              .expect(400)
              .end((err, res) => {
                if (err) reject(err);
                else {
                  resolve(res);
                }
              });
          }));
        expect(finalHandler.callCount).to.be.equals(0);
        expect(authService.verify.callCount).to.be.equals(0);
      })().then(done).catch(done);
    });

    it("createSessionHandler verify throws is 401", (done) => {
      (async () => {
        process.env.TOKEN_LOCATION = TOKENVARS.location;
        if (TOKENVARS.location === "header") {
          process.env.TOKEN_HEADER = TOKENVARS.locationRef;
        } else {
          process.env.TOKEN_QUERY = TOKENVARS.locationRef;
        }
        const {SessionHandler, ErrorHandler} = require("../src/");

        const fakeToken = "FakeToken";

        const app = express();
        const authService = {
          verify: sinon.fake(async ({token}) => {
            throw {
              blaError: true
            }
          })
        };
        const finalHandler = sinon.fake((req, res) => {
          res.json("asdlkjasdliasjdaijal");
        });
        app.get("/user", [SessionHandler(authService), finalHandler]);
        app.use(ErrorHandler());

        const response: any = (TOKENVARS.location === "header" ?
          await new Promise((resolve, reject) => {
            request(app)
              .get('/user')
              .set({'TOKEN_HEADER': fakeToken})
              .expect('Content-Type', /json/)
              .expect('Content-Length', '57')
              .expect(401)
              .end((err, res) => {
                if (err) reject(err);
                else {
                  resolve(res);
                }
              });
          }) :
          await new Promise((resolve, reject) => {
            request(app)
              .get(`/user?${TOKENVARS.locationRef}=${fakeToken}`)
              .set({'TOKEN_HEADER': fakeToken})
              .expect('Content-Type', /json/)
              .expect('Content-Length', '57')
              .expect(401)
              .end((err, res) => {
                if (err) reject(err);
                else {
                  resolve(res);
                }
              });
          }));
        expect(finalHandler.callCount).to.be.equals(0);
        expect(authService.verify.callCount).to.be.equals(1);
      })().then(done).catch(done);
    });
  }
});
