import { Util } from "miqro-core";
import { createAPIHandler, IServiceHandler } from "./common";
import { Route } from "./route";

export class APIRoute extends Route {
  public get(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.get(route, createAPIHandler(handler, Util.getLogger("APIRoute"), this));
  }
  public post(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.post(route, createAPIHandler(handler, Util.getLogger("APIRoute"), this));
  }
  public delete(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.delete(route, createAPIHandler(handler, Util.getLogger("APIRoute"), this));
  }
  public patch(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.patch(route, createAPIHandler(handler, Util.getLogger("APIRoute"), this));
  }
  public put(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.put(route, createAPIHandler(handler, Util.getLogger("APIRoute"), this));
  }
  public use(route: string | string[], handler: IServiceHandler | IServiceHandler[]) {
    super.use(route, createAPIHandler(handler, Util.getLogger("APIRoute"), this));
  }
}
