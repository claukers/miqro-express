import { FeatureHandler, ResponseHandler } from "../../../src/handler";

const echo: FeatureHandler =
  [
    async (ctx) => {
      ctx.logger.info(ctx.body);
      const bla = ctx.body.asd;
      ctx.results.push(ctx.body);
      return true;
    },
    ResponseHandler()
  ];

module.exports = {
  path: "/",
  handler: echo
};
