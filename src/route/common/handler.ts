import {NextFunction, Request, Response} from "express";
import {Util} from "miqro-core";
import {createErrorResponse, createServiceResponse, getResults} from "./handlerutils";

export const NextErrorHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>, logger?) => {
  if (!logger) {
    logger = Util.getLogger("NextErrorHandler");
  }
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

export const ErrorHandler = (logger?) => {
  if (!logger) {
    logger = Util.getLogger("Handler");
  }
  return async (err: Error, req: Request, res: Response, next: NextFunction) => {
    try {
      logger.error(err);
      const response = await createErrorResponse(err, req);
      if (response) {
        await response.send(res);
      } else {
        next(err);
      }
    } catch (e) {
      next(e);
    }
  };
};

export const Handler = (fn: (req: Request, res: Response) => Promise<any>, logger?) => {
  if (!logger) {
    logger = Util.getLogger("Handler");
  }
  return NextErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const lastServiceResult = await fn(
      req,
      res
    );
    logger.debug(`${req.method} set req.results push[${lastServiceResult}]`);
    getResults(req).push(lastServiceResult);
    next();
  }, logger);
};

export const ResponseHandler = (responseFactory?, logger?) => {
  if (!logger) {
    logger = Util.getLogger("ResponseHandler");
  }
  if (!responseFactory) {
    responseFactory = createServiceResponse;
  }
  return NextErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = await responseFactory(req, res);
    logger.debug(`${req.method} response is [${response}]`);
    if (!response) {
      next();
    } else {
      await response.send(res);
    }
  }, logger);
};
