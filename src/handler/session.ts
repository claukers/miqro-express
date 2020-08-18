import {AsyncNextCallback} from "./common";
import {
  ForbiddenError,
  GroupPolicyValidator,
  GroupPolicy,
  Logger,
  ParseOptionsError,
  UnAuthorizedError,
  Util,
  VerifyTokenService
} from "@miqro/core";

export const SessionHandler = (authService: VerifyTokenService, logger?: Logger): AsyncNextCallback => {
  Util.checkEnvVariables(["TOKEN_LOCATION"]);
  switch (process.env.TOKEN_LOCATION) {
    case "header":
      Util.checkEnvVariables(["TOKEN_HEADER"]);
      break;
    case "query":
      Util.checkEnvVariables(["TOKEN_QUERY"]);
      break;
    default:
      throw new Error(`TOKEN_LOCATION=${process.env.TOKEN_LOCATION} not supported use (header or query)`);
  }

  if (!logger) {
    logger = Util.getLogger("SessionHandler");
  }
  if (!authService) {
    throw new Error("authService must be provided!");
  }
  return async (req, res, next) => {
    try {
      let token = null;
      switch (process.env.TOKEN_LOCATION) {
        case "header":
          token = req.headers[(process.env.TOKEN_HEADER as string).toLowerCase()] as string
          break;
        case "query":
          token = req.query[process.env.TOKEN_QUERY as string] as string;
          break;
      }
      if (!token) {
        const message = `No token provided!`;
        (logger as Logger).error(message);
        next(new ParseOptionsError(message));
      } else {
        const session = await authService.verify({token});
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          (logger as Logger).warn(message);
          next(new UnAuthorizedError(`Fail to authenticate token!`));
        } else {
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

export const GroupPolicyHandler = (options: GroupPolicy, logger?: Logger): AsyncNextCallback => {
  if (!logger) {
    logger = Util.getLogger("GroupPolicyHandler");
  }
  return async (req, res, next) => {
    try {
      if (!req.session) {
        next(new ParseOptionsError(`No Session!`));
      } else {
        const result = await GroupPolicyValidator.validate(req.session, options, logger as Logger);
        if (result) {
          (logger as Logger).info(`request[${req.uuid}] ` +
            `groups [${req && req.session && req.session.groups ? req.session.groups.join(",") : ""}] validated!`);

          next();
        } else {
          (logger as Logger).warn(`request[${req.uuid}] ` +
            `groups [${req && req.session && req.session.groups ? req.session.groups.join(",") : ""}] fail to validate!`);

          next(new UnAuthorizedError(`Invalid session. You are not permitted to do this!`));
        }
      }
    } catch (e) {
      (logger as Logger).warn(`request[${req.uuid}] message[${e.message}] stack[${e.stack}]`);
      if (e.name && e.name !== "Error") {
        next(e);
      } else {
        next(new ForbiddenError(`Invalid session. You are not permitted to do this!`));
      }
    }
  };
};
