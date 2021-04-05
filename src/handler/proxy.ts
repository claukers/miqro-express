import { Context, Handler, request } from "@miqro/core";
import { inspect } from "util";
import { ProxyOptionsInterface } from "./common";

export const ProxyHandler = (options: ProxyOptionsInterface): Handler =>
  async (ctx) => {
    const resolver = options.proxyService;
    const requestConfig = await resolver.resolveRequest(ctx);
    try {
      ctx.logger.debug(`proxy resolveRequest to [${inspect(requestConfig, {
        depth: 1
      })}]`);
      const response = await request(requestConfig);
      ctx.logger.debug(`response[${inspect(response, {
        depth: 0
      })}]`);
      ctx.results.push(response);
      return true;
    } catch (e) {
      ctx.logger.error(`Error connecting to endpoint in [${requestConfig.url}] [${e.message}]`);
      if (e.response) {
        ctx.results.push(e.response);
        return true;
      } else {
        throw e;
      }
    }
  }

export const ProxyResponseHandler = (): Handler =>
  async (ctx: Context) => {
    if (!ctx.results || ctx.results.length === 0) {
      return null;
    }
    const r = ctx.results && ctx.results.length > 1 ? ctx.results[ctx.results.length - 1] : (
      ctx.results && ctx.results.length === 1 ? ctx.results[0] : null
    );

    ctx.logger.debug(`response[${inspect(r, {
      depth: 0
    })}]`);
    ctx.end({
      headers: r.headers,
      body: r.data,
      status: r.status
    });
  }
