import { Handler, Context } from "@miqro/core";
import { v4 } from "uuid";

export const UUIDHandler = (): Handler => {
  return async (ctx: Context) => {
    ctx.uuid = ctx.uuid ? ctx.uuid : v4();
    return true;
  };
}

