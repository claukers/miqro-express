import { createServer, RequestListener, Server } from "http";
import { Context, DefaultErrorHandler, ErrorHandler } from "./handler";
import { NOT_FOUND } from "./handler/common/response";
import { Router } from "./handler/router";

export class App extends Router {
  public readonly listener: RequestListener;
  public errorHandler: ErrorHandler;

  constructor() {
    super();
    this.errorHandler = DefaultErrorHandler();
    this.listener = async (req, res) => {
      const ctx = new Context(req, res);
      ctx.logger.debug(`request received`);
      try {
        await this.run(ctx);
        if (!ctx.res.headersSent) {
          await ctx.end(NOT_FOUND());
        }
      } catch (e) {
        try {
          await this.handleError(e, ctx);
        } catch (e2) {
          this.errorHandler(e, ctx).catch(e => ctx.logger.error(e));
        }
      }
    };
  }
  public listen(...args: any[]): Server {
    return createServer(this.listener).listen(...args)
  }

}
