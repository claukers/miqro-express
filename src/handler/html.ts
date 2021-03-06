import { OutgoingHttpHeaders } from "http";
import { Context, Handler } from "@miqro/core";

export type HTMLResponseResult = string | { status?: number; headers?: OutgoingHttpHeaders, body?: string; template: (ctx: Context) => Promise<string>; }

export const HTMLResponseHandler = (): Handler<void> =>
  async (ctx: Context): Promise<void> => {
    const results = ctx.results;
    const lastResult = results[results.length - 1];
    ctx.logger.trace(`last result is [${lastResult}]`);
    if (lastResult && typeof lastResult === "string" ||
      (
        (typeof lastResult.headers === "object" || lastResult.headers === undefined) &&
        (typeof lastResult.status === "number" || lastResult.status === undefined) &&
        (typeof lastResult.body === "string" || typeof lastResult.template === "function")
      )
    ) {
      const status = typeof lastResult.status === "number" ? lastResult.status : 200;
      const headers = typeof lastResult.headers === "object" ? lastResult.headers : {
        "content-type": "text/html; charset=utf-8"
      };
      const toSend = lastResult.template ? await lastResult.template(ctx) : (typeof lastResult.body === "string" ? lastResult.body : lastResult);
      if (typeof toSend === "string") {
        ctx.logger.debug(`sending [${toSend}]`);
        await ctx.end({
          status,
          headers,
          body: toSend
        });
      } else {
        throw new Error("html result from HTMLResponseResult not string so last result not valid");
      }
    } else {
      throw new Error("html result from HTMLResponseResult not string so last result not valid");
    }
  }
