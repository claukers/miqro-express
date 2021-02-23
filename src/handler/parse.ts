import { ParseOption, parseOptions, ParseOptionsError, ParseOptionsMode, ParseOptionMap } from "@miqro/core";
import { inspect } from "util";
import { Handler, Context } from "./common";

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

const parseRequestPart = (part: "query" | "params" | "body", ctx: Context, option: BasicParseOptions) => {
  const value = ctx[part];
  if (option.disableAsArray && value instanceof Array) {
    throw new ParseOptionsError(`${part} cannot be an array`);
  }
  if (part === "params" && option.ignoreUndefined === undefined) {
    option.ignoreUndefined = true
  }
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i++) {
      (ctx[part] as any)[i] = parseOptions(`${part}[${i}]`, value[i], option.options, option.mode, option.ignoreUndefined) as any;
    }
  } else {
    ctx[part] = parseOptions(`${part}`, value as any, option.options, option.mode, option.ignoreUndefined) as any;
  }
  ctx.logger.debug(`req.${part} parsed to [${inspect(ctx[part])}]`);
}


export const ParseRequestHandler = (options: ParseHandlerOptions): Handler => {
  const query = getParseOption(options.query);
  const params = getParseOption(options.params);
  const body = getParseOption(options.body);

  return async (ctx: Context) => {
    try {
      parseRequestPart("query", ctx, query);
      parseRequestPart("params", ctx, params);
      parseRequestPart("body", ctx, body);
      return true;
    } catch (e) {
      ctx.logger.warn(`error parsing request: ${e.message}`);
      throw e;
    }
  }
};
