import { getLogger, Logger, ParseOption, parseOptions, ParseOptionsError, ParseOptionsMode } from "@miqro/core";
import { CatchHandler, NextCallback } from "./common";

export interface ValidateBodyHandlerOptions { disableBodyAsArray?: boolean; mode?: ParseOptionsMode; options: ParseOption[]; ignoreUndefined?: boolean; }

export const ValidateBodyHandler = (options: ValidateBodyHandlerOptions, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = getLogger("ValidateBodyHandler");
  }
  return CatchHandler(async (req, res, next) => {
    if (options.disableBodyAsArray && req.body instanceof Array) {
      throw new ParseOptionsError(`body cannot be an array`);
    }
    const bodies = req.body instanceof Array ? req.body : [req.body];
    for (const body of bodies) {
      parseOptions("body", body, options.options, options.mode, options.ignoreUndefined);
    }
    next();
  }, logger);
}

