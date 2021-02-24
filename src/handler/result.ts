import { parseOptions } from "@miqro/core";
import { inspect } from "util";
import { Context, Handler, ParseOptions } from "./common";

export const ResultParser = (options: ParseOptions): Handler =>
  async (ctx: Context) => {
    const { results, query, logger } = ctx;
    if (results && !query.attributes) {
      const mappedResults = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result instanceof Array) {
          for (let j = 0; j < result.length; j++) {
            const r = result[j];
            mappedResults.push(parseOptions(`ctx.results[${i}][${j}]`, r, options.options, options.mode, options.ignoreUndefined));
          }
        } else {
          mappedResults.push(parseOptions(`ctx.results[${i}]`, result, options.options, options.mode, options.ignoreUndefined));
        }
      }
      logger.debug(`ctx.results mapped to ${inspect(mappedResults)}`);
      ctx.results = mappedResults;
    } else if (query.attributes) {
      logger.debug(`ignoring mapping result because req.query.attributes was send`);
    }
    return true;
  };
