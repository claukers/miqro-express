import { FeatureHandler, ResponseHandler } from "../../../../src/handler";

const echo: FeatureHandler =
  [
    async (ctx) => {
      ctx.logger.info(ctx.params.name);
      ctx.results.push(`hello ${ctx.params.name}`);
      return true;
    },
    ResponseHandler()
  ];


module.exports = {
  path: "/:name",
  handler: echo
};
