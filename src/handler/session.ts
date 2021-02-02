import { AsyncNextCallback } from "./common";
import { Logger, UnAuthorizedError, Util, VerifyTokenService } from "@miqro/core";

const DEFAULT_TOKEN_LOCATION = "header";
const DEFAULT_TOKEN_HEADER = "Authorization";
const DEFAULT_TOKEN_QUERY = "token";
const DEFAULT_TOKEN_COOKIE = "Authorization";

export interface SessionHandlerOptions {
  authService: VerifyTokenService;
  options?: {
    tokenLocation: "header" | "query" | "cookie";
    tokenLocationName: string;
  }
}

export const SessionHandler = (config: SessionHandlerOptions, logger?: Logger): AsyncNextCallback => {
  if (!config.options) {
    const tokenLocation = Util.checkEnvVariables(["TOKEN_LOCATION"], [DEFAULT_TOKEN_LOCATION])[0];
    switch (tokenLocation) {
      case "header":
        Util.checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER]);
        break;
      case "query":
        Util.checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY]);
        break;
      case "cookie":
        Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE]);
        break;
      default:
        throw new Error(`TOKEN_LOCATION=${tokenLocation} not supported use (header or query)`);
    }
  } else {
    Util.parseOptions("options", config.options as any, [
      { name: "tokenLocation", required: true, type: "enum", enumValues: ["header", "query", "cookie"] },
      { name: "tokenLocationName", required: true, type: "string", stringMinLength: 1 }
    ], "no_extra");
  }


  if (!logger) {
    logger = Util.getLogger("SessionHandler");
  }
  if (!config.authService) {
    throw new Error("authService must be provided!");
  }
  return async (req, res, next) => {
    try {
      const tokenLocation = config.options ? config.options.tokenLocation : Util.checkEnvVariables(["TOKEN_LOCATION"], [DEFAULT_TOKEN_LOCATION])[0];
      let token = null;
      switch (tokenLocation) {
        case "header":
          const tokenHeaderLocation = config.options ? config.options.tokenLocationName : Util.checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER])[0];
          token = req.headers[(tokenHeaderLocation).toLowerCase()] as string
          break;
        case "query":
          const tokenQueryLocation = config.options ? config.options.tokenLocationName : Util.checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY])[0];
          token = req.query[tokenQueryLocation] as string;
          break;
        case "cookie":
          const tokenCookieLocation = config.options ? config.options.tokenLocationName : Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
          token = req.cookies[tokenCookieLocation] as string;
          break;
        default:
          throw new Error(`TOKEN_LOCATION=${tokenLocation} not supported use (header, query or cookie)`);
      }
      if (!token) {
        const message = `No token provided!`;
        // (logger as Logger).error(message);
        next(new UnAuthorizedError(message));
      } else {
        const session = await config.authService.verify({ token });
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          (logger as Logger).warn(message);
          next(new UnAuthorizedError(`Fail to authenticate token!`));
        } else {
          if (tokenLocation === "cookie" && session.token !== token) {
            const tokenCookieLocation = config.options ? config.options.tokenLocationName : Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
            if (session.expires instanceof Date) {
              res.cookie(tokenCookieLocation, session.token ? session.token : token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                expires: session.expires
              });
            } else {
              res.cookie(tokenCookieLocation, session.token ? session.token : token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
              });
            }
          }
          req.session = session;
          (logger as Logger).debug(`request[${req.uuid}] Token [${token}] authenticated!`);
          next();
        }
      }
    } catch (e) {
      // (logger as Logger).error(`request[${req.uuid}] message[${e.message}] stack[${e.stack}]`);
      if (e.name) {
        next(e);
      } else {
        next(new UnAuthorizedError(`Fail to authenticate token!`));
      }
    }
  };
};


