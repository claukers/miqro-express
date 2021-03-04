import { Context, ErrorHandler } from "./common";
import { BAD_REQUEST, ERROR_RESPONSE, FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "./common/response";

export const DefaultErrorHandler = (): ErrorHandler => {
  return async (e: Error, ctx: Context) => {
    if (!e.name || e.name === "Error") {
      if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
        await ctx.end(ERROR_RESPONSE(`${e.message}. You are seeing this message because NODE_ENV === "development" || NODE_ENV === "test"`));
        return false;
      }
    } else {
      switch (e.name) {
        case "MethodNotImplementedError":
          await ctx.end(NOT_FOUND(e.message));
          break;
        case "ForbiddenError":
          await ctx.end(FORBIDDEN(e.message));
          break;
        case "UnAuthorizedError":
          await ctx.end(UNAUTHORIZED(e.message));
          break;
        case "ParseOptionsError":
        case "SequelizeValidationError":
        case "SequelizeEagerLoadingError":
        case "SequelizeUniqueConstraintError":
          await ctx.end(BAD_REQUEST(e.message));
          break;
        default:
          await ctx.end(ERROR_RESPONSE(e.message));
          break;
      }
      return false;
    }
    ctx.logger.warn(`cannot create error response for error message[${e.message}] so not sending error response`);
    return true;
  };
};
