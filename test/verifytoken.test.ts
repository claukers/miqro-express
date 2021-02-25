import { after, before, describe, it } from 'mocha';
import { strictEqual } from 'assert';
import { Server } from "http";
import { CookieParser } from "../src/middleware";
import { inspect } from 'util';
import { App, Context, Handler } from '../src';

process.env.TOKEN_HEADER = "Authorization";

describe(`verifytokenendpointservice func tests`, () => {
  for (const useOptions of [false, true]) {
    for (const TOKENVARS of [
      {
        location: "header",
        locationRef: "Authorization"
      },
      {
        location: "query",
        locationRef: "token"
      },
      {
        location: "cookie",
        locationRef: "bla"
      }
    ]) {
      const options = useOptions ? {
        tokenLocation: TOKENVARS.location,
        tokenLocationName: TOKENVARS.locationRef,
        url: "http://localhost:9999/validate",
        method: "GET"
      } : undefined;
      describe("verifytokenendpointservice functional tests using options " + inspect(options), () => {

        describe(`verifytokenendpointservice [${TOKENVARS.location}]func tests`, () => {
          let fakeAuthServer: App;
          let server: Server;
          const fakeSession1 = {
            username: "usera",
            account: "ble",
            groups: ["aldf", "sd2"]
          };
          const fakeSession2 = {
            username: "usera",
            account: "ble",
            groups: ["aldf"]
          };
          const fakeSecret = "secret";
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const jwt = require("jsonwebtoken");
          const goodToken1 = jwt.sign(fakeSession1, fakeSecret);
          const goodToken2 = jwt.sign(fakeSession2, fakeSecret);

          let fakeValidate: Handler;

          before((done) => {
            (async () => {
              fakeAuthServer = new App();
              fakeAuthServer.use(CookieParser());
              fakeAuthServer.get("/validate", async (ctx: Context) => {
                fakeValidate(ctx);
              });
              server = fakeAuthServer.listen(9999);
              if (useOptions) {
                process.env.TOKEN_VERIFY_LOCATION = undefined;
                process.env.TOKEN_HEADER = undefined;
                process.env.TOKEN_QUERY = undefined;
                process.env.TOKEN_COOKIE = undefined;
                process.env.TOKEN_VERIFY_ENDPOINT = undefined;
                process.env.TOKEN_VERIFY_ENDPOINT_METHOD = undefined;
              } else {
                process.env.TOKEN_VERIFY_LOCATION = TOKENVARS.location;
                process.env.TOKEN_LOCATION = TOKENVARS.location;
                switch (TOKENVARS.location) {
                  case "header":
                    process.env.TOKEN_HEADER = TOKENVARS.locationRef;
                    break;
                  case "query":
                    process.env.TOKEN_QUERY = TOKENVARS.locationRef;
                    break;
                  case "cookie":
                    process.env.TOKEN_COOKIE = TOKENVARS.locationRef;
                    break;
                }
                process.env.TOKEN_VERIFY_ENDPOINT = "http://localhost:9999/validate";
                process.env.TOKEN_VERIFY_ENDPOINT_METHOD = "GET";
              }
              process.env.LOG_LEVEL = "debug";
            })().then(done).catch(done);
          });

          after((done) => {
            (async () => {
              await server.close();
            })().then(done).catch(done);
          });

          it(`happy path [${TOKENVARS.location}] mix tape 1 valid auth`, (done) => {
            (async () => {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const { VerifyJWTEndpointService } = require("../src");
              fakeValidate = async (ctx: Context) => {
                let token;
                switch (TOKENVARS.location) {
                  case "header":
                    token = ctx.headers[(options ? options.tokenLocationName : process.env.TOKEN_HEADER as string).toLowerCase()];
                    break;
                  case "query":
                    token = ctx.query[options ? options.tokenLocationName : process.env.TOKEN_QUERY as string];
                    break;
                  case "cookie":
                    token = ctx.cookies[options ? options.tokenLocationName : process.env.TOKEN_COOKIE as string] as string;
                    break;
                }
                strictEqual(token, goodToken1);
                const verified = jwt.verify(token, fakeSecret);
                strictEqual(verified.username, fakeSession1.username);
                strictEqual(verified.account, fakeSession1.account);
                strictEqual(verified.groups.length, fakeSession1.groups.length);
                strictEqual(verified.groups[0], fakeSession1.groups[0]);
                strictEqual(verified.groups[1], fakeSession1.groups[1]);
                strictEqual(verified.token, undefined);
                ctx.res.statusCode = 200;
                ctx.res.end();
              };
              const instance = new VerifyJWTEndpointService(options);
              const args = {
                token: goodToken1,
                ctx: {
                  logger: console as any
                }
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

          it(`happy path [${TOKENVARS.location}] mix tape 1 valid auth with token update`, (done) => {
            (async () => {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const { VerifyJWTEndpointService } = require("../src");
              fakeValidate = async (ctx: Context) => {
                let token;
                switch (TOKENVARS.location) {
                  case "header":
                    token = ctx.headers[(options ? options.tokenLocationName : process.env.TOKEN_HEADER as string).toLowerCase()];
                    break;
                  case "query":
                    token = ctx.query[options ? options.tokenLocationName : process.env.TOKEN_QUERY as string];
                    break;
                  case "cookie":
                    token = ctx.cookies[options ? options.tokenLocationName : process.env.TOKEN_COOKIE as string] as string;
                    ctx.setCookie(options ? options.tokenLocationName : process.env.TOKEN_COOKIE as string, goodToken2, {
                      httpOnly: true
                    });
                    break;
                }
                strictEqual(token, goodToken1);
                const verified = jwt.verify(token, fakeSecret);
                strictEqual(verified.username, fakeSession1.username);
                strictEqual(verified.account, fakeSession1.account);
                strictEqual(verified.groups.length, fakeSession1.groups.length);
                strictEqual(verified.groups[0], fakeSession1.groups[0]);
                strictEqual(verified.groups[1], fakeSession1.groups[1]);
                strictEqual(verified.token, undefined);
                ctx.res.statusCode = 200;
                ctx.res.end();
              };
              const instance = new VerifyJWTEndpointService(options);
              const args = {
                token: goodToken1,
                ctx: {
                  logger: console as any
                }
              };
              const session = await instance.verify(args);
              strictEqual(session.username, fakeSession1.username);
              strictEqual(session.account, fakeSession1.account);
              strictEqual(session.groups.length, fakeSession1.groups.length);
              strictEqual(session.groups[0], fakeSession1.groups[0]);
              strictEqual(session.groups[1], fakeSession1.groups[1]);
              strictEqual(session.token, TOKENVARS.location === "cookie" ? goodToken2 : args.token);
            })().then(done).catch(done);
          });
        });
      });
    }
  }
});
