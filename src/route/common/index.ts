import { NextFunction, Response } from "express";
import { Util } from "miqro-core";
import { ServiceArg } from "../../service";
import { BadRequestResponse, ErrorResponse, ForbidenResponse, IAPIRequest, NotFoundResponse, ServiceResponse, UnAuthorizedResponse } from "../response";

let logger = null;

export interface IServiceHandler {
  // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
  (req: IAPIRequest, res: Response, next?: NextFunction): Promise<any>;
}

export interface IAPIHandlerOptions {
  allowedMethods?: string[];
}

export interface IRouteOptions extends IAPIHandlerOptions {
  router?: any;
}

export interface IServiceRouteOptions extends IRouteOptions {
  preRoute?: string;
  postRoute?: string;
}

export const createAPIHandler = (handlers: IServiceHandler[] | IServiceHandler, config?: { options?: IAPIHandlerOptions }): IServiceHandler[] => {
  if (handlers instanceof Array) {
    return (handlers as IServiceHandler[]).map((handler) => {
      return createAPIHandlerImpl(handler, config);
    });
  } else {
    return [createAPIHandlerImpl(handlers as IServiceHandler, config)];
  }
};

const createAPIHandlerImpl = (handler: IServiceHandler, config?: { options?: IAPIHandlerOptions }): IServiceHandler =>
  async (req: IAPIRequest, res: Response, next: NextFunction) => {
    try {
      logger = logger ? logger : Util.getLogger("APIHandler");
      if (config && config.options && config.options.allowedMethods && config.options.allowedMethods.indexOf(req.method.toUpperCase()) === -1) {
        new NotFoundResponse().send(res);
      } else {
        if (req.session === undefined) {
          req.session = null;
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

export const createServiceHandler = (service, method: string): IServiceHandler =>
  async (req: IAPIRequest, res: Response) => {
    await new ServiceResponse(
      await service[method](
        new ServiceArg(req)
      )
    ).send(res);
  };

export const createServiceAPIHandler = (service, method: string, config?: { options?: IAPIHandlerOptions }): IServiceHandler =>
  createAPIHandler(
    async (req: IAPIRequest, res: Response) => {
      await new ServiceResponse(
        await service[method](
          new ServiceArg(req)
        )
      ).send(res);
    }, config)[0];
