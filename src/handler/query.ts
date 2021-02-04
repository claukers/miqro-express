import { ParseOption, parseOptions, SimpleMap, SimpleTypes } from "@miqro/core";
import { Request } from "express";
import { CatchHandler, NextCallback } from "./common";

export const someQueryAsParams = (req: Request, queryArgs: ParseOption[]): SimpleMap<SimpleTypes> => {
  const query = parseOptions("query", req.query as any, queryArgs, "remove_extra", true);
  const queryNames = queryArgs.map(q => q.name);
  for (const queryName of queryNames) {
    if (query[queryName] !== undefined) {
      req.params[queryName] = query[queryName] as string;
      delete req.query[queryName];
    }
  }
  return query;
};

export const QueryAsParamsHandler = (options: ParseOption[]): NextCallback => {
  return CatchHandler(async (req, res, next) => {
    someQueryAsParams(req, options);
    next();
  });
};
