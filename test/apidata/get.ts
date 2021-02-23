import { Context, ResponseHandler } from "../../src/handler";

export default {
  path: "/:name",
  handler: [
    async (ctx: Context) => {
      ctx.logger.info(ctx.params.name);
      return `bye ${ctx.params.name}`
    },
    ResponseHandler()
  ]
}
