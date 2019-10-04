import { GroupPolicy, IGroupPolicyOptions, ISession, IVerifyTokenService, Util } from "miqro-core";
import { IServiceHandler, IServiceRouteOptions } from "./common";
import { BadRequestResponse, ForbidenResponse, IAPIRequest, UnAuthorizedResponse } from "./response";
import { ServiceRoute } from "./service";

export interface ISessionRouteOptions extends IServiceRouteOptions {
  authService: IVerifyTokenService;
  groupPolicy?: IGroupPolicyOptions;
}

export const createSessionHandler = (authService: IVerifyTokenService, logger): IServiceHandler =>
  async (req: IAPIRequest, res, next) => {
    try {
      Util.checkEnvVariables(["TOKEN_HEADER"]);
      const token = req.headers[process.env.TOKEN_HEADER.toLowerCase()];
      if (!token) {
        const message = `No token provided!`;
        logger.error(message);
        await new BadRequestResponse(message).send(res);
      } else {
        const session: ISession = await authService.verify({ token });
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          logger.warn(message);
          await new UnAuthorizedResponse(`Fail to authenticate token`).send(res);
        } else {
          req.session = session;
          logger.info(`Token [${token}] authenticated!`);
          next();
        }
      }
    } catch (e) {
      logger.error(e);
      await new UnAuthorizedResponse(`Fail to authenticate token!`).send(res);
    }
  };

export const createGroupPolicyHandler = (options: IGroupPolicyOptions, logger): IServiceHandler =>
  async (req: IAPIRequest, res, next) => {
    try {
      if (!req.session) {
        await new BadRequestResponse(`No Session!`).send(res);
      }
      const result = await GroupPolicy.validateSession(req.session, options, logger);
      if (result) {
        logger.info(`groups [${req && req.session && req.session.groups ? req.session.groups.join(",") : ""}] validated!`);
        next();
      } else {
        logger.warn(`groups [${req && req.session && req.session.groups ? req.session.groups.join(",") : ""}] fail to validate!`);
        await new UnAuthorizedResponse(`Invalid session. You are not permitted to do this!`).send(res);
      }
    } catch (e) {
      logger.warn(e);
      await new ForbidenResponse(`Invalid session. You are not permitted to do this!`).send(res);
    }
  };

export class SessionRoute extends ServiceRoute {
  protected authService: IVerifyTokenService;
  constructor(options: ISessionRouteOptions) {
    super(options);
    const logger = Util.getLogger("SessionRoute");
    this.authService = options.authService;
    this.router.use(createSessionHandler(options.authService, logger));
    if (options.groupPolicy) {
      this.router.use(createGroupPolicyHandler(options.groupPolicy, logger));
    }
  }
}
