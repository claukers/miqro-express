import { createAPIHandler, IServiceHandler, IServiceRouteOptions } from "./common";
import { Route } from "./route";

export class ServiceRoute extends Route {
  public get(route: string | string[], handler: IServiceHandler) {
    super.get(route, createAPIHandler(handler, this));
  }
  public post(route: string | string[], handler: IServiceHandler) {
    super.post(route, createAPIHandler(handler, this));
  }
  public delete(route: string | string[], handler: IServiceHandler) {
    super.delete(route, createAPIHandler(handler, this));
  }
  public patch(route: string | string[], handler: IServiceHandler) {
    super.patch(route, createAPIHandler(handler, this));
  }
  public put(route: string | string[], handler: IServiceHandler) {
    super.put(route, createAPIHandler(handler, this));
  }
  public use(route: string | string[], handler: IServiceHandler) {
    super.use(route, createAPIHandler(handler, this));
  }
}
