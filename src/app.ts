import { RequestListener } from "http";
import { AppHandler, Context, Handler } from "./handler";
import { NOT_FOUND } from "./responses";

const callHandler = async (ctx: Context, hh: Handler): Promise<boolean> => {
  const shouldContinue = await hh(ctx);
  if (shouldContinue === false) {
    ctx.logger.debug(`avoiding next handlers because handler returned false.`);
    return false;
  } else if (shouldContinue !== true && shouldContinue !== undefined) {
    ctx.logger.debug(`pushing to results [${shouldContinue}]`);
    ctx.results.push(shouldContinue);
  } else {
    ctx.logger.debug(`NOT pushing to results [${shouldContinue}]`);
  }
  return true;
};

export class App {
  public readonly listener: RequestListener;
  private readonly handlers: AppHandler[];
  constructor() {
    this.handlers = [];
    this.listener = (req, res) => {
      const ctx = new Context(req, res);
      ctx.logger.debug(`request received`);
      (async () => {
        try {
          let closed = false;
          res.on("close", () => {
            closed = true;
          });
          for (const h of this.handlers) {
            let shouldContinue: boolean = true;
            if (!shouldContinue) {
              break;
            }
            if ((h.method === undefined || h.method.toLocaleLowerCase() === ctx.method.toLocaleLowerCase())
              && (h.pathname === undefined || h.pathname.toLocaleLowerCase() === ctx.pathname.toLocaleLowerCase())) {
              if (h.handler instanceof Array) {
                for (const hh of h.handler) {
                  if (closed || ctx.res.headersSent) {
                    shouldContinue = false;
                    break;
                  }
                  shouldContinue = await callHandler(ctx, hh);
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
                shouldContinue = await callHandler(ctx, h.handler);
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
  public add(handlers: Array<AppHandler | Handler> | AppHandler | Handler): App {
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
    return this;
  }
}
