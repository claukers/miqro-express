import { ISession, Util } from "miqro-core";
import { IServiceHandler, IServiceRouteOptions } from "./common";
import { BadRequestResponse, IAPIRequest } from "./response";
import { ServiceRoute } from "./service";

let logger = null;

export interface ISessionRouteOptions extends IServiceRouteOptions {
  authService: IVerifyTokenService;
}

export interface IVerifyTokenService {
  verify(args: { token: string }): Promise<ISession>;
}

export const createSessionHandler = (authService: IVerifyTokenService, logger): IServiceHandler =>
  async (req: IAPIRequest, res, next) => {
    try {
      Util.checkEnvVariables(["TOKEN_HEADER"]);
      const token = req.headers[process.env.TOKEN_HEADER.toLowerCase()];
      if (!token) {
        await new BadRequestResponse(`No token provided!`).send(res);
      } else {
        const session: ISession = await authService.verify({ token });
        if (!session) {
          await new BadRequestResponse(`Fail to authenticate token!`).send(res);
        } else {
          req.session = session;
          next();
        }
      }
    } catch (e) {
      logger.error(e);
      await new BadRequestResponse(`Fail to authenticate token!`).send(res);
    }
  };

export class SessionRoute extends ServiceRoute {
  protected authService: IVerifyTokenService;
  constructor(options?: ISessionRouteOptions) {
    super(options);
    if (!logger) {
      logger = Util.getLogger("SessionRoute");
    }
    this.authService = options.authService;
    this.router.use(createSessionHandler(options.authService, logger));
  }
}
