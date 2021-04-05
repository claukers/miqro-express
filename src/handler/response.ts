import { inspect } from "util";
import { Handler, Context } from "@miqro/core";

export const ResponseHandler = (): Handler =>
  async (ctx: Context) => {
    ctx.logger.debug(`results[${inspect(ctx.results)}]`);
    if (!ctx.results || ctx.results.length === 0) {
      return undefined;
    }
    const response = ctx.results && ctx.results.length > 1 ? ctx.results : (
      ctx.results && ctx.results.length === 1 ? ctx.results[0] : undefined
    );

    ctx.logger.debug(`response[${inspect(response)}]`);
    if (response !== undefined) {
      await ctx.json({
        success: response ? true : false,
        result: response
      });
    } else {
      throw new Error(`no response to send. Is your handler returning a value differente than boolean 'true|false' ?`);
    }
  };


