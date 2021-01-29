import {APIRoute, FeatureHandler, Handler, NextCallback, ResponseHandler} from "../../src/handler";
import {Logger} from "@miqro/core";
import {RouterOptions} from "express";

const hello: FeatureHandler = (logger: Logger): NextCallback[] | NextCallback => {
  return [
    Handler(async () => {
      return {
        message: "custom"
      };
    }, logger),
    ResponseHandler(undefined, logger)
  ];
}

module.exports = {
  path: "/",
  methods: ["delete", "put"],
  name: "mycustom",
  handler: hello
} as APIRoute;
