import {Handler, NextCallback, ResponseHandler} from "../../src/handler";
import {Logger} from "@miqro/core";

export default {
  path: ["/:name", "/bla/:name"],
  handler: (logger: Logger): NextCallback[] | NextCallback => {
    return [
      Handler(async (req) => {
        logger.info(req.params.name);
        return `bye ${req.params.name}`
      }, logger),
      ResponseHandler(undefined, logger)
    ];
  }
}
