export * from "./proxyutils";
import {inspect} from "util";
/* eslint-disable  @typescript-eslint/no-unused-vars */
import {Logger, Session, Util, ParseOption, ParseOptionsMode} from "@miqro/core";
import {NextFunction, Request, Response} from "express";


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
  }, logger);
};

/**
 * Wraps an async express handler with next argument and if the function throws it's passed as next(...)
 *
 * @param fn  express request handler ´async function´.
 * @param logger  [OPTIONAL] logger for logging errors ´Logger´.
 */
export const CatchHandler = (fn: AsyncNextCallback, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("NextHandler");
  }
  return async (req, res, next) => {
    let handleError: ((err: Error) => void) | any = (err: Error) => {
      if (logger) {
        logger.error(`request[${req.uuid}] message[${err.message}] stack[${err.stack}]`);
      }
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


export interface HandleAllOptionsOutput {
  req: Request;
  handlers: NextCallback[] | AsyncNextCallback[];
}

export type HandleAllOptions = (req: Request) => Promise<HandleAllOptionsOutput[]>;

export const HandleAll = (generator: HandleAllOptions, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("HandleAll");
  }
  return Handler(async (req) => {
    return Promise.all((await generator(req)).map((call) => {
      return new Promise((resolve, reject) => {
        const toCall = call.handlers.reverse();
        const nextCaller = async () => {
          try {
            const handler = toCall.pop();
            if (!handler) {
              resolve(getResults(call.req))
            } else {
              await handler(call.req, null as unknown as Response, (e?: any) => {
                if (e) {
                  reject(e);
                } else {
                  setTimeout(nextCaller, 0);
                }
              });
            }
          } catch (e) {
            reject(e);
          }
        };
        setTimeout(nextCaller, 0);
      })
    }));
  }, logger);
};

export const ParseResultsHandler = (options: {mode: ParseOptionsMode; options: ParseOption[]; ignoreUndefined?: boolean}, logger?: Logger): AsyncNextCallback => {
  logger ? logger : Util.getLogger("ParseResultsHandler");
  return async (req, res, next) => {
    const results = getResults(req);
    if (results) {
      const mappedResults = results.map((result) => {
        if (!result) {
          return null;
        } else {
          if (result instanceof Array) {
            return result.map((value, index, array) => {
              return Util.parseOptions(`results[${index}]`, value, options.options, options.mode, options.ignoreUndefined);
            });
          } else if (result.rows instanceof Array) {
            return {
              ...result,
              rows: result.rows.map((value: any, index: number, array: any[]) => {
                return Util.parseOptions(`results.rows[${index}]`, value, options.options, options.mode, options.ignoreUndefined);
              })
            };
          } else {
            const [ret] = [result].map((value, index, array) => {
              return Util.parseOptions(`results`, value, options.options, options.mode, options.ignoreUndefined);
            });
            return ret;
          }
        }
      });
      setResults(req, mappedResults);
      next();
    }
  };
};
