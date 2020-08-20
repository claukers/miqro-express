import {FeatureHandler, Handler, NextCallback, ResponseHandler} from "../../src/handler";
import {Logger} from "@miqro/core";

const hello: FeatureHandler = (logger: Logger): NextCallback[] | NextCallback => {
  return [
    Handler(async () => {
      return {
        message: "hello"
      };
    }, logger),
    ResponseHandler(logger)
  ];
}

module.exports = {
  path: "/",
  handler: hello
};
