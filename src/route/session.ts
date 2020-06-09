import {
  ForbiddenError,
  GroupPolicy,
  GroupPolicyOptionsInterface,
  ParseOptionsError,
  SessionInterface,
  UnAuthorizedError,
  Util,
  VerifyJWTEndpointService,
  VerifyTokenServiceInterface
} from "@miqro/core";
import {Logger} from "winston";
import {INextHandlerCallback} from "./common";

export const SessionHandler = (authService?: VerifyTokenServiceInterface, logger?: Logger): INextHandlerCallback => {
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
    authService = VerifyJWTEndpointService.getInstance();
  }
  return async (req, res, next): Promise<void> => {
    try {
      let token = null;
      switch (process.env.TOKEN_LOCATION) {
        case "header":
          token = req.headers[process.env.TOKEN_HEADER.toLowerCase()] as string
          break;
        case "query":
          token = req.query[process.env.TOKEN_QUERY] as string;
          break;
      }
      if (!token) {
        const message = `No token provided!`;
        logger.error(message);
        next(new ParseOptionsError(message));
      } else {
        const session: SessionInterface = await authService.verify({token});
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          logger.warn(message);
          next(new UnAuthorizedError(`Fail to authenticate token!`));
        } else {
          req.session = session;
          logger.info(`Token [${token}] authenticated!`);
          next();
        }
      }
    } catch (e) {
      logger.error(e);
      if (e.name) {
        next(e);
      } else {
        next(new UnAuthorizedError(`Fail to authenticate token!`));
      }
    }
  };
};

export const GroupPolicyHandler = (options: GroupPolicyOptionsInterface, logger?: Logger): INextHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("GroupPolicyHandler");
  }
  return async (req, res, next): Promise<void> => {
    try {
      if (!req.session) {
        next(new ParseOptionsError(`No Session!`));
      }
      const result = await GroupPolicy.validateSession(req.session, options, logger);
      if (result) {
        logger.info(`request[${req.uuid}] ` +
          `groups [${req && req.session && req.session.groups ? req.session.groups.join(",") : ""}] validated!`);
        next();
      } else {
        logger.warn(`request[${req.uuid}] ` +
          `groups [${req && req.session && req.session.groups ? req.session.groups.join(",") : ""}] fail to validate!`);
        next(new UnAuthorizedError(`Invalid session. You are not permitted to do this!`));
      }
    } catch (e) {
      logger.warn(e);
      if (e.name && e.name !== "Error") {
        next(e);
      } else {
        next(new ForbiddenError(`Invalid session. You are not permitted to do this!`));
      }
    }
  };
};
