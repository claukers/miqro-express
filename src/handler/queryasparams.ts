import { getLogger, Logger, ParseOption, parseOptions, ParseOptionsMode, SimpleMap, SimpleTypes } from "@miqro/core";
import { Request } from "express";
import { CatchHandler, NextCallback } from "./common";

export const someQueryAsParams = (req: Request, queryArgs: ParseOption[]): SimpleMap<SimpleTypes> => {
  const query = parseQueryOptions("query", req.query, queryArgs, "add_extra");
  const queryNames = queryArgs.map(q => q.name);
  for (const queryName of queryNames) {
    if (query[queryName] !== undefined) {
      req.params[queryName] = query[queryName] as string;
      delete req.query[queryName];
    }
  }
  return query;
};

export const QueryAsParamsHandler = (options: ParseOption[], logger?: Logger): NextCallback => {
  if (!logger) {
    logger = getLogger("QueryAsParamsHandler");
  }
  return CatchHandler(async (req, res, next) => {
    someQueryAsParams(req, options);
    next();
  }, logger);
};

export interface ValidateQueryHandlerOptions {
  options: ParseOption[];
  mode: ParseOptionsMode;
}

export const ValidateQueryHandler = ({ options, mode }: ValidateQueryHandlerOptions, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = getLogger("ValidateQueryHandler");
  }
  return CatchHandler(async (req, res, next) => {
    req.query = parseQueryOptions("query", req.query, options, mode) as any;
    next();
  }, logger);
};

export interface ValidateParamsHandlerOptions {
  options: ParseOption[];
  mode: ParseOptionsMode;
}

export const ValidateParamsHandler = ({ options, mode }: ValidateParamsHandlerOptions, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = getLogger("ValidateParamsHandler");
  }
  return CatchHandler(async (req, res, next) => {
    req.params = parseOptions("params", req.params, options, mode, true) as any;
    next();
  }, logger);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const parseQueryOptions = (name: string, query: any, options: ParseOption[], mode: ParseOptionsMode): SimpleMap<SimpleTypes> => {
  const arrayNames = options.filter(q => q.type === "array").map(q => q.name);
  for (const arrayName of arrayNames) {
    if (query[arrayName] !== undefined && typeof query[arrayName] === "string") {
      query[arrayName] = [query[arrayName]] as any;
    }
  }
  return parseOptions(name, query, options, mode);
};
