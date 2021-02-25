import { checkEnvVariables } from "@miqro/core";
import { Handler, Context, BadRequestError } from "../handler";
import { BAD_REQUEST } from "../handler/common/response";

export const JSONParser = (options?: {
  limit: number;
  strict: boolean;
  type: string;
}): Handler => {
  let strict = false;
  let limit = 1000;
  let type = "application/json";
  if (options) {
    strict = options.strict;
    limit = options.limit;
    type = options.type;
  } else {
    const [limitS, strictS, typeS] =
      checkEnvVariables(["BODY_PARSER_LIMIT", "BODY_PARSER_STRICT", "BODY_PARSER_TYPE"], ["1000", "false", "application/json"])
    strict = strictS === "true";
    limit = parseInt(limitS, 10);
    type = typeS;
  }
  return async (ctx: Context) => {
    try {
      const isType = ctx.headers["content-type"] ? ctx.headers["content-type"].toLocaleLowerCase().indexOf(type.toLocaleLowerCase()) !== -1 : false;
      if (isType && ctx.buffer && ctx.buffer.length <= limit) {
        const string = ctx.buffer.toString();
        if (string) {
          const parsed = JSON.parse(string);
          if (parsed instanceof Array && strict) {
            throw new BadRequestError(`body cannot be an array`, 'body');
          }
          ctx.body = parsed;
        }
      }
      return true;
    } catch (e) {
      ctx.logger.error(e);
      await ctx.end(BAD_REQUEST(`cannot parse body: ${e.message}`));
    }
  };
};
