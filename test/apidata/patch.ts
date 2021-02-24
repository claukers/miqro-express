import { Context, ResponseHandler } from "../../src/handler";

export default {
  path: ["/:name", "/bla/:name"],
  handler: [
    async (ctx: Context) => {
      ctx.logger.info(ctx.params.name);
      ctx.results.push(`bye ${ctx.params.name}`);
      return true;
    },
    ResponseHandler()
  ]
}
