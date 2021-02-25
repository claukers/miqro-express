import { Context, createErrorResponse, ErrorHandler } from "./common";

export const DefaultErrorHandler = (): ErrorHandler => {
  return async (err: Error, ctx: Context) => {
    ctx.logger.error(err);
    const response = createErrorResponse(err);
    if (response) {
      await response.send(ctx);
    } else {
      ctx.logger.warn(`cannot create error response for error message[${err.message}] so not sending error response`);
    }
  };
};
