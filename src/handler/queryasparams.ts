import { getLogger, ParseOption, parseOptions, SimpleMap, SimpleTypes } from "@miqro/core";
import { Request } from "express";
import { CatchHandler, NextCallback } from "./common";

export const someQueryAsParams = (req: Request, queryArgs: ParseOption[]): SimpleMap<SimpleTypes> => {
  const query = parseOptions("query", req.query as any, queryArgs, "add_extra");
  const queryNames = queryArgs.map(q => q.name);
  for (const queryName of queryNames) {
    if (query[queryName] !== undefined) {
      req.params[queryName] = query[queryName] as string;
      delete req.query[queryName];
    }
  }
  return query;
}

export const QueryAsParams = (options: ParseOption[], logger = getLogger("QueryAsParams")): NextCallback =>
  CatchHandler(async (req, res, next) => {
    someQueryAsParams(req, options);
    next();
  }, logger);
