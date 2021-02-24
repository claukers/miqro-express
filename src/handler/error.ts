import { Context, createErrorResponse, Handler } from "./common";
import { APIResponse } from "../responses";

export interface ErrorHandlerOptions {
  createResponse: (err: Error) => APIResponse | null;
}

export const ErrorHandler = (options?: ErrorHandlerOptions): Handler => {
  return async (ctx: Context) => {
    ctx.on("error", async (err: Error) => {
      ctx.logger.error(err);
      const response = options ? options.createResponse(err) : createErrorResponse(err);
      if (response) {
        response.send(ctx);
        return false;
      } else {
        ctx.logger.warn(`cannot create error response for error message[${err.message}] so not sending error response`);
        return true;
      }
    });
    return true;
  };
};
