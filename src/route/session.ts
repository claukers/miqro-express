import {
  ForbiddenError,
  GroupPolicy,
  IGroupPolicyOptions,
  ISession,
  IVerifyTokenService,
  ParseOptionsError,
  UnAuthorizedError,
  Util
} from "@miqro/core";
import {INextHandlerCallback} from "./common";

export const SessionHandler = (authService: IVerifyTokenService, logger?): INextHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("SessionHandler");
  }
  return async (req, res, next) => {
    try {
      Util.checkEnvVariables(["TOKEN_HEADER"]);
      const token = req.headers[process.env.TOKEN_HEADER.toLowerCase()] as string;
      if (!token) {
        const message = `No token provided!`;
        logger.error(message);
        next(new ParseOptionsError(message));
      } else {
        const session: ISession = await authService.verify({token});
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

export const GroupPolicyHandler = (options: IGroupPolicyOptions, logger?): INextHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("GroupPolicyHandler");
  }
  return async (req, res, next) => {
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
