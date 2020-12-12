import {AsyncNextCallback} from "./common";
import {Logger, UnAuthorizedError, Util, VerifyTokenService} from "@miqro/core";

const DEFAULT_TOKEN_LOCATION = "header";
const DEFAULT_TOKEN_HEADER = "Authorization";
const DEFAULT_TOKEN_QUERY = "token";
const DEFAULT_TOKEN_COOKIE = "Authorization";

export const SessionHandler = (authService: VerifyTokenService, logger?: Logger): AsyncNextCallback => {
  const [tokenLocation] = Util.checkEnvVariables(["TOKEN_LOCATION"], [DEFAULT_TOKEN_LOCATION]);
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

  if (!logger) {
    logger = Util.getLogger("SessionHandler");
  }
  if (!authService) {
    throw new Error("authService must be provided!");
  }
  return async (req, res, next) => {
    try {
      const [tokenLocation] = Util.checkEnvVariables(["TOKEN_LOCATION"], [DEFAULT_TOKEN_LOCATION]);
      let token = null;
      switch (tokenLocation) {
        case "header":
          const [tokenHeaderLocation] = Util.checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER]);
          token = req.headers[(tokenHeaderLocation).toLowerCase()] as string
          break;
        case "query":
          const [tokenQueryLocation] = Util.checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY]);
          token = req.query[tokenQueryLocation] as string;
          break;
        case "cookie":
          const [tokenCookieLocation] = Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE]);
          token = req.cookies[tokenCookieLocation] as string;
          break;
        default:
          throw new Error(`TOKEN_LOCATION=${tokenLocation} not supported use (header or query)`);
      }
      if (!token) {
        const message = `No token provided!`;
        (logger as Logger).error(message);
        next(new UnAuthorizedError(message));
      } else {
        const session = await authService.verify({token});
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          (logger as Logger).warn(message);
          next(new UnAuthorizedError(`Fail to authenticate token!`));
        } else {
          if (tokenLocation === "cookie") {
            const [tokenCookieLocation] = Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE]);
            res.cookie(tokenCookieLocation, session.token ? session.token : token, {
              httpOnly: true
            });
          }
          req.session = session;
          (logger as Logger).info(`request[${req.uuid}] Token [${token}] authenticated!`);
          next();
        }
      }
    } catch (e) {
      (logger as Logger).error(`request[${req.uuid}] message[${e.message}] stack[${e.stack}]`);
      if (e.name) {
        next(e);
      } else {
        next(new UnAuthorizedError(`Fail to authenticate token!`));
      }
    }
  };
};


