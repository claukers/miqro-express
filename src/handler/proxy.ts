import { Context, Handler, request, RequestResponse } from "@miqro/core";
import { inspect } from "util";
import { ProxyOptionsInterface } from "./common";

export const ProxyHandler = (options: ProxyOptionsInterface): Handler<RequestResponse> =>
  async (ctx): Promise<RequestResponse> => {
    const resolver = options.proxyService;
    const requestConfig = await resolver.resolveRequest(ctx);
    try {
      ctx.logger.debug(`proxy resolveRequest to [${inspect(requestConfig, {
        depth: 1
      })}]`);
      const response = await request(requestConfig);
      ctx.logger.trace(`response[${inspect(response, {
        depth: 0
      })}]`);
      return response;
    } catch (e) {
      ctx.logger.error(`Error connecting to endpoint in [${requestConfig.url}] [${e.message}]`);
      if (e.response) {
        return e.response;
      } else {
        throw e;
      }
    }
  }

export const ProxyResponseHandler = (): Handler<void> =>
  async (ctx: Context): Promise<void> => {
    if (!ctx.results || ctx.results.length === 0) {
      throw new Error(`no response to send. Is your handler returning a value differente than boolean 'true|false' ?`);
    } else {
      const lastResult = ctx.results[ctx.results.length - 1];
      ctx.logger.debug(`response[${inspect(lastResult, {
        depth: 0
      })}]`);
      await ctx.end({
        headers: lastResult.headers,
        body: lastResult.data,
        status: lastResult.status
      });
    }
  }
