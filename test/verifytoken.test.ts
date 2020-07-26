import {after, before, describe, it} from 'mocha';
import {expect} from 'chai';
import * as express from "express";

process.env.TOKEN_HEADER = "Authorization";

describe(`verifytokenendpointservice func tests`, () => {
  for (const TOKENVARS of [
    {
      location: "header",
      locationRef: "Authorization"
    },
    {
      location: "query",
      locationRef: "token"
    }
  ]) {
    describe(`verifytokenendpointservice [${TOKENVARS.location}]func tests`, () => {
      let fakeAuthServer = null;
      let server = null;
      const fakeSession1 = {
        username: "usera",
        account: "ble",
        groups: ["aldf", "sd2"]
      };
      const fakeSecret = "secret";
      const jwt = require("jsonwebtoken");
      const goodToken1 = jwt.sign(fakeSession1, fakeSecret);

      let fakeValidate = null;

      before((done) => {
        (async () => {
          fakeAuthServer = express();
          fakeAuthServer.get("/validate", (req, res) => {
            fakeValidate(req, res);
          });
          server = fakeAuthServer.listen(9999);
          process.env.TOKEN_VERIFY_LOCATION = TOKENVARS.location;
          process.env.TOKEN_LOCATION = TOKENVARS.location;
          if (TOKENVARS.location === "header") {
            process.env.TOKEN_HEADER = TOKENVARS.locationRef;
          } else {
            process.env.TOKEN_QUERY = TOKENVARS.locationRef;
          }
          process.env.TOKEN_VERIFY_ENDPOINT = "http://localhost:9999/validate";
          process.env.TOKEN_VERIFY_ENDPOINT_METHOD = "GET";
          process.env.LOG_LEVEL = "debug";
        })().then(done).catch(done);
      });

      after((done) => {
        (async () => {
          await server.close();
        })().then(done).catch(done);
      });

      it("happy path mix tape 1 valid auth", (done) => {
        (async () => {
          const {VerifyJWTEndpointService} = require("../src");
          fakeValidate = (req, res) => {
            const token = TOKENVARS.location === "header" ?
              req.headers[process.env.TOKEN_HEADER.toLowerCase()] :
              req.query[process.env.TOKEN_QUERY];
            expect(token).to.be.equals(goodToken1);
            const verified = jwt.verify(token, fakeSecret);
            expect(verified.username).to.be.equals(fakeSession1.username);
            expect(verified.account).to.be.equals(fakeSession1.account);
            expect(verified.groups.length).to.be.equals(fakeSession1.groups.length);
            expect(verified.groups[0]).to.be.equals(fakeSession1.groups[0]);
            expect(verified.groups[1]).to.be.equals(fakeSession1.groups[1]);
            expect(verified.token).to.be.equals(undefined);
            res.sendStatus(200);
          };
          const instance = VerifyJWTEndpointService.getInstance();
          const args = {
            token: goodToken1
          };
          const session = await instance.verify(args);
          expect(session.username).to.be.equals(fakeSession1.username);
          expect(session.account).to.be.equals(fakeSession1.account);
          expect(session.groups.length).to.be.equals(fakeSession1.groups.length);
          expect(session.groups[0]).to.be.equals(fakeSession1.groups[0]);
          expect(session.groups[1]).to.be.equals(fakeSession1.groups[1]);
          expect(session.token).to.be.equals(args.token);
        })().then(done).catch(done);
      });
    });
  }
});
