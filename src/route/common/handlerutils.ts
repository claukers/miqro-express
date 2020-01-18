import {Request} from "express";
import {
  APIResponse,
  BadRequestResponse,
  ErrorResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ServiceResponse,
  UnAuthorizedResponse
} from "../response";

// noinspection JSUnusedLocalSymbols
export const createErrorResponse = async (e, req: Request): Promise<APIResponse> => {
  if (!e.name || e.name === "Error") {
    return null;
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

export const createServiceResponse = (results: any) => {
  if (!results || results.length === 0) {
    return null;
  }
  const response = results && results.length > 1 ? results : (
    results && results.length === 1 ? results[0] : null
  );
  return new ServiceResponse(response);
};

export const setResults = (req, results: any[]) => {
  (req as any).results = results;
};

export const getResults = (req): any[] => {
  if (!((req as any).results)) {
    setResults(req, []);
  }
  return (req as any).results;
};
