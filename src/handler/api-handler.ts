import { Handler, GroupPolicy, FeatureHandler, ParseRequestOptions, GroupPolicyHandler, ParseRequest } from "@miqro/core";
import { ParseOptions } from "./common";
import { ResponseHandler } from "./response";
import { ResultParser } from "./result";
import { SessionHandler, SessionHandlerOptions } from "./session";

export interface APIHandlerArgs extends APIHandlerOptions {
  handler: FeatureHandler;
  identifier?: string;
}

export interface APIHandlerOptions extends ParseRequestOptions {
  middleware?: Handler[];
  afterSession?: Handler[];
  results?: ParseOptions | ParseOptions[];
  responseHandler?: Handler;
  description?: string;
  session?: SessionHandlerOptions;
  policy?: GroupPolicy;
}

export const APIHandler = (options: APIHandlerArgs): Array<Handler> => {
  const ret: Array<Handler> = options.middleware ? ([] as Handler[]).concat(options.middleware) : [];

  if (options.session || options.policy) {
    if (options.session) {
      ret.push(
        SessionHandler(options.session)
      );
    }
    if (options.policy) {
      ret.push(GroupPolicyHandler(options.policy));
    }
  }

  if (options.afterSession) {
    for(const h of options.afterSession) {
      ret.push(h);
    }
  }

  ret.push(ParseRequest({
    ...options
  }));

  const realHandlers = options.handler;

  if (realHandlers instanceof Array) {
    for (const h of realHandlers) {
      ret.push(h);
    }
  } else {
    ret.push(realHandlers);
  }

  const responseHandlers: Handler[] = [];
  if (options.results) {
    responseHandlers.push(ResultParser(options.results));
    if (options.responseHandler) {
      responseHandlers.push(options.responseHandler);
    } else {
      responseHandlers.push(ResponseHandler());
    }
  } else if (options.responseHandler) {
    responseHandlers.push(options.responseHandler);
  }
  for (const r of responseHandlers) {
    ret.push(r);
  }
  return ret;
};
