import {describe, it} from "mocha";
import {expect} from "chai";
import express from "express";
import {fake, FuncTestHelper} from "./func_test_helper";

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
          verify: fake(async ({token}: { token: any }) => {
            expect(token).to.be.equals(fakeToken);
            return fakeSession;
          })
        };
        const finalHandler = fake((req: any, res: any) => {
          expect(req.session).to.be.equals(fakeSession);
          res.json(true);
        });
        app.get("/user", [SessionHandler(authService), finalHandler]);
        const response = (TOKENVARS.location === "header" ?
          await new Promise((resolve, reject) => {
            FuncTestHelper({
              app,
              url: "/user",
              method: "get",
              headers: {
                [`${TOKENVARS.locationRef}`]: fakeToken
              }
            }, (res) => {
              try {
                expect(res.headers["content-type"]).to.be.equals("application/json; charset=utf-8");
                expect(res.headers["content-length"]).to.be.equals("4");
                expect(res.status).to.be.equals(200);
                resolve(res);
              } catch (e) {
                reject(e);
              }
            });
          }) :
          await new Promise((resolve, reject) => {
            FuncTestHelper({
              app,
              url: `/user?${TOKENVARS.locationRef}=${fakeToken}`,
              method: "get",
            }, (res) => {
              try {
                expect(res.headers["content-type"]).to.be.equals("application/json; charset=utf-8");
                expect(res.headers["content-length"]).to.be.equals("4");
                expect(res.status).to.be.equals(200);
                resolve(res);
              } catch (e) {
                reject(e);
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
          verify: fake(async ({token}: any) => {
            expect(token).to.be.equals(fakeToken);
            return fakeSession;
          })
        };
        const finalHandler = fake((req: any, res: any) => {
          expect(req.session).to.be.equals(fakeSession);
          res.json(true);
        });
        app.get("/user", [SessionHandler(authService), finalHandler]);
        app.use(ErrorHandler());

        const response: any = (TOKENVARS.location === "header" ?
          await new Promise((resolve, reject) => {
            FuncTestHelper({
              app,
              url: "/user",
              method: "get",
              headers: {
                [`${TOKENVARS.locationRef}`]: fakeToken
              }
            }, (res) => {
              try {
                expect(res.headers["content-type"]).to.be.equals("application/json; charset=utf-8");
                expect(res.headers["content-length"]).to.be.equals("57");
                expect(res.status).to.be.equals(401);
                resolve(res);
              } catch (e) {
                reject(e);
              }
            });
          }) :
          await new Promise((resolve, reject) => {
            FuncTestHelper({
              app,
              url: `/user?${TOKENVARS.locationRef}=${fakeToken}`,
              method: "get",
            }, (res) => {
              try {
                expect(res.headers["content-type"]).to.be.equals("application/json; charset=utf-8");
                expect(res.headers["content-length"]).to.be.equals("57");
                expect(res.status).to.be.equals(401);
                resolve(res);
              } catch (e) {
                reject(e);
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
          verify: fake(async ({token}: any) => {
          })
        };
        const finalHandler = fake((req: any, res: any) => {
          res.json("asdlkjasdliasjdaijal");
        });
        app.get("/user", [SessionHandler(authService), finalHandler]);
        app.use(ErrorHandler());

        const response: any = (TOKENVARS.location === "header" ?
          await new Promise((resolve, reject) => {
            FuncTestHelper({
              app,
              url: `/user`,
              method: "get",
            }, (res) => {
              try {
                expect(res.headers["content-type"]).to.be.equals("application/json; charset=utf-8");
                expect(res.headers["content-length"]).to.be.equals("48");
                expect(res.status).to.be.equals(400);
                resolve(res);
              } catch (e) {
                reject(e);
              }
            });
          }) :
          await new Promise((resolve, reject) => {
            FuncTestHelper({
              app,
              url: `/user`,
              method: "get",
            }, (res) => {
              try {
                expect(res.headers["content-type"]).to.be.equals("application/json; charset=utf-8");
                expect(res.headers["content-length"]).to.be.equals("48");
                expect(res.status).to.be.equals(400);
                resolve(res);
              } catch (e) {
                reject(e);
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
          verify: fake(async ({token}: any) => {
            throw {
              blaError: true
            }
          })
        };
        const finalHandler = fake((req: any, res: any) => {
          res.json("asdlkjasdliasjdaijal");
        });
        app.get("/user", [SessionHandler(authService), finalHandler]);
        app.use(ErrorHandler());

        const response: any = (TOKENVARS.location === "header" ?
          await new Promise((resolve, reject) => {
            FuncTestHelper({
              app,
              url: "/user",
              method: "get",
              headers: {
                [`${TOKENVARS.locationRef}`]: fakeToken
              }
            }, (res) => {
              try {
                expect(res.headers["content-type"]).to.be.equals("application/json; charset=utf-8");
                expect(res.headers["content-length"]).to.be.equals("57");
                expect(res.status).to.be.equals(401);
                resolve(res);
              } catch (e) {
                reject(e);
              }
            });
          }) :
          await new Promise((resolve, reject) => {
            FuncTestHelper({
              app,
              url: `/user?${TOKENVARS.locationRef}=${fakeToken}`,
              method: "get",
            }, (res) => {
              try {
                expect(res.headers["content-type"]).to.be.equals("application/json; charset=utf-8");
                expect(res.headers["content-length"]).to.be.equals("57");
                expect(res.status).to.be.equals(401);
                resolve(res);
              } catch (e) {
                reject(e);
              }
            });
          }));
        expect(finalHandler.callCount).to.be.equals(0);
        expect(authService.verify.callCount).to.be.equals(1);
      })().then(done).catch(done);
    });
  }
});
