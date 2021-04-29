import { Context, Handler, parseOptions } from "@miqro/core";
import { inspect } from "util";
import { ParseOptions } from "./common";

export const ResultParser = (options: ParseOptions | ParseOptions[]): Handler =>
  async (ctx: Context) => {
    if (!ctx.results || ctx.results.length === 0) {
      ctx.logger.debug(`not parsing results`);
      return undefined;
    } else {
      const index = ctx.results.length - 1;
      const lastResult = ctx.results[ctx.results.length - 1];
      ctx.logger.debug(`parsing lastResult[%s]`, inspect(lastResult));
      try {
        if (options instanceof Array) {
          for (let i = 0; i < options.length; i++) {
            const o = options[i];
            try {
              const mappedResults = parseOptions(`ctx.results[${index}]`, lastResult, o.options, o.mode, o.ignoreUndefined);
              ctx.logger.debug(`ctx.results[%s] mapped to %s`, index, inspect(mappedResults));
              return mappedResults;
            } catch (e) {
              if (i === options.length - 1) {
                throw e;
              } else {
                continue;
              }
            }
          }
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
