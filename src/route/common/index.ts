import { IAPIHandlerOptions } from "./apihandler";

export * from "./apihandler";
export * from "./servicehandler";

export interface IRouteOptions extends IAPIHandlerOptions {
  router?: any;
}

export interface IServiceRouteOptions extends IRouteOptions {
  name?: any;
  preRoute?: string;
  postRoute?: string;
}
