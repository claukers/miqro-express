import { Context, Handler, parseOptions } from "@miqro/core";
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
      ctx.logger.debug(`parsing lastResult[${inspect(lastResult)}]`);
      const mappedResults = parseOptions(`ctx.results[${index}]`, lastResult, options.options, options.mode, options.ignoreUndefined);
      ctx.logger.debug(`ctx.results[${index}] mapped to ${inspect(mappedResults)}`);
      return mappedResults;
    }
  };
