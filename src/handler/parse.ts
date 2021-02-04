import { ParseOption, parseOptions, ParseOptionsError, ParseOptionsMode, SimpleMap, NoNameParseOption } from "@miqro/core";
import { CatchHandler, NextCallback } from "./common";

export interface BasicParseOptions {
  disableAsArray?: boolean;
  options: ParseOption[] | SimpleMap<NoNameParseOption>;
  mode?: ParseOptionsMode;
  ignoreUndefined?: boolean;
}

export interface ParseHandlerOptions extends BasicParseOptions {
  requestPart: "body" | "query" | "params" | "results" | "uuid" | "session";
}

export const ParseHandler = (options: ParseHandlerOptions): NextCallback => {
  return CatchHandler(async (req, res, next) => {
    const value = req[options.requestPart];
    if (options.disableAsArray && value instanceof Array) {
      throw new ParseOptionsError(`${options.requestPart} cannot be an array`);
    }
    if (value instanceof Array) {
      for (let i = 0; i < value.length; i++) {
        req[options.requestPart][i] = parseOptions(`${options.requestPart}[${i}]`, value[i], options.options, options.mode, options.ignoreUndefined);
      }
    } else {
      req[options.requestPart] = parseOptions(options.requestPart, value, options.options, options.mode, options.ignoreUndefined);
    }
    next();
  });
};
