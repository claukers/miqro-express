import { ISession, Util } from "miqro-core";
import { IServiceRouteOptions } from "./common";
import { BadRequestResponse, IAPIRequest } from "./response";
import { ServiceRoute } from "./service";

let logger = null;

export interface ISessionRouteOptions extends IServiceRouteOptions {
  authService: IVerifyTokenService;
}

export interface IVerifyTokenService {
  verify(args: { token: string }): Promise<ISession>;
}

export class SessionRoute extends ServiceRoute {
  protected authService: IVerifyTokenService;
  protected middlewareSetupDone: boolean = false;
  constructor(options?: ISessionRouteOptions) {
    super(options);
    if (!logger) {
      logger = Util.getLogger("SessionRoute");
    }
    Util.checkEnvVariables(["TOKEN_HEADER"]);
    this.authService = options.authService;
    this.setupMiddleware();
  }
  protected setupMiddleware() {
    if (!this.middlewareSetupDone) {
      this.middlewareSetupDone = true;
      this.router.use(async (req: IAPIRequest, res, next) => {
        try {
          const token = req.headers[process.env.TOKEN_HEADER.toLowerCase()];
          if (!token) {
            await new BadRequestResponse(`No token provided!`).send(res);
          } else {
            const session: ISession = await this.authService.verify({ token });
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
      });
    }
  }
}
