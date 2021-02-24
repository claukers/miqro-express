import { inspect } from "util";
import { Handler, Context, createServiceResponse } from "./common";

export const ResponseHandler = (): Handler =>
  async (ctx: Context) => {
    ctx.logger.debug(`results[${inspect(ctx.results)}]`);
    const response = createServiceResponse(ctx);
    ctx.logger.debug(`response[${inspect(response)}]`);
    if (response !== undefined) {
      await response.send(ctx);
    } else {
      throw new Error(`no response to send. Is your handler returning a value differente than boolean 'true|false' ?`);
    }
  };


