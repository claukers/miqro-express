import { ParseOption, parseOptions, ParseOptionsError, ParseOptionsMode, ParseOptionMap, Logger, getLogger } from "@miqro/core";
import { Request } from "express";
import { inspect } from "util";
import { NextCallback, NextHandler } from "./common";

export interface BasicParseOptions {
  disableAsArray?: boolean;
  options: ParseOption[] | ParseOptionMap;
  mode?: ParseOptionsMode;
  ignoreUndefined?: boolean;
}

export interface ParseHandlerOptions {
  query?: BasicParseOptions | false;
  params?: BasicParseOptions | false;
  body?: BasicParseOptions | false;
}

const getParseOption = (option?: BasicParseOptions | false): BasicParseOptions =>
  option ? option : (option === false ? {
    options: [],
    mode: "no_extra"
  } : {
      options: [],
      mode: "add_extra"
    });

const parseRequestPart = (part: "query" | "params" | "body", req: Request, option: BasicParseOptions, logger: Logger) => {
  const value = req[part];
  if (option.disableAsArray && value instanceof Array) {
    throw new ParseOptionsError(`${part} cannot be an array`);
  }
  if (part === "params" && option.ignoreUndefined === undefined) {
    option.ignoreUndefined = true
  }
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i++) {
      req[part][i] = parseOptions(`${part}[${i}]`, value[i], option.options, option.mode, option.ignoreUndefined);
    }
  } else {
    req[part] = parseOptions(part, value, option.options, option.mode, option.ignoreUndefined);
  }
  logger.debug(`req.${part} parsed to [${inspect(req[part])}]`);
}


export const ParseRequestHandler = (options: ParseHandlerOptions, logger?: Logger): NextCallback => {
  const l = logger ? logger : getLogger("ParseRequestHandler");
  const query = getParseOption(options.query);
  const params = getParseOption(options.params);
  const body = getParseOption(options.body);

  return NextHandler(async (req, _res) => {
    parseRequestPart("query", req, query, l);
    parseRequestPart("params", req, params, l);
    parseRequestPart("body", req, body, l);
    return true;
  }, l);
};
