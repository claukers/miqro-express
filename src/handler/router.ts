import { Logger } from "@miqro/core";
import { AppHandler, Handler, normalizePath, Context, ErrorHandler } from "./common";
import { Method } from "./feature-router";

export class Router {
  protected readonly handlers: AppHandler[] = [];
  protected readonly errorHandlers: ErrorHandler[] = [];
  public get(path: string, handler: Array<Handler> | Handler | Router): Router {
    return this.use(handler, path, "get");
  }
  public post(path: string, handler: Array<Handler> | Handler | Router): Router {
    return this.use(handler, path, "post");
  }
  public patch(path: string, handler: Array<Handler> | Handler | Router): Router {
    return this.use(handler, path, "patch");
  }
  public delete(path: string, handler: Array<Handler> | Handler | Router): Router {
    return this.use(handler, path, "delete");
  }
  public put(path: string, handler: Array<Handler> | Handler | Router): Router {
    return this.use(handler, path, "put");
  }
  public options(path: string, handler: Array<Handler> | Handler | Router): Router {
    return this.use(handler, path, "options");
  }
  public use(handler: Array<Handler> | Handler | Router, path?: string, method?: Method): Router {
    if (handler instanceof Array) {
      for (const h of handler) {
        this.handlers.push({
          handler: h,
          method,
          path: path !== undefined ? normalizePath(path) : undefined
        });
      }
    } else {
      this.handlers.push({
        handler,
        method,
        path: path !== undefined ? normalizePath(path) : undefined
      });
    }
    return this;
  }
  public catch(errorHandler: Array<ErrorHandler> | ErrorHandler) {
    if (errorHandler instanceof Array) {
      for (const e of errorHandler) {
        this.errorHandlers.push(e);
      }
    } else {
      this.errorHandlers.push(errorHandler);
    }
  }
  protected isMatch(ctx: Context, h: AppHandler, prePath?: string): boolean {
    if ((h.method === undefined || h.method.toLocaleLowerCase() === ctx.method.toLocaleLowerCase())) {
      if (typeof h.handler === "function" || h.handler instanceof Array) {
        // the paths have been already normalized
        if (prePath === "/" || prePath === undefined) {
          if ((h.path === undefined || h.path.toLocaleLowerCase() === ctx.path.toLocaleLowerCase())) {
            return true;
          }
        } else {
          if ((h.path === undefined || `${prePath ? prePath : "/"}${h.path.substring(1)}` === ctx.path.toLocaleLowerCase())) {
            return true;
          }
        }
      } else {
        // Router
        if ((h.path === undefined || ctx.path.indexOf(`${prePath ? prePath : "/"}${h.path.substring(1)}`) === 0)) {
          return true;
        }
      }
    }
    return false;
  }
  protected callHandler = async (ctx: Context, handler: Handler | Router, prePath?: string): Promise<boolean> => {
    const shouldContinue = typeof handler === "function" ?
      await handler(ctx) : await handler.run(ctx, prePath);
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
  protected async handleError(e: Error, ctx: Context): Promise<boolean> {
    for (const eH of this.errorHandlers) {
      const ret = await eH(e, ctx);
      if (ret === false) {
        return false;
      } else if (ctx.res.headersSent) {
        return false;
      }
    }
    throw e; // pass the error along
  }
  public async run(ctx: Context, prePath?: string): Promise<boolean> {
    try {
      let shouldContinue = true;
      for (const h of this.handlers) {

        if (!shouldContinue) {
          break;
        }
        if (this.isMatch(ctx, h, prePath)) {
          if (h.handler instanceof Array) {
            for (const hh of h.handler) {
              if (ctx.res.headersSent) {
                shouldContinue = false;
                break;
              }
              shouldContinue = await this.callHandler(ctx, hh);
              if (!shouldContinue) {
                break;
              }
            }
            if (!shouldContinue) {
              break;
            }
          } else {
            if (ctx.res.headersSent) {
              shouldContinue = false;
              break;
            }
            shouldContinue = await this.callHandler(
              ctx,
              h.handler,
              `${prePath ? prePath : "/"}${h.path ? h.path.substring(1) : ""}`
            );

            if (!shouldContinue) {
              break;
            }
          }
        }
      }
      if (!ctx.res.headersSent) {
        return shouldContinue !== false;
      } else {
        return true;
      }
    } catch (e) {
      return this.handleError(e, ctx);
    }
  }
}
