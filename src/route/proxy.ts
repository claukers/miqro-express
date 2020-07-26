import {Handler, INextHandlerCallback, Logger, NextErrorHandler, Util} from "@miqro/core";
import {inspect} from "util";
import axios from "axios";
import {createProxyResponse, ProxyOptionsInterface} from "./common/proxyutils";

/**
 * Wraps an axios request and add the response to req.results
 *
 * @param options IProxyOptions options for transforming requests into AxiosRequestConfig
 * @param logger  [OPTIONAL] logger for logging errors ´ILogger´.
 */
export const ProxyHandler = (options: ProxyOptionsInterface, logger?: Logger): INextHandlerCallback => {
  if (!logger) {
    logger = Util.getLogger("ProxyHandler");
  }
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  return Handler(async (req, res) => {
    const resolver = options.proxyService;
    const requestConfig = await resolver.resolveRequest(req);
    if (requestConfig) {
      try {
        const response = await axios.request(requestConfig);
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
export const ProxyResponseHandler = (logger?: Logger): INextHandlerCallback => {
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
