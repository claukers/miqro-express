import { NextFunction, Request, Response, Router } from "express";
import { ServiceArg } from "../../service";
import { BadRequestResponse, ErrorResponse, ForbidenResponse, NotFoundResponse, ServiceResponse, UnAuthorizedResponse } from "../response";

export const pushServiceResults = (req: Request, result: any) => {
  getServiceResults(req).push(result);
};

export const getServiceResults = (req: Request): any[] => {
  if (!((req as any).serviceResults)) {
    (req as any).serviceResults = [];
  }
  return (req as any).serviceResults;
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
    const serviceResults = getServiceResults(req);
    const response = serviceResults && serviceResults.length > 1 ? serviceResults : (
      serviceResults && serviceResults.length === 1 ? serviceResults[0] : null
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
    logger.debug(`${req.method} set req.serviceResults push[${lastServiceResult}]`);
    pushServiceResults(req, lastServiceResult);
    next();
  };

export const createServiceAPIHandler = (service, method: string, logger, config?: { options?: IAPIHandlerOptions }): IServiceHandler =>
  createAPIHandler(
    createServiceHandler(service, method, logger), logger, config)[0];
