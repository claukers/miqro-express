import {FeatureHandler, Handler, NextCallback, ResponseHandler} from "../../../src/handler";
import {Logger} from "@miqro/core";

const echo: FeatureHandler = (logger: Logger): NextCallback[] | NextCallback => {
  return [
    Handler(async (req) => {
      return req.body;
    }, logger),
    ResponseHandler(logger)
  ];
}

module.exports = echo;
