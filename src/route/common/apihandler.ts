import { NextFunction, Request, Response } from "express";
import { APIResponse, BadRequestResponse, ErrorResponse, ForbidenResponse, NotFoundResponse, UnAuthorizedResponse } from "../response";

export interface IServiceHandler {
  // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
  (req: Request, res: Response, next?: NextFunction): Promise<any>;
}

export interface IAPIHandlerOptions {
  allowedMethods?: string[];
  errorResponse?: (e: Error, req: Request) => Promise<APIResponse>;
}

export const defaultErrorResponse = async (e: Error, req: Request): Promise<APIResponse> => {
  if ((e as any).isMethodNotImplementedError) {
    return new NotFoundResponse();
  } else if ((e as any).isForbidenError) {
    return new ForbidenResponse(e.message);
  } else if ((e as any).isUnAuthorizeError) {
    return new UnAuthorizedResponse(e.message);
  } else if ((e as any).isParserOptionsError) {
    return new BadRequestResponse(e.message);
  } else if (e.name === "SequelizeValidationError") {
    return new BadRequestResponse(e.message);
  } else if (e.name === "SequelizeEagerLoadingError") {
    return new BadRequestResponse(e.message);
  } else if (e.name === "SequelizeUniqueConstraintError") {
    return new BadRequestResponse(e.message);
  } else {
    return new ErrorResponse(e);
  }
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
      logger.error(e);
      const response = config && config.options && config.options.errorResponse ?
        await config.options.errorResponse(e, req) : await defaultErrorResponse(e, req);
      if (!response) {
        logger.error(`un handled error [${e.message}]`);
        throw e;
      } else {
        await response.send(res);
      }
    }
  };

export const createAPIHandler =
  (handlers: IServiceHandler[] | IServiceHandler, logger, config?: { options?: IAPIHandlerOptions }): IServiceHandler[] => {
    if (handlers instanceof Array) {
      return (handlers as IServiceHandler[]).map((handler) => {
        return createAPIHandlerImpl(handler, logger, config);
      });
    } else {
      return [createAPIHandlerImpl(handlers as IServiceHandler, logger, config)];
    }
  };
