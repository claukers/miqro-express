import { inspect } from "util";
import { Handler, Context } from "@miqro/core";

export const ResponseHandler = (): Handler<void> =>
  async (ctx: Context): Promise<void> => {
    // ctx.logger.debug(`results[${inspect(ctx.results)}]`);
    if (!ctx.results || ctx.results.length === 0) {
      throw new Error(`no response to send. Is your handler returning a value differente than boolean 'true|false' ?`);
    } else {
      const lastResult = ctx.results[ctx.results.length - 1];
      ctx.logger.debug("response [%s]", inspect(lastResult));
      if (lastResult !== undefined) {
        await ctx.json(lastResult);
      } else {
        throw new Error(`no response to send. Is your handler returning a value differente than boolean 'true|false' ?`);
      }
    }
  };


