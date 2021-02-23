import { RequestListener } from "http";
import { Context, Handler } from "./common";
import { NotFoundResponse } from "./responses";

const NOT_FOUND = new NotFoundResponse()

export interface AppHandler {
  handler: Handler | Handler[];
  method?: string;
  pathname?: string;
}

export class App {
  public readonly listener: RequestListener;
  private readonly handlers: AppHandler[];
  constructor() {
    this.handlers = [];
    this.listener = (req, res) => {
      const ctx = new Context(req, res);
      ctx.logger.debug(``);
      (async () => {
        try {
          let closed = false;
          res.on("close", () => {
            closed = true;
          });
          for (const h of this.handlers) {
            let shouldContinue: void | boolean = true;
            if ((h.method === undefined || h.method.toLocaleLowerCase() === ctx.method.toLocaleLowerCase())
              && (h.pathname === undefined || h.pathname.toLocaleLowerCase() === ctx.pathname.toLocaleLowerCase())) {
              if (h.handler instanceof Array) {
                for (const hh of h.handler) {
                  if (closed || ctx.res.headersSent) {
                    shouldContinue = false;
                    break;
                  }
                  shouldContinue = await hh(ctx);
                  if (!shouldContinue) {
                    break;
                  }
                }
                if (!shouldContinue) {
                  break;
                }
              } else {
                if (closed || ctx.res.headersSent) {
                  shouldContinue = false;
                  break;
                }
                shouldContinue = await h.handler(ctx);
                if (!shouldContinue) {
                  break;
                }
              }
            }
          }
          if (!closed && !ctx.res.headersSent) {
            await NOT_FOUND.send(ctx);
          }
        } catch (e) {
          ctx.emit("error", e);
        }
      })().catch(e => {
        ctx.emit("error", e);
      });
    };
  }
  public add(handlers: Array<AppHandler | Handler> | AppHandler | Handler) {
    if (handlers instanceof Array) {
      for (const h of handlers) {
        if (typeof h === "function") {
          this.handlers.push({
            handler: h
          });
        } else {
          this.handlers.push(h);
        }

      }
    } else {
      if (typeof handlers === "function") {
        this.handlers.push({
          handler: handlers
        });
      } else {
        this.handlers.push(handlers);
      }

    }
  }
}
