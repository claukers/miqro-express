import { Context, ResponseHandler } from "../../src/handler";

export default {
  path: "/",
  query: {
    options: {
      name: {
        type: "string",
        required: true
      }
    },
    mode: "no_extra"
  },
  handler: [
    async (ctx: Context) => {
      ctx.logger.info(ctx.query.name);
      return `bye ${ctx.query.name}`
    },
    ResponseHandler()
  ]
}
