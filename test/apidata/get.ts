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
      ctx.json({ success: true, result: `bye ${ctx.query.name}` });
    }
  ]
}
