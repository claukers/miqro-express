import {
  APIResponse,
  BadRequestResponse,
  ErrorResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ServiceResponse,
  UnAuthorizedResponse
} from "./responses";
import { inspect } from "util";
import { Logger, Util } from "@miqro/core";
import { CatchHandler, ErrorCallback, getResults, NextCallback } from "./common";
import { Request } from "express";
import { OutgoingHttpHeaders } from "http";

export const createErrorResponse = (e: Error): APIResponse | null => {
  if (!e.name || e.name === "Error") {
    return null;
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

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const createServiceResponse = (results: any[]): ServiceResponse | undefined => {
  if (!results || results.length === 0) {
    return undefined;
  }
  const response = results && results.length > 1 ? results : (
    results && results.length === 1 ? results[0] : undefined
  );
  return response !== undefined ? new ServiceResponse(response) : undefined;
};

export interface ResponseHandlerOptions {
  createResponse: (results: any[]) => APIResponse | undefined;
}

/**
 * Express middleware that uses req.results to create a response.
 *
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ResponseHandler = (options?: ResponseHandlerOptions, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("ResponseHandler");
  }
  return (req, res, next) => {
    try {
      const response = options ? options.createResponse(req.results) : createServiceResponse(req.results);
      (logger as Logger).debug(`request[${req.uuid}] results[${inspect(response)}]`);
      if (response === undefined) {
        (logger as Logger).warn(`request[${req.uuid}] results[${inspect(response)}] so not responding and calling next`);
        next();
      } else {
        response.send(res);
      }
    } catch (e) {
      (logger as Logger).error(`request[${req.uuid}] message[${e.message}] stack[${e.stack}]`);
      next(e);
    }
  };
};

export interface ErrorHandlerOptions {
  createResponse: (err: Error) => APIResponse | null;
}

// noinspection SpellCheckingInspection
/**
 * Express middleware that catches sequelize and other known errors. If the error is not **known** the next callback is called.
 *
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ErrorHandler = (options?: ErrorHandlerOptions, logger?: Logger): ErrorCallback => {
  if (!logger) {
    logger = Util.getLogger("ErrorHandler");
  }
  return (err: Error, req, res, next): void => {
    try {
      (logger as Logger).error(`request[${req.uuid}] message[${err.message}]`);
      const response = options ? options.createResponse(err) : createErrorResponse(err);
      if (response) {
        response.send(res);
      } else {
        (logger as Logger).warn(`request[${req.uuid}] cannot create response of error message[${err.message}] so not responding and calling next`);
        next(err);
      }
    } catch (e) {
      (logger as Logger).error(`request[${req.uuid}] message[${e.message}]`);
      next(e);
    }
  };
};

export type HTMLResponseResult = string | { status?: number; headers?: OutgoingHttpHeaders, body?: string; template: (req: Request) => Promise<string>; }

export const HTMLResponseHandler = (logger?: Logger): NextCallback => CatchHandler(async (req, res, next) => {
  logger = logger ? logger : Util.getLogger("HTMLResponseHandle");
  const results = getResults(req);
  const lastResult = results[results.length - 1];
  logger.debug(`last result is [${lastResult}]`);
  if (lastResult && typeof lastResult === "string" ||
    (
      (typeof lastResult.headers === "object" || lastResult.headers === undefined) &&
      (typeof lastResult.status === "number" || lastResult.status === undefined) &&
      (typeof lastResult.body === "string" || typeof lastResult.template === "function")
    )
  ) {
    const status = typeof lastResult.status === "number" ? lastResult.status : 200;
    const headers = typeof lastResult.headers === "object" ? lastResult.headers : {
      "content-type": "text/html"
    };
    const toSend = lastResult.template ? await lastResult.template(req) : (typeof lastResult.body === "string" ? lastResult.body : lastResult);
    if (typeof toSend === "string") {
      res.status(status);
      const headerNames = Object.keys(headers);
      for (const h of headerNames)
        res.setHeader(h, headers[h]);
      logger.debug(`sending [${toSend}]`);
      res.send(toSend);
    } else {
      logger.error("html result from HTMLResponseResult not string so last result not valid");
      next();
    }
  } else {
    logger.warn("last result not valid HTMLResponseResult");
    next();
  }
})
