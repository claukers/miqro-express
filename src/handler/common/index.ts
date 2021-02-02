export * from "./proxyutils";
import { inspect } from "util";
/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Logger, Session, Util, ParseOption, ParseOptionsMode } from "@miqro/core";
import { NextFunction, Request, Response } from "express";


/* eslint-disable  @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    // tslint:disable-next-line:interface-name
    interface Request {
      results: any[];
      session?: Session;
      uuid: string;
    }
  }
}

export type ErrorCallback<T = void> = (err: Error, req: Request, res: Response, next: NextFunction) => T;

export type Callback<T = any> = (req: Request, res: Response) => T;
export type AsyncCallback<T = any> = (req: Request, res: Response) => Promise<T>;

export type NextCallback = (req: Request, res: Response, next: NextFunction) => void;
export type AsyncNextCallback = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const setResults = (req: Request, results: any[]): void => {
  (req as Request).results = results;
};

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const getResults = (req: Request): any[] => {
  if (!((req as Request).results)) {
    setResults(req, []);
  }
  return (req as Request).results;
};

/**
 * Wraps an async express request handler but catches the return value and appends it to req.results before calling next(). if the function throws the error is passed as next(..)
 *
 * @param fn  express request handler ´async function´.
 * @param logger  [OPTIONAL] logger for logging errors ´Logger´.
 */
export const Handler = (fn: AsyncCallback | Callback, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("Handler");
  }
  return CatchHandler(async (req, res, next) => {
    const result = await fn(req, res);
    if (logger) {
      logger.debug(`request[${req.uuid}] push to results[${inspect(result)}]`);
    }
    const results = getResults(req)
    results.push(result);
    setResults(req, results);
    next();
  });
};

/**
 * Wraps an async express handler with next argument and if the function throws it's passed as next(...)
 *
 * @param fn  express request handler ´async function´.
 */
export const CatchHandler = (fn: AsyncNextCallback): NextCallback => {
  return async (req, res, next) => {
    let handleError: ((err: Error) => void) | any = (err: Error) => {
      handleError = null;
      next(err);
    }
    try {
      await fn(req, res, (err?: any) => {
        if (err) {
          handleError(err);
        } else {
          next();
        }
      });
    } catch (e) {
      handleError(e);
    }
  };
};

export const NextHandler = CatchHandler;

export interface ParseResultsHandlerOptions {
  overrideError?: (e: Error) => Error;
  mode: ParseOptionsMode;
  options: ParseOption[];
  ignoreUndefined?: boolean;
}

export const ParseResultsHandler = (options: ParseResultsHandlerOptions): NextCallback => {
  return NextHandler(async (req, res, next) => {
    const results = getResults(req);
    try {
      if (results && !req.query.attributes) {
        const mappedResults = [];
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (result instanceof Array) {
            for (let j = 0; j < result.length; j++) {
              const r = result[j];
              mappedResults.push(Util.parseOptions(`results[${i}][${j}]`, r, options.options, options.mode, options.ignoreUndefined));
            }
          } else {
            mappedResults.push(Util.parseOptions(`results[${i}]`, result, options.options, options.mode, options.ignoreUndefined));
          }
        }
        setResults(req, mappedResults);
        next();
      } else {
        next();
      }
    } catch (e) {
      if (e.message === "ParseOptionsError" && options.overrideError) {
        throw options.overrideError(e);
      } else {
        throw e;
      }
    }
  });
};

export const IdResult: ParseResultsHandlerOptions = {
  options: [
    { name: "id", type: "number", required: true, description: "the id of the operation." }
  ],
  mode: "remove_extra"
};

export const CountResult: ParseResultsHandlerOptions = {
  options: [
    { name: "count", type: "number", required: true, description: "the count of the operation." }
  ],
  mode: "remove_extra"
};
