import { v4 } from "uuid";
import { Handler, Context } from "../handler";

export const UUIDHandler = (): Handler => {
  return async (ctx: Context) => {
    ctx.uuid = v4();
    return true;
  };
};
