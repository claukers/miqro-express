import { Handler, Context } from "@miqro/core";

export const JSONfyResultsHandler = (): Handler =>
  async (ctx: Context) => {
    const results = ctx.results;
    ctx.results = JSON.parse(JSON.stringify(results)) as any[];
    return true;
  }

