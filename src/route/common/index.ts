import { NextFunction, Request, Response, Router } from "express";
import { IServiceArgs } from "miqro-core";
import { ServiceArg } from "../../service";
import { BadRequestResponse, ErrorResponse, ForbidenResponse, NotFoundResponse, ServiceResponse, UnAuthorizedResponse } from "../response";

export const setResults = (req: Request, results: any[]) => {
  (req as any).results = results;
};

export const pushResults = (req: Request, result: any) => {
  getResults(req).push(result);
};

export const getResults = (req: Request): any[] => {
  if (!((req as any).results)) {
    setResults(req, []);
  }
  return (req as any).results;
};

const createAPIHandlerImpl = (handler: IServiceHandler, logger, config?: { options?: IAPIHandlerOptions }): IServiceHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (config && config.options && config.options.allowedMethods && config.options.allowedMethods.indexOf(req.method.toUpperCase()) === -1) {
        new NotFoundResponse().send(res);
      } else {
        if ((req as any).session === undefined) {
          (req as any).session = null;
        }
        await handler(req, res, next);
      }
    } catch (e) {
      if (e.isMethodNotImplementedError) {
        await new NotFoundResponse().send(res);
      } else if (e.isForbidenError) {
        await new ForbidenResponse(e.message).send(res);
      } else if (e.isUnAuthorizeError) {
        await new UnAuthorizedResponse(e.message).send(res);
      } else if (e.isParserOptionsError) {
        await new BadRequestResponse(e.message).send(res);
      } else if (e.name === "SequelizeValidationError") {
        await new BadRequestResponse(e.message).send(res);
      } else if (e.name === "SequelizeEagerLoadingError") {
        await new BadRequestResponse(e.message).send(res);
      } else if (e.name === "SequelizeUniqueConstraintError") {
        await new BadRequestResponse(e.message).send(res);
      } else {
        logger.error(e);
        await new ErrorResponse(e.message).send(res);
      }
    }
  };

export interface IServiceHandler {
  // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
  (req: Request, res: Response, next?: NextFunction): Promise<any>;
}

export interface IAPIHandlerOptions {
  allowedMethods?: string[];
}

export interface IRouteOptions extends IAPIHandlerOptions {
  router?: any;
}

export interface IServiceRouteOptions extends IRouteOptions {
  name?: any;
  preRoute?: string;
  postRoute?: string;
}

export const createAPIHandler =
  (handlers: IServiceHandler[] | IServiceHandler, logger, config?: { options?: IAPIHandlerOptions }): IServiceHandler[] => {
    if (handlers instanceof Array) {
      return (handlers as IServiceHandler[]).map((handler) => {
        return createAPIHandlerImpl(handler, logger, config);
      });
    } else {
      return [createAPIHandlerImpl(handlers as IServiceHandler, config)];
    }
  };

export const createServiceResponseHandler = () =>
  async (req: Request, res: Response) => {
    const results = getResults(req);
    const response = results && results.length > 1 ? results : (
      results && results.length === 1 ? results[0] : null
    );
    await new ServiceResponse(response).send(res);
  };

export const createServiceHandler = (service, method: string, logger): IServiceHandler => {
  const router = Router();
  router.use([createServiceMethodHandler(service, method, logger), createServiceResponseHandler()]);
  return router;
};

export const createServiceMethodHandler = (service, method: string, logger): IServiceHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    const lastServiceResult = await service[method](
      new ServiceArg(req)
    );
    logger.debug(`${req.method} set req.results push[${lastServiceResult}]`);
    pushResults(req, lastServiceResult);
    next();
  };

export const createHandler = (method: (args: IServiceArgs) => Promise<any>, logger): IServiceHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    const lastServiceResult = await method(
      new ServiceArg(req)
    );
    logger.debug(`${req.method} set req.results push[${lastServiceResult}]`);
    pushResults(req, lastServiceResult);
    next();
  };

export const createServiceAPIHandler = (service, method: string, logger, config?: { options?: IAPIHandlerOptions }): IServiceHandler =>
  createAPIHandler(
    createServiceHandler(service, method, logger), logger, config)[0];
