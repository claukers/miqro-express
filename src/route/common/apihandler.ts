import { NextFunction, Request, Response } from "express";
import { BadRequestResponse, ErrorResponse, ForbidenResponse, NotFoundResponse, UnAuthorizedResponse } from "../response";

export interface IServiceHandler {
  // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
  (req: Request, res: Response, next?: NextFunction): Promise<any>;
}

export interface IAPIHandlerOptions {
  allowedMethods?: string[];
}

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
