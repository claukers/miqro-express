import { Context, Handler } from "./common";

export const TagResponseUUIDHandler = (): Handler =>
  async (ctx: Context) => {
    ctx.setHeader("uuid", ctx.uuid);
    const requestUUID = ctx.headers['request-uuid'];
    if (requestUUID) {
      ctx.setHeader("request-uuid", requestUUID);
    }
    return true;
  };

