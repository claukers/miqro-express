import {NextFunction, Request, Response} from "express";
import {Util} from "miqro-core";
import {createErrorResponse, createServiceResponse, getResults} from "./handlerutils";

export const ErrorHandler = (logger?) => {
  if (!logger) {
    logger = Util.getLogger("Handler");
  }
  return async (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    const response = await createErrorResponse(err, req);
    if (response) {
      await response.send(res);
    } else {
      next(err);
    }
  };
};

export const Handler = (fn: (results: any[], req: Request, res: Response) => Promise<any>, logger?) => {
  if (!logger) {
    logger = Util.getLogger("Handler");
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    const results = getResults(req);
    const lastServiceResult = await fn(
      results,
      req,
      res
    );
    logger.debug(`${req.method} set req.results push[${lastServiceResult}]`);
    getResults(req).push(lastServiceResult);
    next();
  };
};

export const ResponseHandler = (logger?) => {
  if (!logger) {
    logger = Util.getLogger("ResponseHandler");
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    const results = getResults(req);
    const response = createServiceResponse(results);
    logger.debug(`${req.method} response is [${response}]`);
    if (!response) {
      next();
    } else {
      await response.send(res);
    }
  };
};
