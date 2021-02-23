import { checkEnvVariables, parseOptions, UnAuthorizedError } from "@miqro/core";
import { ExtendedVerifyTokenService } from "../service";
import { Handler, Context } from "./common";
import { serialize } from "cookie";

const DEFAULT_TOKEN_LOCATION = "header";
const DEFAULT_TOKEN_HEADER = "Authorization";
const DEFAULT_TOKEN_QUERY = "token";
const DEFAULT_TOKEN_COOKIE = "Authorization";

export interface SessionHandlerOptions {
  authService: ExtendedVerifyTokenService;
  options?: {
    tokenLocation: "header" | "query" | "cookie";
    tokenLocationName: string;
  }
}

export const SessionHandler = (config: SessionHandlerOptions): Handler => {
  if (!config.options) {
    const tokenLocation = checkEnvVariables(["TOKEN_LOCATION"], [DEFAULT_TOKEN_LOCATION])[0];
    switch (tokenLocation) {
      case "header":
        checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER]);
        break;
      case "query":
        checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY]);
        break;
      case "cookie":
        checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE]);
        break;
      default:
        throw new Error(`TOKEN_LOCATION=${tokenLocation} not supported use (header or query)`);
    }
  } else {
    parseOptions("options", config.options as any, [
      { name: "tokenLocation", required: true, type: "enum", enumValues: ["header", "query", "cookie"] },
      { name: "tokenLocationName", required: true, type: "string", stringMinLength: 1 }
    ], "no_extra");
  }

  if (!config.authService) {
    throw new Error("authService must be provided!");
  }
  return async (ctx: Context) => {
    try {
      const tokenLocation = config.options ? config.options.tokenLocation : checkEnvVariables(["TOKEN_LOCATION"], [DEFAULT_TOKEN_LOCATION])[0];
      let token = null;
      switch (tokenLocation) {
        case "header":
          const tokenHeaderLocation = config.options ? config.options.tokenLocationName : checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER])[0];
          token = ctx.headers[(tokenHeaderLocation).toLowerCase()] as string;
          break;
        case "query":
          const tokenQueryLocation = config.options ? config.options.tokenLocationName : checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY])[0];
          token = ctx.query[tokenQueryLocation] as string;
          break;
        case "cookie":
          const tokenCookieLocation = config.options ? config.options.tokenLocationName : checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
          token = ctx.cookies[tokenCookieLocation] ? ctx.cookies[tokenCookieLocation] : undefined;
          break;
        default:
          throw new Error(`TOKEN_LOCATION=${tokenLocation} not supported use (header, query or cookie)`);
      }
      if (!token) {
        const message = `No token provided!`;
        // (logger as Logger).error(message);
        throw new UnAuthorizedError(message);
      } else {
        const session = await config.authService.verify({ token, ctx });
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          ctx.logger.warn(message);
          throw new UnAuthorizedError(`Fail to authenticate token!`);
        } else {
          if (tokenLocation === "cookie" && session.token !== token) {
            const tokenCookieLocation = config.options ? config.options.tokenLocationName : checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
            if (session.expires instanceof Date) {
              ctx.res.setHeader('Set-Cookie', serialize(tokenCookieLocation, String(session.token ? session.token : token), {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                expires: session.expires
              }));
            } else {
              ctx.res.setHeader('Set-Cookie', serialize(tokenCookieLocation, String(session.token ? session.token : token), {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
              }));
            }
          }
          ctx.session = session;
          ctx.logger.debug(`request[${ctx.uuid}] Token [${token}] authenticated!`);
          return true;
        }
      }
    } catch (e) {
      // (logger as Logger).error(`request[${req.uuid}] message[${e.message}] stack[${e.stack}]`);
      if (e.name) {
        throw e;
      } else {
        throw new UnAuthorizedError(`Fail to authenticate token!`);
      }
    }
  };
};


