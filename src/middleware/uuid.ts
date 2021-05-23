import { Handler, Context } from "@miqro/core";
import { v4 } from "uuid";

export const UUIDHandler = (): Handler<void> => {
  return async (ctx: Context): Promise<void> => {
    ctx.uuid = ctx.uuid ? ctx.uuid : v4();
  };
}

