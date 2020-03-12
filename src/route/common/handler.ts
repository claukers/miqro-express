import {Util} from "@miqro/core";
import {NextFunction, Request, Response} from "express";
import {createErrorResponse, createServiceResponse, getResults} from "./handlerutils";

/**
 * Wraps an async express request handler that when the function throws it is correctly handled by calling the next function
 *
 * @param fn  express request handler ´async function´.
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const NextErrorHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>, logger?) => {
  if (!logger) {
    logger = Util.getLogger("NextErrorHandler");
  }
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      logger.error(e);
      next(e);
    }
  };
};

/**
 * Express middleware that catches sequelize and other known errors. If the error is not **known** the next callback is called.
 *
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ErrorHandler = (logger?) => {
  if (!logger) {
    logger = Util.getLogger("ErrorHandler");
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

/**
 * Wraps an async express request handler but catches the return value and appends it to req.results
 *
 * @param fn  express request handler ´async function´.
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
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

/**
 * Express middleware that uses req.resutls to create a response.
 *
 * @param responseFactory  [OPTIONAL] factory to create the response ´async function´.
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
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
