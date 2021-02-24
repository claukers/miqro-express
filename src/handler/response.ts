import { inspect } from "util";
import { Handler, Context, createServiceResponse } from "./common";

export const ResponseHandler = (): Handler =>
  async (ctx: Context) => {
    ctx.logger.debug(`results[${inspect(ctx.results)}]`);
    const response = createServiceResponse(ctx);
    if (response !== undefined) {
      ctx.logger.debug(`response[${inspect(response)}]`);
      await response.send(ctx);
    } else {
      ctx.logger.warn(`no response to send. is your handler returning a value differente than boolean 'true|false' ?`);
    }
    return false;
  };


