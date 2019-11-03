import {NextFunction, Request, Response} from "express";
import {APIResponse, BadRequestResponse, ErrorResponse, ForbiddenResponse, NotFoundResponse, UnAuthorizedResponse} from "../response";

export interface IServiceHandler {
  // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
  (req: Request, res: Response, next?: NextFunction): Promise<any>;
}

export interface IAPIHandlerOptions {
  allowedMethods?: string[];
  errorResponse?: (e: Error, req: Request) => Promise<APIResponse>;
}

// noinspection JSUnusedLocalSymbols
export const defaultErrorResponse = async (e: Error, req: Request): Promise<APIResponse> => {
  if (!e.name) {
    return new ErrorResponse(e);
  } else {
    switch (e.name) {
      case "MethodNotImplementedError":
        return new NotFoundResponse();
      case "ForbiddenError":
        return new ForbiddenResponse(e.message);
      case "UnAuthorizedError":
        return new UnAuthorizedResponse(e.message);
      case "ParseOptionsError":
      case "SequelizeValidationError":
      case "SequelizeEagerLoadingError":
      case "SequelizeUniqueConstraintError":
        return new BadRequestResponse(e.message);
      default:
        return new ErrorResponse(e);
    }
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
