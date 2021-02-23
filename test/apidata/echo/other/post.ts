import { FeatureHandler, ResponseHandler } from "../../../../src/handler";
import { Logger } from "@miqro/core";

const echo: FeatureHandler = [
  async (ctx) => {
    ctx.logger.info(ctx.body);
    ctx.results.push(ctx.body);
    return true;
  },
  ResponseHandler(undefined)
];


module.exports = {
  path: "/",
  handler: echo
};
