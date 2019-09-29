import { Util } from "miqro-core";
import { createAPIHandler, IServiceHandler, IServiceRouteOptions } from "./common";
import { Route } from "./route";

let logger;

export class ServiceRoute extends Route {
  constructor(public options?: IServiceRouteOptions) {
    super();
    if (!logger) {
      logger = Util.getLogger("ServiceRoute");
    }
  }
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
