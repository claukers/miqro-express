import { createServer, RequestListener, Server } from "http";
import { Context, DefaultErrorHandler, ErrorHandler } from "./handler";
import { Router } from "./handler/router";
import { NOT_FOUND } from "./responses";

export class App extends Router {
  public readonly listener: RequestListener;
  public errorHandler: ErrorHandler;

  constructor() {
    super();
    this.errorHandler = DefaultErrorHandler();
    this.listener = (req, res) => {
      const ctx = new Context(req, res);
      ctx.logger.debug(`request received`);
      (async () => {
        await this.run(ctx);
        if (!ctx.res.headersSent) {
          await NOT_FOUND.send(ctx);
        }
      })().catch(async (e) => {
        try {
          await this.handleError(e, ctx);
        } catch (e) {
          this.errorHandler(e, ctx).catch(ctx.logger.error);
        }
      });
    };
  }
  public listen(...args: any[]): Server {
    return createServer(this.listener).listen(...args)
  }

}
