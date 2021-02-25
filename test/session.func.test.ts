import { describe, it, beforeEach } from "mocha";
import { strictEqual } from "assert";
import { fake, RequestOptions } from "@miqro/core";
import { APIResponse, App, CookieParser, TestHelper as FuncTestHelper } from "../src";
import { inspect } from "util";

describe("session functional tests", () => {
  for (const useOptions of [false, true]) {
    for (const TOKENVARS of [
      {
        location: "header",
        locationRef: "TOKEN_HEADER",
      }, {
        location: "query",
        locationRef: "TOKEN"
      }, {
        location: "cookie",
        locationRef: "bla"
      }]) {

      const options = useOptions ? {
        tokenLocation: TOKENVARS.location,
        tokenLocationName: TOKENVARS.locationRef
      } : undefined;

      const getRequestConfig = (fakeToken?: string): RequestOptions => {
        let ret: any = null;
        switch (TOKENVARS.location) {
          case "header":
            process.env.TOKEN_HEADER = useOptions ? undefined : TOKENVARS.locationRef;
            ret = {
              url: "/user",
              method: "get",
              headers: fakeToken ? {
                [`${TOKENVARS.locationRef}`]: fakeToken
              } : undefined
            };
            break;
          case "query":
            process.env.TOKEN_QUERY = useOptions ? undefined : TOKENVARS.locationRef;
            ret = {
              url: "/user",
              method: "get",
              query: fakeToken ? {
                [TOKENVARS.locationRef]: fakeToken
              } : undefined
            };
            break;
          case "cookie":
            process.env.TOKEN_COOKIE = useOptions ? undefined : TOKENVARS.locationRef;
            ret = {
              url: "/user",
              method: "get",
              headers: fakeToken ? {
                Cookie: `${TOKENVARS.locationRef}=${fakeToken}; Path=/; HttpOnly;`
              } : undefined
            };
            break;
        }
        return ret as unknown as RequestOptions;
      };

      describe("session functional tests using options " + inspect(options), () => {
        let app: App;
        beforeEach(async () => {
          app = new App();
          app.use(CookieParser());
        });

        it(`createSessionHandler [${TOKENVARS.location}] happy path allow pass through update token with expiration`, (done) => {
          (async () => {
            process.env.TOKEN_LOCATION = TOKENVARS.location;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { SessionHandler } = require("../src/");

            const fakeToken = "FakeToken";
            const expDate = new Date(Date.now() + 100000);
            const fakeSession = {
              token: "newFakeToken",
              expires: expDate
            };

            const authService = {
              verify: fake(async ({ token }: { token: any }) => {
                strictEqual(token, fakeToken);
                return fakeSession;
              })
            };
            const finalHandler = fake(async (ctx: any) => {
              strictEqual(ctx.session.token, fakeSession.token);
              await new APIResponse(true).send(ctx);
            });

            app.get("/user", [SessionHandler({
              authService,
              options
            }), finalHandler]);

            await new Promise((resolve, reject) => {
              FuncTestHelper(app, getRequestConfig(fakeToken), (res) => {
                try {
                  strictEqual(res.headers["content-type"], "application/json; charset=utf-8");
                  strictEqual(res.headers["content-length"], "4");
                  strictEqual(res.status, 200);
                  strictEqual(finalHandler.callCount, 1);
                  strictEqual(authService.verify.callCount, 1);
                  if (TOKENVARS.location === "cookie") {
                    strictEqual((res as any).headers["set-cookie"].length, 1);
                    strictEqual((res as any).headers["set-cookie"][0], `${TOKENVARS.locationRef}=${fakeSession.token}; Path=/; Expires=${expDate.toUTCString()}; HttpOnly; Secure; SameSite=Strict`);
                  } else {
                    strictEqual((res as any).headers["set-cookie"], undefined);
                  }
                  resolve(res);
                } catch (e) {
                  reject(e);
                }
              });
            });

          })().then(done).catch(done);
        });

        it(`createSessionHandler [${TOKENVARS.location}] happy path allow pass through`, (done) => {
          (async () => {
            process.env.TOKEN_LOCATION = TOKENVARS.location;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { SessionHandler } = require("../src/");

            const fakeToken = "FakeToken";
            const fakeSession = {
              token: fakeToken
            };

            const authService = {
              verify: fake(async ({ token }: { token: any }) => {
                strictEqual(token, fakeToken);
                return fakeSession;
              })
            };
            const finalHandler = fake(async (ctx: any) => {
              strictEqual(ctx.session.token, fakeToken);
              await new APIResponse(true).send(ctx);
            });

            app.get("/user", [SessionHandler({
              authService, options
            }), finalHandler]);

            await new Promise((resolve, reject) => {
              FuncTestHelper(app, getRequestConfig(fakeToken), (res) => {
                try {
                  strictEqual(res.headers["content-type"], "application/json; charset=utf-8");
                  strictEqual(res.headers["content-length"], "4");
                  strictEqual(res.status, 200);
                  strictEqual(finalHandler.callCount, 1);
                  strictEqual(authService.verify.callCount, 1);
                  strictEqual((res as any).headers["set-cookie"], undefined);
                  resolve(res);
                } catch (e) {
                  reject(e);
                }
              });
            });

          })().then(done).catch(done);
        });


        it(`createSessionHandler [${TOKENVARS.location}] happy path allow pass through update token`, (done) => {
          (async () => {
            process.env.TOKEN_LOCATION = TOKENVARS.location;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { SessionHandler } = require("../src/");

            const fakeToken = "FakeToken";
            const fakeSession = {
              token: "newFakeToken"
            };

            const authService = {
              verify: fake(async ({ token }: { token: any }) => {
                strictEqual(token, fakeToken);
                return fakeSession;
              })
            };
            const finalHandler = fake(async (ctx: any) => {
              strictEqual(ctx.session.token, fakeSession.token);
              await new APIResponse(true).send(ctx);
            });

            app.get("/user", [SessionHandler({
              authService, options
            }), finalHandler]);
            await new Promise((resolve, reject) => {
              FuncTestHelper(app, getRequestConfig(fakeToken), (res) => {
                try {
                  strictEqual(res.headers["content-type"], "application/json; charset=utf-8");
                  strictEqual(res.headers["content-length"], "4");
                  strictEqual(res.status, 200);
                  strictEqual(finalHandler.callCount, 1);
                  strictEqual(authService.verify.callCount, 1);
                  if (TOKENVARS.location === "cookie") {
                    strictEqual((res as any).headers["set-cookie"].length, 1);
                    strictEqual((res as any).headers["set-cookie"][0], `${TOKENVARS.locationRef}=${fakeSession.token}; Path=/; HttpOnly; Secure; SameSite=Strict`);
                  } else {
                    strictEqual((res as any).headers["set-cookie"], undefined);
                  }
                  resolve(res);
                } catch (e) {
                  reject(e);
                }
              });
            });

          })().then(done).catch(done);
        });

        it(`createSessionHandler [${TOKENVARS.location}] happy path doesnt allow pass through is 401`, (done) => {
          (async () => {
            process.env.TOKEN_LOCATION = TOKENVARS.location;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { SessionHandler } = require("../src/");

            const fakeToken = "FakeToken";
            const fakeSession = null;

            const authService = {
              verify: fake(async ({ token }: any) => {
                strictEqual(token, fakeToken);
                return fakeSession;
              })
            };
            const finalHandler = fake(async (ctx: any) => {
              strictEqual(ctx.session, fakeSession);
              await new APIResponse(true).send(ctx);
            });
            app.get("/user", [SessionHandler({
              authService, options
            }), finalHandler]);
            await new Promise((resolve, reject) => {
              FuncTestHelper(app, getRequestConfig(fakeToken), (res) => {
                try {
                  strictEqual(res.headers["content-type"], "application/json; charset=utf-8");
                  strictEqual(res.headers["content-length"], "57");
                  strictEqual(res.status, 401);
                  strictEqual(finalHandler.callCount, 0);
                  strictEqual(authService.verify.callCount, 1);
                  strictEqual((res as any).headers["set-cookie"], undefined);
                  resolve(res);
                } catch (e) {
                  reject(e);
                }
              });
            });

          })().then(done).catch(done);
        });

        it(`createSessionHandler [${TOKENVARS.location}] no token is 401`, (done) => {
          (async () => {
            process.env.TOKEN_LOCATION = TOKENVARS.location;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { SessionHandler } = require("../src/");

            const authService = {
              verify: fake(async ({ token }: any) => {
                // empty
              })
            };
            const finalHandler = fake(async (ctx: any) => {
              await new APIResponse("asdlkjasdliasjdaijal").send(ctx);
            });
            app.get("/user", [SessionHandler({
              authService, options
            }), finalHandler]);
            await new Promise((resolve, reject) => {
              FuncTestHelper(app, getRequestConfig(), (res) => {
                try {
                  strictEqual(res.headers["content-type"], "application/json; charset=utf-8");
                  strictEqual(res.headers["content-length"], "48");
                  strictEqual(res.status, 401);
                  strictEqual(finalHandler.callCount, 0);
                  strictEqual(authService.verify.callCount, 0);
                  strictEqual((res as any).headers["set-cookie"], undefined);
                  resolve(res);
                } catch (e) {
                  reject(e);
                }
              });
            });

          })().then(done).catch(done);
        });

        it(`createSessionHandler [${TOKENVARS.location}] verify throws is 401`, (done) => {
          (async () => {
            process.env.TOKEN_LOCATION = TOKENVARS.location;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { SessionHandler } = require("../src/");

            const fakeToken = "FakeToken";

            const authService = {
              verify: fake(async ({ token }: any) => {
                throw {
                  blaError: true
                }
              })
            };
            const finalHandler = fake(async (ctx: any) => {
              await new APIResponse("asdlkjasdliasjdaijal").send(ctx);
            });
            app.get("/user", [SessionHandler({
              authService, options
            }), finalHandler]);
            await new Promise((resolve, reject) => {
              FuncTestHelper(app, getRequestConfig(fakeToken), (res) => {
                try {
                  strictEqual(res.headers["content-type"], "application/json; charset=utf-8");
                  strictEqual(res.headers["content-length"], "57");
                  strictEqual(res.status, 401);
                  strictEqual(finalHandler.callCount, 0);
                  strictEqual(authService.verify.callCount, 1);
                  strictEqual((res as any).headers["set-cookie"], undefined);
                  resolve(res);
                } catch (e) {
                  reject(e);
                }
              });
            });

          })().then(done).catch(done);
        });
      });
    }
  }
});
