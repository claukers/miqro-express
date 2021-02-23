export * from "./proxyutils";
import { inspect } from "util";
/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Logger, Session, Util, ParseOption, ParseOptionsMode, getLogger } from "@miqro/core";
import { NextFunction, Request, Response } from "express";
import { BasicParseOptions } from "../parse";


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

export type Callback<T = any> = (req: Request) => T;
export type AsyncCallback<T = any> = (req: Request) => Promise<T>;

export type NextCallback = (req: Request, res: Response, next: NextFunction) => void;
export type AsyncNextCallback = (req: Request, res: Response, next: NextFunction) => void;

export type NextHandlerCallback = (req: Request, res: Response) => Promise<boolean>;

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

export const Handler = (fn: AsyncCallback | Callback, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("Handler");
  }
  return NextHandler(async (req, res) => {
    const result = await fn(req);
    if (logger) {
      logger.debug(`request[${req.uuid}] push to results[${inspect(result, {
        depth: 0
      })}]`);
    }
    const results = getResults(req)
    results.push(result);
    setResults(req, results);
    return true;
  });
};

export const NextHandler = (fn: NextHandlerCallback, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("NextHandler");
  }
  return async (req, res, next) => {
    try {
      const callNext = await fn(req, res);
      if (callNext === true) {
        if (logger) {
          logger.debug(`request[${req.uuid}] calling next`);
        }
        next();
      } else if (callNext === false) {
        if (logger) {
          logger.debug(`request[${req.uuid}] ignoring calling next because callback return [${callNext}]`);
        }
      } else {
        if (logger) {
          logger.warn(`request[${req.uuid}] ignoring calling next because callback return [${callNext}]`);
        }
      }
    } catch (e) {
      next(e);
    }
  };
};

export interface ParseResultsHandlerOptions extends BasicParseOptions {
  overrideError?: (e: Error) => Error;
}

export const ParseResultsHandler = (options: ParseResultsHandlerOptions, logger?: Logger): NextCallback => {
  logger = logger ? logger : getLogger("ParseResultsHandler");
  return NextHandler(async (req, res) => {
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
        if (logger) {
          logger.debug(`results mapped to ${inspect(mappedResults)}`);
        }
        setResults(req, mappedResults);
      } else {
        if (logger && req.query.attributes) {
          logger.debug(`ignoring mapping result because req.query.attributes was send`);
        }
      }
      return true;
    } catch (e) {
      if (e.message === "ParseOptionsError" && options.overrideError) {
        throw options.overrideError(e);
      } else {
        throw e;
      }
    }
  }, logger);
};
