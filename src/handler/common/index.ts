import { ParseOption, ParseOptionMap, ParseOptionsError, ParseOptionsMode } from "@miqro/core";
import { OutgoingHttpHeaders } from "http";
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

export interface Response<T = any> {
  body?: T;
  status: number;
  headers: OutgoingHttpHeaders;
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

export const BadRequestError = ParseOptionsError;
