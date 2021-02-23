import { Context, Handler } from "../handler";

export const LoggerHandler = (): Handler =>
  async (ctx: Context) => {
    ctx.res.on("close", () => {
      const took = 0;
      const entry = `request[${ctx.uuid}](${ctx.req.socket.remoteAddress}) [${ctx.method}] [${ctx.pathname}] [${ctx.res.statusCode}] conttent-length[${ctx.res.getHeaders()["content-length"]}] [${took}]ms`;
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
