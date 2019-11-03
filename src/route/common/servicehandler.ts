import { NextFunction, Request, Response } from "express";
import { IServiceArgs } from "miqro-core";
import { ServiceArg } from "../../service";
import { APIRoute } from "../apiroute";
import { APIResponse, ServiceResponse } from "../response";
import { createAPIHandler, IAPIHandlerOptions, IServiceHandler } from "./apihandler";
import { IRouteOptions } from "./options";

export const serviceResponseCreator = (results: any) => {
  if (!results || results.length === 0) {
    return null;
  }
  const response = results && results.length > 1 ? results : (
    results && results.length === 1 ? results[0] : null
  );
  return new ServiceResponse(response);
};

export const setResults = (req, results: any[]) => {
  (req as any).results = results;
};

export const getResults = (req): any[] => {
  if (!((req as any).results)) {
    setResults(req, []);
  }
  return (req as any).results;
};

export const createServiceHandler = (service, fn: string, logger, config?: { options?: IRouteOptions }): IServiceHandler => {
  const router = new APIRoute(config && config.options ? config.options : undefined);
  router.use(undefined, [createServiceFunctionHandler(service, fn, logger, config), createResponseHandler(logger)]);
  return router.routes();
};

export const createServiceFunctionHandler = (service, fn: string, logger, config?: { options?: IAPIHandlerOptions }): IServiceHandler =>
  createFunctionHandler(async (args) => {
    return service[fn](args);
  }, logger, config);

export const createFunctionHandler = (fn: (args: IServiceArgs) => Promise<any>, logger, config?: { options?: IAPIHandlerOptions }): IServiceHandler =>
  createAPIHandler(async (req: Request, res: Response, next: NextFunction) => {
    const lastServiceResult = await fn(
      new ServiceArg(req)
    );
    logger.debug(`${req.method} set req.results push[${lastServiceResult}]`);
    getResults(req).push(lastServiceResult);
    next();
  }, logger, config)[0];

export const createResponseHandler =
  (logger, config?: { options?: IAPIHandlerOptions }, responseCreator?: (results: any) => APIResponse): IServiceHandler =>
    createAPIHandler(async (req: Request, res: Response, next: NextFunction) => {
      responseCreator = responseCreator ? responseCreator : serviceResponseCreator;
      const results = getResults(req);
      const response = responseCreator(results);
      if (!response) {
        next();
      } else {
        await response.send(res);
      }
    }, logger, config)[0];
