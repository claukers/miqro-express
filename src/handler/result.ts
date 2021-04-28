import { Context, Handler, parseOptions, ParseOptionsError } from "@miqro/core";
import { inspect } from "util";
import { ParseOptions } from "./common";

export const ResultParser = (options: ParseOptions): Handler =>
  async (ctx: Context) => {
    if (!ctx.results || ctx.results.length === 0) {
      ctx.logger.debug(`not parsing results`);
      return undefined;
    } else {
      const index = ctx.results.length - 1;
      const lastResult = ctx.results[ctx.results.length - 1];
      ctx.logger.debug(`parsing lastResult[%s]`, inspect(lastResult));
      try {
        if (options.disableAsArray && lastResult instanceof Array) {
          throw new ParseOptionsError(`ctx.results cannot be an array [%s]`, inspect(lastResult));
        }
        if (lastResult instanceof Array && !options.disableAsArray) {
          const newList = [];
          ctx.logger.debug("last result is array and options.disableAsArray is not set so iterating");
          for (const r of lastResult) {
            const mappedResults = parseOptions(`ctx.results[${index}][..]`, r, options.options, options.mode, options.ignoreUndefined);
            ctx.logger.debug(`ctx.results[%s] mapped to %s`, index, inspect(mappedResults));
            newList.push(mappedResults);
          }
          return newList;
        } else {
          const mappedResults = parseOptions(`ctx.results[${index}]`, lastResult, options.options, options.mode, options.ignoreUndefined);
          ctx.logger.debug(`ctx.results[%s] mapped to %s`, index, inspect(mappedResults));
          return mappedResults;
        }
      } catch (e) {
        ctx.logger.error(`error parsing lastResult[%s]`, inspect(lastResult));
        throw e;
      }
    }
  };
