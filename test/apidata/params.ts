

import { Context } from "@miqro/core";

export default {
  path: "/params/:bla/:optionalParam?",
  methods: ["POST"],
  params: {
    options: {
      bla: "string",
      optionalParam: {
        type: "string",
        required: false
      }
    },
    mode: "no_extra"
  },
  handler: [
    async (ctx: Context) => {
      ctx.logger.info(ctx.params);
      ctx.json({ params: ctx.params });
    }
  ]
}
