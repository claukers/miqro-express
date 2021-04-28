import { Handler, Context, parseOptions, ParseOptionsError } from "@miqro/core";
import { inspect } from "util";
import { getParseOption, ParseOptions } from "./common";

export interface ParseRequestOptions {
  query?: ParseOptions | false;
  // params?: ParseOptions | false;
  body?: ParseOptions | false;
}

const parseRequestPart = (part: "query" | "body"/*| "params"*/, ctx: Context, option: ParseOptions) => {
  const value = ctx[part] === undefined ? {} : ctx[part];
  if (option.disableAsArray && value instanceof Array) {
    throw new ParseOptionsError(`${part} cannot be an array`);
  }
  /*if (part === "params" && option.ignoreUndefined === undefined) {
    option.ignoreUndefined = true
  }*/
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i++) {
      (ctx[part] as any)[i] = parseOptions(`${part}[${i}]`, value[i], option.options, option.mode, option.ignoreUndefined) as any;
    }
  } else {
    ctx[part] = parseOptions(`${part}`, value as any, option.options, option.mode, option.ignoreUndefined) as any;
  }
  ctx.logger.debug(`req.${part} parsed to [${inspect(ctx[part])}]`);
}


export const ParseRequest = (options: ParseRequestOptions): Handler => {
  const query = getParseOption(options.query);
  // const params = getParseOption(options.params);
  const body = getParseOption(options.body);

  return async (ctx: Context) => {
    try {
      try {
        parseRequestPart("query", ctx, query);
      } catch (e) {
        ctx.logger.error(`error parsing query %s`, inspect(ctx.query));
        throw e;
      }

      // parseRequestPart("params", ctx, params);
      try {
        parseRequestPart("body", ctx, body);
      } catch (e) {
        ctx.logger.error(`error parsing body %s`, inspect(ctx.body));
        throw e;
      }
      return true;
    } catch (e) {
      ctx.logger.warn(`error parsing request: ${e.message}`);
      throw e;
    }
  }
};
