import { IAPIHandlerOptions } from "./apihandler";

export interface IRouteOptions extends IAPIHandlerOptions {
  name?: any;
  router?: any;
  preRoute?: string;
  postRoute?: string;
}
