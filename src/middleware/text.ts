import { Handler, Context, checkEnvVariables, BAD_REQUEST } from "@miqro/core";
import { DEFAULT_READ_BUFFER_LIMIT } from "./buffer";

export const TextParser = (options?: {
  limit: number;
  type: string;
}): Handler => {
  let limit = DEFAULT_READ_BUFFER_LIMIT;
  let type = "plain/text";
  if (options) {
    limit = options.limit;
    type = options.type;
  } else {
    const [limitS, typeS] =
      checkEnvVariables(["BODY_TEXT_PARSER_LIMIT", "BODY_TEXT_PARSER_TYPE"], [String(DEFAULT_READ_BUFFER_LIMIT), "plain/text"]);
    limit = parseInt(limitS, 10);
    type = typeS;
  }
  return async (ctx: Context) => {
    try {
      const isType = ctx.body === undefined && ctx.headers["content-type"] ? ctx.headers["content-type"].toLocaleLowerCase().indexOf(type.toLocaleLowerCase()) !== -1 : false;
      if (isType && ctx.buffer && ctx.buffer.length <= limit) {
        const string = ctx.buffer.toString();
        ctx.body = string;
      } else if (isType && ctx.buffer && ctx.buffer.length > limit) {
        ctx.logger.warn(`ctx.buffer.length ${ctx.buffer.length} > ${limit}. To accept this body set BODY_TEXT_PARSER_LIMIT to a higher value.`);
      }
      return true;
    } catch (e) {
      ctx.logger.error(e);
      await ctx.end(BAD_REQUEST(`cannot parse body: ${e.message}`));
    }
  };
};
