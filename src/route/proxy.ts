import { Util } from "@miqro/core";
import { Handler, NextErrorHandler, INextHandlerCallback } from "./common";
import { inspect } from "util";
import {createProxyResponse, IProxyOptions} from "./common/proxyutils";

/**
 * Wraps an axios request and add the response to req.results
 *
 * @param options IProxyOptions options for transforming requests into AxiosRequestConfig
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ProxyHandler = (options: IProxyOptions, logger?: any): INextHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("ProxyHandler");
  }
  return Handler(async (req, res) => {
    const resolver = options.proxyService;
    const requestConfig = await resolver.resolveRequest(req);
    if (requestConfig) {
      try {
        const response = await Util.request(requestConfig);
        logger.debug(`request[${req.uuid}] response[${inspect(response)}]`);
        return response;
      } catch (e) {
        logger.error(`request[${req.uuid}] Error connecting to endpoint in [${requestConfig.url}] [${e.message}]`);
        if (e.response) {
          return e.response;
        }
      }
    }
    return null;
  }, logger);
};

/**
 * Express middleware that uses the last req.results to create a proxy response.
 *
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ProxyResponseHandler = (logger?): INextHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("ResponseHandler");
  }
  return NextErrorHandler(async (req, res, next) => {
    const response = await createProxyResponse(req);
    logger.debug(`request[${req.uuid}] response[${inspect(response)}]`);
    if (!response) {
      next();
    } else {
      await response.send(res);
    }
  }, logger);
};
