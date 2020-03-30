import {Util} from "@miqro/core";
import {
  createErrorResponse,
  createServiceResponse,
  getResults,
  IErrorHandlerCallback,
  IHandlerCallback,
  INextHandlerCallback
} from "./handlerutils";
import {inspect} from "util";

/**
 * Wraps an async express request handler that when the function throws it is correctly handled by calling the next function
 *
 * @param fn  express request handler ´async function´.
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const NextErrorHandler = (fn: INextHandlerCallback, logger?): INextHandlerCallback => {
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

// noinspection SpellCheckingInspection
/**
 * Express middleware that catches sequelize and other known errors. If the error is not **known** the next callback is called.
 *
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ErrorHandler = (logger?): IErrorHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("ErrorHandler");
  }
  return async (err: Error, req, res, next) => {
    try {
      logger.error(`request[${req.uuid}] ${inspect(err)}`);
      const response = await createErrorResponse(err);
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
export const Handler = (fn: IHandlerCallback, logger?): INextHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("Handler");
  }
  return NextErrorHandler(async (req, res, next) => {
    const lastServiceResult = await fn(
      req,
      res
    );
    logger.debug(`request[${req.uuid}] push result[${inspect(lastServiceResult)}]`);
    getResults(req).push(lastServiceResult);
    next();
  }, logger);
};

/**
 * Express middleware that uses req.results to create a response.
 *
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ResponseHandler = (logger?): INextHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("ResponseHandler");
  }
  return NextErrorHandler(async (req, res, next) => {
    const response = await createServiceResponse(req);
    logger.debug(`request[${req.uuid}] response[${inspect(response)}]`);
    if (!response) {
      next();
    } else {
      await response.send(res);
    }
  }, logger);
};
