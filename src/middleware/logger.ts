import { Context, Handler } from "@miqro/core";

export const LoggerHandler = (options?: {
  formatter: (ctx: Context) => string;
}): Handler =>
  async (ctx: Context) => {
    ctx.res.on("close", () => {
      const took = Date.now() - ctx.startMS;
      ctx.tookMS = took;
      const entry = options ? options.formatter(ctx) : `status[${ctx.res.statusCode}] content-length[${(ctx.res as any)._contentLength}] [${ctx.tookMS}]ms`;
      if (ctx.res.statusCode < 400) {
        ctx.logger.info(entry);
      } else if (ctx.res.statusCode >= 400 && ctx.res.statusCode < 500) {
        ctx.logger.warn(entry);
      } else {
        ctx.logger.error(entry);
      }
    });
    return true;
  }
