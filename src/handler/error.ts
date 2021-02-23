import { Context, Handler } from "./common";
import { APIResponse, BadRequestResponse, ErrorResponse, ForbiddenResponse, NotFoundResponse, UnAuthorizedResponse } from "./responses";

export const createErrorResponse = (e: Error): APIResponse | null => {
  if (!e.name || e.name === "Error") {
    if (process.env.NODE_ENV === "production") {
      return null;
    } else {
      return new ErrorResponse(e);
    }
  } else {
    switch (e.name) {
      case "MethodNotImplementedError":
        return new NotFoundResponse();
      case "ForbiddenError":
        return new ForbiddenResponse(e.message);
      case "UnAuthorizedError":
        return new UnAuthorizedResponse(e.message);
      case "ParseOptionsError":
      case "SequelizeValidationError":
      case "SequelizeEagerLoadingError":
      case "SequelizeUniqueConstraintError":
        return new BadRequestResponse(e.message);
      default:
        return new ErrorResponse(e);
    }
  }
};

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
        ctx.logger.warn(`cannot create response of error message[${err.message}] so not responding and calling next`);
        return true;
      }
    });
    return true;
  };
};
