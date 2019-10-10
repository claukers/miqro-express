import { ForbidenError, GroupPolicy, IGroupPolicyOptions, ISession, IVerifyTokenService, ParseOptionsError, UnAuthorizedError, Util } from "miqro-core";
import { APIRoute } from "./apiroute";
import { createAPIHandler, IAPIHandlerOptions, IRouteOptions, IServiceHandler } from "./common";

export interface ISessionRouteOptions extends IRouteOptions {
  authService: IVerifyTokenService;
  groupPolicy?: IGroupPolicyOptions;
}

export const createSessionHandler = (authService: IVerifyTokenService, logger, config?: { options: IAPIHandlerOptions }): IServiceHandler =>
  createAPIHandler(async (req, res, next) => {
    try {
      Util.checkEnvVariables(["TOKEN_HEADER"]);
      const token = req.headers[process.env.TOKEN_HEADER.toLowerCase()] as string;
      if (!token) {
        const message = `No token provided!`;
        logger.error(message);
        throw new ParseOptionsError(message);
      } else {
        const session: ISession = await authService.verify({ token });
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          logger.warn(message);
          throw new UnAuthorizedError(`Fail to authenticate token!`);
        } else {
          (req as any).session = session;
          logger.info(`Token [${token}] authenticated!`);
          next();
        }
      }
    } catch (e) {
      logger.error(e);
      if (e.isParserOptionsError || e.isUnAuthorizeError || e.isForbidenError) {
        throw e;
      }
      throw new UnAuthorizedError(`Fail to authenticate token!`);
    }
  }, logger, config)[0];

export const createGroupPolicyHandler = (options: IGroupPolicyOptions, logger, config?: { options: IAPIHandlerOptions }): IServiceHandler =>
  createAPIHandler(async (req, res, next) => {
    try {
      if (!(req as any).session) {
        throw new ParseOptionsError(`No Session!`);
      }
      const result = await GroupPolicy.validateSession((req as any).session, options, logger);
      if (result) {
        logger.info(`groups [${req && (req as any).session && (req as any).session.groups ? (req as any).session.groups.join(",") : ""}] validated!`);
        next();
      } else {
        logger.warn(`groups [${req && (req as any).session && (req as any).session.groups ? (req as any).session.groups.join(",") : ""}] fail to validate!`);
        throw new UnAuthorizedError(`Invalid session. You are not permitted to do this!`);
      }
    } catch (e) {
      logger.warn(e);
      if (e.isParserOptionsError || e.isUnAuthorizeError || e.isForbidenError) {
        throw e;
      }
      throw new ForbidenError(`Invalid session. You are not permitted to do this!`);
    }
  }, logger, config)[0];

export class SessionRoute extends APIRoute {
  protected authService: IVerifyTokenService;
  constructor(options: ISessionRouteOptions) {
    super(options);
    this.authService = options.authService;
    this.router.use(createSessionHandler(options.authService, this.logger, { options }));
    if (options.groupPolicy) {
      this.router.use(createGroupPolicyHandler(options.groupPolicy, this.logger, { options }));
    }
  }
}
