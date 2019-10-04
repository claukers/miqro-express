import { Util } from "miqro-core";
import { createAPIHandler, IServiceHandler } from "./common";
import { Route } from "./route";

export class APIRoute extends Route {
  public get(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.get(route, createAPIHandler(handler, this.logger, this));
  }
  public post(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.post(route, createAPIHandler(handler, this.logger, this));
  }
  public delete(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.delete(route, createAPIHandler(handler, this.logger, this));
  }
  public patch(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.patch(route, createAPIHandler(handler, this.logger, this));
  }
  public put(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.put(route, createAPIHandler(handler, this.logger, this));
  }
  public use(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.use(route, createAPIHandler(handler, this.logger, this));
  }
}
