import {after, before, describe, it} from 'mocha';
import {strictEqual} from 'assert';
import express, {Express} from "express";
import {Server} from "http";

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
      let fakeAuthServer: Express;
      let server: Server;
      const fakeSession1 = {
        username: "usera",
        account: "ble",
        groups: ["aldf", "sd2"]
      };
      const fakeSecret = "secret";
      const jwt = require("jsonwebtoken");
      const goodToken1 = jwt.sign(fakeSession1, fakeSecret);

      let fakeValidate: any = null;

      before((done) => {
        (async () => {
          fakeAuthServer = express();
          fakeAuthServer.get("/validate", (req: any, res: any) => {
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
          fakeValidate = (req: any, res: any) => {
            const token = TOKENVARS.location === "header" ?
              req.headers[(process.env.TOKEN_HEADER as string).toLowerCase()] :
              req.query[process.env.TOKEN_QUERY as string];
            strictEqual(token, goodToken1);
            const verified = jwt.verify(token, fakeSecret);
            strictEqual(verified.username, fakeSession1.username);
            strictEqual(verified.account, fakeSession1.account);
            strictEqual(verified.groups.length, fakeSession1.groups.length);
            strictEqual(verified.groups[0], fakeSession1.groups[0]);
            strictEqual(verified.groups[1], fakeSession1.groups[1]);
            strictEqual(verified.token, undefined);
            res.sendStatus(200);
          };
          const instance = VerifyJWTEndpointService.getInstance();
          const args = {
            token: goodToken1
          };
          const session = await instance.verify(args);
          strictEqual(session.username, fakeSession1.username);
          strictEqual(session.account, fakeSession1.account);
          strictEqual(session.groups.length, fakeSession1.groups.length);
          strictEqual(session.groups[0], fakeSession1.groups[0]);
          strictEqual(session.groups[1], fakeSession1.groups[1]);
          strictEqual(session.token, args.token);
        })().then(done).catch(done);
      });
    });
  }
});
