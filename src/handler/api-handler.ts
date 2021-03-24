import { GroupPolicy } from "@miqro/core";
import { ParseOptions, Handler } from "./common";
import { FeatureHandler } from "./feature-router";
import { GroupPolicyHandler } from "./group";
import { JSONfyResultsHandler } from "./jsonfy";
import { ParseRequest, ParseRequestOptions } from "./parse";
import { ResponseHandler } from "./response";
import { ResultParser } from "./result";
import { SessionHandler, SessionHandlerOptions } from "./session";
import { TagResponseUUIDHandler } from "./tag";

export interface APIHandlerArgs extends APIHandlerOptions {
  handler: FeatureHandler;
  identifier?: string;
}

export interface APIHandlerOptions extends ParseRequestOptions {
  middleware?: Handler[];
  results?: ParseOptions;
  responseHandler?: Handler;
  description?: string;
  session?: SessionHandlerOptions;
  policy?: GroupPolicy;
  jsonfy?: true;
  tag?: true;
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
    if (options.jsonfy) {
      responseHandlers.push(JSONfyResultsHandler());
    }
    if (options.tag) {
      responseHandlers.push(TagResponseUUIDHandler());
    }
    responseHandlers.push(ResultParser(options.results));
    if (options.responseHandler) {
      responseHandlers.push(options.responseHandler);
    } else {
      responseHandlers.push(ResponseHandler());
    }
  } else if (options.responseHandler) {
    if (options.jsonfy) {
      responseHandlers.push(JSONfyResultsHandler());
    }
    if (options.tag) {
      responseHandlers.push(TagResponseUUIDHandler());
    }
    responseHandlers.push(options.responseHandler);
  }
  for (const r of responseHandlers) {
    ret.push(r);
  }
  return ret;
};
