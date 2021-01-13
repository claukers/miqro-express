import {getLogger, Logger, ParseOption, parseOptions, ParseOptionsError, ParseOptionsMode} from "@miqro/core";
import {CatchHandler, NextCallback} from "./common";

export interface ValidateBodyHandlerOptions {
  disableBodyAsArray?: boolean;
  mode?: ParseOptionsMode;
  options: ParseOption[];
  ignoreUndefined?: boolean;
}

export const ValidateBodyHandler = (options: ValidateBodyHandlerOptions, logger?: Logger): NextCallback => {
  if (!logger) {
    logger = getLogger("ValidateBodyHandler");
  }
  return CatchHandler(async (req, res, next) => {
    if (options.disableBodyAsArray && req.body instanceof Array) {
      throw new ParseOptionsError(`body cannot be an array`);
    }
    const bodies = req.body instanceof Array ? req.body : [req.body];
    if(req.body instanceof Array) {
      for(let i=0; i < req.body.length; i++) {
        req.body[i] = parseOptions("body", req.body[i], options.options, options.mode, options.ignoreUndefined);
      }
    } else {
      req.body = parseOptions("body", req.body, options.options, options.mode, options.ignoreUndefined);
    }
    next();
  }, logger);
};

