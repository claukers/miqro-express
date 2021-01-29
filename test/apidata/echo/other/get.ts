import {FeatureHandler, Handler, NextCallback, ResponseHandler} from "../../../../src/handler";
import {Logger} from "@miqro/core";

const echo: FeatureHandler = (logger: Logger): NextCallback[] | NextCallback => {
  return [
    Handler(async (req) => {
      logger.info(req.params.name);
      return `hello ${req.params.name}`
    }, logger),
    ResponseHandler(undefined, logger)
  ];
}

module.exports = {
  path: "/:name",
  handler: echo
};
