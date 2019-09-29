import { Router } from "express";
import { Util } from "miqro-core";
import { createAPIHandler, IRouteOptions, IServiceHandler } from "./common";

let logger = null;

export class Route {
  protected router: Router;
  constructor(public options?: IRouteOptions) {
    this.router = Router();
    if (!logger) {
      logger = Util.getLogger("Route");
    }
  }
  public get(route: string | string[], handler: IServiceHandler) {
    this.addRoute("get", route, handler);
  }
  public post(route: string | string[], handler: IServiceHandler) {
    this.addRoute("post", route, handler);
  }
  public delete(route: string | string[], handler: IServiceHandler) {
    this.addRoute("delete", route, handler);
  }
  public patch(route: string | string[], handler: IServiceHandler) {
    this.addRoute("patch", route, handler);
  }
  public put(route: string | string[], handler: IServiceHandler) {
    this.addRoute("put", route, handler);
  }
  public use(route: string | string[], handler: IServiceHandler) {
    this.addRoute(null, route, handler);
  }
  public routes(): Router {
    return this.router;
  }
  protected addRoute(method: string, route: string | string[], handler: IServiceHandler) {
    const renderRoute = (r: string): string => {
      return `${this.options && this.options.preRoute ? this.options.preRoute : ""}` +
        `${r}${this.options && this.options.postRoute ? this.options.postRoute : ""}`;
    };
    if (!method) {
      if (route) {
        if (typeof route === "string") {
          this.router.use(renderRoute(route), handler);
        } else {
          for (const r of route) {
            this.router.use(renderRoute(r), handler);
          }
        }
      } else {
        this.router.use(handler);
      }
    } else {
      if (route) {
        if (typeof route === "string") {
          this.router[method](renderRoute(route), handler);
        } else {
          for (const r of route) {
            this.router[method](renderRoute(r), handler);
          }
        }
      } else {
        this.router[method](handler);
      }
    }
  }
}
