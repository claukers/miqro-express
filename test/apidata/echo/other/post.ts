import {FeatureHandler, Handler, NextCallback, ResponseHandler} from "../../../../src/handler";
import {Logger} from "@miqro/core";

const echo: FeatureHandler = (logger: Logger): NextCallback[] | NextCallback => {
  return [
    Handler(async (req) => {
      logger.info(req.body);
      return req.body;
    }, logger),
    ResponseHandler(logger)
  ];
}

module.exports = {
  path: "/",
  handler: echo
};
