import { createAPIHandler, IServiceHandler } from "./common";
import { Route } from "./route";

export class ServiceRoute extends Route {
  public get(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.get(route, createAPIHandler(handler, this));
  }
  public post(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.post(route, createAPIHandler(handler, this));
  }
  public delete(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.delete(route, createAPIHandler(handler, this));
  }
  public patch(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.patch(route, createAPIHandler(handler, this));
  }
  public put(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.put(route, createAPIHandler(handler, this));
  }
  public use(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.use(route, createAPIHandler(handler, this));
  }
}
