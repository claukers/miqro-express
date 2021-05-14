import { Handler, Context, BadRequestError, checkEnvVariables } from "@miqro/core";
import { DEFAULT_READ_BUFFER_LIMIT } from "./buffer";

export const JSONParser = (options?: {
  limit: number;
  strict: boolean;
  type: string;
}): Handler => {
  let strict = true;
  let limit = DEFAULT_READ_BUFFER_LIMIT;
  let type = "application/json";
  if (options) {
    strict = options.strict !== undefined ? options.strict : strict;
    limit = options.limit !== undefined ? options.limit : limit;
    type = options.type !== undefined ? options.type : type;
  } else {
    const [limitS, strictS, typeS] =
      checkEnvVariables(["BODY_PARSER_LIMIT", "BODY_PARSER_STRICT", "BODY_PARSER_TYPE"], [String(DEFAULT_READ_BUFFER_LIMIT), "true", "application/json"])
    strict = strictS === "true";
    limit = parseInt(limitS, 10);
    type = typeS;
  }
  return async (ctx: Context) => {
    try {
      const isType = ctx.body === undefined && ctx.headers["content-type"] ? ctx.headers["content-type"].toLocaleLowerCase().indexOf(type.toLocaleLowerCase()) !== -1 : false;
      if (isType && ctx.buffer && ctx.buffer.length <= limit) {
        const string = ctx.buffer.toString();
        if (string) {
          const parsed = JSON.parse(string);
          if (parsed instanceof Array && strict) {
            throw new BadRequestError(`body cannot be an array`, 'body');
          }
          ctx.body = parsed;
        }
      } else if (isType && ctx.buffer && ctx.buffer.length > limit) {
        ctx.logger.error(`ctx.buffer.length ${ctx.buffer.length} > ${limit}. To accept this body set BODY_PARSER_LIMIT to a higher value.`);
        throw new BadRequestError();
      }
      return true;
    } catch (e) {
      ctx.logger.error(e);
      throw new BadRequestError();
    }
  };
};
