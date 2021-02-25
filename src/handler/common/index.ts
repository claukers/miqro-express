import { ParseOption, ParseOptionMap, ParseOptionsMode } from "@miqro/core";
import { OutgoingHttpHeaders } from "http";
import { APIResponse, BadRequestResponse, ErrorResponse, ForbiddenResponse, NotFoundResponse, ServiceResponse, UnAuthorizedResponse } from "../../responses";
import { Method } from "../feature-router";
import { Router } from "../router";
import { Context } from "./context";

export * from "./context";
export * from "./proxyutils";

export interface AppHandler {
  handler: Handler | Handler[] | Router;
  method?: Method;
  path?: string;
}

export const createServiceResponse = (ctx: Context): ServiceResponse | undefined => {
  if (!ctx.results || ctx.results.length === 0) {
    return undefined;
  }
  const response = ctx.results && ctx.results.length > 1 ? ctx.results : (
    ctx.results && ctx.results.length === 1 ? ctx.results[0] : undefined
  );
  return response !== undefined ? new ServiceResponse(response) : undefined;
};

export interface Response<T = any> {
  body?: T;
  status: number;
  headers: OutgoingHttpHeaders;
  send(ctx: Context): Promise<void>;
}

export type Handler = (ctx: Context) => Promise<boolean | void | any>;

export type ErrorHandler = (e: Error, ctx: Context) => Promise<boolean | void | any>;

export interface ParseOptions {
  disableAsArray?: boolean;
  options: ParseOption[] | ParseOptionMap;
  mode?: ParseOptionsMode;
  ignoreUndefined?: boolean;
}

const NO_OPTIONS: ParseOptions = {
  options: [],
  mode: "no_extra"
};

export const getParseOption = (option?: ParseOptions | false): ParseOptions =>
  option ? option : (option === false ? NO_OPTIONS : {
    options: [],
    mode: "add_extra"
  });

export const createErrorResponse = (e: Error): APIResponse | null => {
  if (!e.name || e.name === "Error") {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      return new ErrorResponse(`${e.message}. You are seeing this message because NODE_ENV === "development" || NODE_ENV === "test"`);
    } else {
      return null;
    }
  } else {
    switch (e.name) {
      case "MethodNotImplementedError":
        return new NotFoundResponse();
      case "ForbiddenError":
        return new ForbiddenResponse(e.message);
      case "UnAuthorizedError":
        return new UnAuthorizedResponse(e.message);
      case "ParseOptionsError":
      case "SequelizeValidationError":
      case "SequelizeEagerLoadingError":
      case "SequelizeUniqueConstraintError":
        return new BadRequestResponse(e.message);
      default:
        return new ErrorResponse(e);
    }
  }
};
