import { IAPIHandlerOptions } from "./apihandler";

export * from "./apihandler";
export * from "./servicehandler";

export interface IRouteOptions extends IAPIHandlerOptions {
  name?: any;
  router?: any;
  preRoute?: string;
  postRoute?: string;
}
