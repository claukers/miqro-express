import {
  APIResponse,
  ServiceResponse
} from "./responses";
import { inspect } from "util";
import { Logger } from "@miqro/core";
import { OutgoingHttpHeaders } from "http";
import { Handler, Context } from "./common";

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

export const ResponseHandler = (options?: ResponseHandlerOptions): Handler => {
  return async (ctx: Context) => {
    ctx.logger.debug(`results[${inspect(ctx.results)}]`);
    const response = options ? options.createResponse(ctx.results) : createServiceResponse(ctx.results);
    if (response !== undefined) {
      ctx.logger.debug(`response[${inspect(response)}]`);
      await response.send(ctx);
    }
    return false;
  };
};


export type HTMLResponseResult = string | { status?: number; headers?: OutgoingHttpHeaders, body?: string; template: (ctx: Context) => Promise<string>; }

export const HTMLResponseHandler = (logger?: Logger): Handler =>
  async (ctx: Context) => {
    const results = ctx.results;
    const lastResult = results[results.length - 1];
    if (logger) {
      logger.debug(`last result is [${lastResult}]`);
    }
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
      const toSend = lastResult.template ? await lastResult.template(ctx) : (typeof lastResult.body === "string" ? lastResult.body : lastResult);
      if (typeof toSend === "string") {
        ctx.res.statusCode = status;
        const headerNames = Object.keys(headers);
        for (const h of headerNames)
          ctx.res.setHeader(h, headers[h]);
        if (logger) {
          logger.debug(`sending [${toSend}]`);
        }
        ctx.res.end(toSend);
        return false;
      } else {
        throw new Error("html result from HTMLResponseResult not string so last result not valid");
      }
    } else {
      throw new Error("html result from HTMLResponseResult not string so last result not valid");
    }
  }


