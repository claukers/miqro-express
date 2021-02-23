import { request } from "@miqro/core";
import { inspect } from "util";
import { Context, Handler, createProxyResponse, ProxyOptionsInterface } from "./common";

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

export const ProxyResponseHandler: Handler =
  async (ctx: Context) => {
    const response = createProxyResponse(ctx);
    ctx.logger.debug(`response[${inspect(response, {
      depth: 1
    })}]`);
    if (!response) {
      return true;
    } else {
      response.send(ctx);
      return false;
    }
  }
