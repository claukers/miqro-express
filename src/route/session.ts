import {NextFunction, Request, Response} from "express";
import {
  ForbiddenError,
  GroupPolicy,
  IGroupPolicyOptions,
  ISession,
  IVerifyTokenService,
  ParseOptionsError,
  UnAuthorizedError,
  Util
} from "miqro-core";

export const SessionHandler = (authService: IVerifyTokenService, logger?) => {
  if (!logger) {
    logger = Util.getLogger("SessionHandler");
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      Util.checkEnvVariables(["TOKEN_HEADER"]);
      const token = req.headers[process.env.TOKEN_HEADER.toLowerCase()] as string;
      if (!token) {
        const message = `No token provided!`;
        logger.error(message);
        // noinspection ExceptionCaughtLocallyJS
        throw new ParseOptionsError(message);
      } else {
        const session: ISession = await authService.verify({token});
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          logger.warn(message);
          // noinspection ExceptionCaughtLocallyJS
          throw new UnAuthorizedError(`Fail to authenticate token!`);
        } else {
          (req as any).session = session;
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

export const GroupPolicyHandler = (options: IGroupPolicyOptions, logger?) => {
  if (!logger) {
    logger = Util.getLogger("GroupPolicyHandler");
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!(req as any).session) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ParseOptionsError(`No Session!`);
      }
      const result = await GroupPolicy.validateSession((req as any).session, options, logger);
      if (result) {
        logger.info(`groups [${req && (req as any).session && (req as any).session.groups ? (req as any).session.groups.join(",") : ""}] validated!`);
        next();
      } else {
        logger.warn(`groups [${req && (req as any).session && (req as any).session.groups ? (req as any).session.groups.join(",") : ""}] fail to validate!`);
        // noinspection ExceptionCaughtLocallyJS
        throw new UnAuthorizedError(`Invalid session. You are not permitted to do this!`);
      }
    } catch (e) {
      logger.warn(e);
      if (e.name) {
        throw e;
      }
      throw new ForbiddenError(`Invalid session. You are not permitted to do this!`);
    }
  };
};
