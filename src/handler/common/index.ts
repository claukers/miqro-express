export * from "./proxyutils";
import {inspect} from "util";
/* eslint-disable  @typescript-eslint/no-unused-vars */
import {Logger, Session, Util} from "@miqro/core";
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

export type NextCallback<T = void> = (req: Request, res: Response, next: NextFunction) => T;
export type AsyncNextCallback<T = void> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

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
 * Wraps an async express request handler but catches the return value and appends it to req.results
 *
 * @param fn  express request handler ´async function´.
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const Handler = (fn: AsyncCallback | Callback, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("Handler");
  }
  return (req, res, next) => {
    let handleError: ((err: Error) => void) | null = (err: Error) => {
      if (logger) {
        logger.error(err);
      }
      handleError = null;
      next(err);
    }
    try {
      const p = fn(req, res);
      let handleResult: ((result: any) => void) | null = (result: any) => {
        if (logger) {
          logger.debug(`request[${req.uuid}] push to results[${inspect(result)}]`);
        }
        getResults(req).push(result);
        next();
        handleResult = null;
      }
      if (p instanceof Promise) {
        p.then(handleResult).catch(handleError);
      } else {
        handleResult(p);
      }
    } catch (e) {
      handleError(e);
    }
  };
};


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
        const nextCaller = () => {
          const handler = toCall.pop();
          if (!handler) {
            resolve(getResults(call.req))
          } else {
            handler(call.req, null as unknown as Response, (e?: any) => {
              if (e) {
                reject(e);
              } else {
                setTimeout(nextCaller, 0);
              }
            });
          }
        };
        setTimeout(nextCaller, 0);
      })
    }));
  }, logger);
};
