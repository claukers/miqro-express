import { Context, Handler } from "../handler";

export const Logger = (options?: {
  formatter: (ctx: Context) => string;
}): Handler =>
  async (ctx: Context) => {
    ctx.res.on("close", () => {
      const took = Date.now() - ctx.startMS;
      ctx.tookMS = took;
      const contentLength = (ctx.res as any)._contentLength;
      ctx.logger.info(contentLength);
      const entry = options ? options.formatter(ctx) : `request[${ctx.uuid}](${ctx.req.socket.remoteAddress}) [${ctx.method}] [${ctx.path}] [${ctx.res.statusCode}] content-length[${contentLength}] [${ctx.tookMS}]ms`;
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
