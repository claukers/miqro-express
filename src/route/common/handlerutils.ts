import {
  APIResponse,
  BadRequestResponse,
  ErrorResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ServiceResponse,
  UnAuthorizedResponse
} from "../response";

/* eslint-disable  @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    // tslint:disable-next-line:interface-name
    interface Request {
      results: any[];
      session: any;
      uuid: string;
    }
  }
}

export type NextFunction = (e?: Error) => void;

export type IErrorHandlerCallback = (err: Error, req: any, res: any, next: NextFunction) => Promise<any>;
export type IHandlerCallback = (req: any, res: any) => Promise<any>;
export type ICallback = (req: any, res: any) => any;
export type INextCallback = (req: any, res: any, next: NextFunction) => any;
export type INextHandlerCallback = (req: any, res: any, next: NextFunction) => Promise<any>;

export const createErrorResponse = async (e: Error): Promise<APIResponse> => {
  if (!e.name || e.name === "Error") {
    return null;
  } else {
    // noinspection SpellCheckingInspection
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

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const createServiceResponse = async (req: any): Promise<ServiceResponse> => {
  const {results} = req;
  if (!results || results.length === 0) {
    return null;
  }
  const response = results && results.length > 1 ? results : (
    results && results.length === 1 ? results[0] : null
  );
  return new ServiceResponse(response);
};

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const setResults = (req: any, results: any[]): void => {
  req.results = results;
};

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const getResults = (req: any): any[] => {
  if (!(req.results)) {
    setResults(req, []);
  }
  return req.results;
};
