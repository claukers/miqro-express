import { Context, Handler } from "@miqro/core";

export const TagResponse = (): Handler<void> =>
  async (ctx: Context): Promise<void> => {
    ctx.setHeader("uuid", ctx.uuid);
    const requestUUID = ctx.headers['request-uuid'];
    if (requestUUID) {
      ctx.setHeader("request-uuid", requestUUID);
    }
  };

