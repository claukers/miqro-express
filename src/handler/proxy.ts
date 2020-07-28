import {Logger, Util} from "@miqro/core";
import {inspect} from "util";
import {createProxyResponse, Handler, NextCallback, ProxyOptionsInterface} from "./common";

/**
 * Wraps a request and add the response to req.results
 *
 * @param options IProxyOptions options for transforming requests into a request
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ProxyHandler = (options: ProxyOptionsInterface, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("ProxyHandler");
  }
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  return Handler(async (req) => {
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
export const ProxyResponseHandler = (logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("ResponseHandler");
  }
  return (req, res, next) => {
    const response = createProxyResponse(req);
    logger.debug(`request[${req.uuid}] response[${inspect(response)}]`);
    if (!response) {
      next();
    } else {
      response.send(res);
    }
  };
};
