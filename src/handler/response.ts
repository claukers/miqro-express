import {
  APIResponse,
  BadRequestResponse,
  ErrorResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ServiceResponse,
  UnAuthorizedResponse
} from "./responses";
import {inspect} from "util";
import {Logger, Util} from "@miqro/core";
import {ErrorCallback, NextCallback} from "./common";
import {Request} from "express";

export const createErrorResponse = (e: Error): APIResponse => {
  if (!e.name || e.name === "Error") {
    return null;
  } else {
    // noinspection SpellCheckingInspection
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

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const createServiceResponse = (req: Request): ServiceResponse => {
  const {results} = req;
  if (!results || results.length === 0) {
    return null;
  }
  const response = results && results.length > 1 ? results : (
    results && results.length === 1 ? results[0] : null
  );
  return new ServiceResponse(response);
};

/**
 * Express middleware that uses req.results to create a response.
 *
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ResponseHandler = (logger?: Logger): NextCallback<void> => {
  if (!logger) {
    logger = Util.getLogger("ResponseHandler");
  }
  return (req, res, next) => {
    try {
      const response = createServiceResponse(req);
      logger.debug(`request[${req.uuid}] response[${inspect(response)}]`);
      if (!response) {
        next();
      } else {
        response.send(res);
      }
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
export const ErrorHandler = (logger?: Logger): ErrorCallback<void> => {
  if (!logger) {
    logger = Util.getLogger("ErrorHandler");
  }
  return (err: Error, req, res, next): void => {
    try {
      logger.error(`request[${req.uuid}] ${inspect(err)}`);
      const response = createErrorResponse(err);
      if (response) {
        response.send(res);
      } else {
        next(err);
      }
    } catch (e) {
      logger.error(e);
      next(e);
    }
  };
};