import { createServer, RequestListener, Server } from "http";
import { Context } from "./handler";
import { Router } from "./handler/router";
import { NOT_FOUND } from "./responses";

export class App extends Router {
  public readonly listener: RequestListener;

  constructor() {
    super();
    this.listener = (req, res) => {
      const ctx = new Context(req, res);
      ctx.logger.debug(`request received`);
      let closed = false;
      const closeListener = () => {
        closed = true;
      };
      ctx.res.once("close", closeListener);
      (async () => {
        await this.run(ctx);
        if (!closed && !ctx.res.headersSent) {
          ctx.res.removeListener("close", closeListener);
          await NOT_FOUND.send(ctx);
        }
      })().catch(e => {
        ctx.res.removeListener("close", closeListener);
        ctx.emit("error", e);
      });
    };
  }
  public listen(...args: any[]): Server {
    return createServer(this.listener).listen(...args)
  }

}
