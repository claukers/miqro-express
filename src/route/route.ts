import { Router } from "express";
import { createAPIHandler, IServiceHandler, IServiceRouteOptions } from "./common";

export class Route {
  protected router: Router;
  constructor(public options?: IServiceRouteOptions) {
    this.router = options && options.router ? options.router : Router();
  }
  public get(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    this.addRoute("get", route, handler);
  }
  public post(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    this.addRoute("post", route, handler);
  }
  public delete(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    this.addRoute("delete", route, handler);
  }
  public patch(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    this.addRoute("patch", route, handler);
  }
  public put(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    this.addRoute("put", route, handler);
  }
  public use(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    this.addRoute(null, route, handler);
  }
  public routes(): Router {
    return this.router;
  }
  protected addRoute(method: string, route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
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
